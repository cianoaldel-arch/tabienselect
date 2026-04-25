const ExcelJS = require('exceljs');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

const HEADER_ALIASES = {
  prefix: 'prefix',
  number: 'number',
  'full plate': 'full_plate',
  full_plate: 'full_plate',
  fullplate: 'full_plate',
  category: 'category',
  'plate type': 'plate_type',
  plate_type: 'plate_type',
  platetype: 'plate_type',
  type: 'plate_type',
  numerology: 'numerology_sum',
  'numerology sum': 'numerology_sum',
  numerology_sum: 'numerology_sum',
  sum: 'numerology_sum',
  price: 'price',
  'line qr url': 'line_qr_url',
  line_qr_url: 'line_qr_url',
  qr: 'line_qr_url',
  'qr url': 'line_qr_url',
  'contact text': 'contact_text',
  contact_text: 'contact_text',
  contact: 'contact_text',
};

function normalizeHeader(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ');
}

function cellText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    if (value.richText) return value.richText.map((r) => r.text).join('');
    if (value.text !== undefined) return String(value.text);
    if (value.result !== undefined) return String(value.result);
    if (value.hyperlink) return String(value.text || value.hyperlink);
  }
  return String(value);
}

function parseInteger(raw) {
  const text = cellText(raw).trim().replace(/,/g, '');
  if (text === '') return NaN;
  const n = Number(text);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

async function parseWorkbook(buffer) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheet = wb.worksheets[0];
  if (!sheet) throw new HttpError(400, 'Excel file has no worksheets');

  let headerRowIndex = -1;
  let columnMap = {};

  sheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
    if (headerRowIndex !== -1) return;
    const candidate = {};
    let matched = 0;
    row.eachCell({ includeEmpty: false }, (cell, colNum) => {
      const key = HEADER_ALIASES[normalizeHeader(cellText(cell.value))];
      if (key) {
        candidate[key] = colNum;
        matched += 1;
      }
    });
    if (matched >= 3) {
      headerRowIndex = rowNum;
      columnMap = candidate;
    }
  });

  if (headerRowIndex === -1) {
    throw new HttpError(
      400,
      'Could not find a header row. Expected columns like Prefix, Number, Full Plate, Category, Plate Type, Numerology, Price, Contact text.'
    );
  }

  const required = ['prefix', 'number', 'full_plate', 'category', 'plate_type'];
  const missing = required.filter((k) => !columnMap[k]);
  if (missing.length) {
    throw new HttpError(
      400,
      `Missing required columns: ${missing.join(', ')}`
    );
  }

  const rows = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
    if (rowNum <= headerRowIndex) return;
    const get = (key) => {
      const col = columnMap[key];
      return col ? cellText(row.getCell(col).value) : '';
    };
    const data = {
      prefix: get('prefix').trim(),
      number: get('number').trim(),
      full_plate: get('full_plate').trim(),
      category: get('category').trim(),
      plate_type: get('plate_type').trim(),
      numerology_raw: get('numerology_sum'),
      price_raw: get('price'),
      line_qr_url: get('line_qr_url').trim(),
      contact_text: get('contact_text').trim(),
    };
    const allEmpty =
      !data.prefix &&
      !data.number &&
      !data.full_plate &&
      !data.category &&
      !data.plate_type &&
      !data.numerology_raw &&
      !data.price_raw;
    if (allEmpty) return;
    rows.push({ rowNumber: rowNum, data });
  });

  return rows;
}

function buildPayload(raw, defaults) {
  const errors = [];
  const out = {
    prefix: raw.prefix,
    number: raw.number,
    full_plate: raw.full_plate || `${raw.prefix} ${raw.number}`.trim(),
    category: raw.category,
    plate_type: raw.plate_type,
  };

  if (!out.prefix) errors.push('prefix is required');
  if (!out.number) errors.push('number is required');
  if (!out.full_plate) errors.push('full_plate is required');
  if (!out.category) errors.push('category is required');
  if (!out.plate_type) errors.push('plate_type is required');

  if (out.prefix.length > 10) errors.push('prefix max 10 chars');
  if (out.number.length > 10) errors.push('number max 10 chars');
  if (out.full_plate.length > 32) errors.push('full_plate max 32 chars');

  const sum = parseInteger(raw.numerology_raw);
  if (Number.isNaN(sum)) {
    let auto = 0;
    for (const ch of out.number) {
      if (ch >= '0' && ch <= '9') auto += Number(ch);
    }
    out.numerology_sum = auto;
  } else if (sum < 0 || sum > 999) {
    errors.push('numerology_sum must be between 0 and 999');
  } else {
    out.numerology_sum = sum;
  }

  const price = parseInteger(raw.price_raw);
  if (Number.isNaN(price)) {
    out.price = 0;
  } else if (price < 0) {
    errors.push('price must be >= 0');
  } else {
    out.price = price;
  }

  const line = raw.line_qr_url || defaults.line_qr_url;
  if (!line) {
    errors.push('line_qr_url is required (set a default in the form)');
  } else {
    try {
      new URL(line);
      out.line_qr_url = line;
    } catch {
      errors.push('line_qr_url must be a valid URL');
    }
  }

  const contact = raw.contact_text || defaults.contact_text;
  if (!contact) {
    errors.push('contact_text is required (set a default in the form)');
  } else if (contact.length > 500) {
    errors.push('contact_text max 500 chars');
  } else {
    out.contact_text = contact;
  }

  return { payload: out, errors };
}

async function importPlates(buffer, defaults = {}) {
  const rows = await parseWorkbook(buffer);
  const result = {
    total: rows.length,
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  const valid = [];
  const seen = new Set();
  for (const { rowNumber, data } of rows) {
    const { payload, errors } = buildPayload(data, defaults);
    if (errors.length) {
      result.failed += 1;
      result.errors.push({ row: rowNumber, message: errors.join('; ') });
      continue;
    }
    if (seen.has(payload.full_plate)) {
      result.failed += 1;
      result.errors.push({
        row: rowNumber,
        message: `duplicate full_plate "${payload.full_plate}" within file`,
      });
      continue;
    }
    seen.add(payload.full_plate);
    valid.push({ rowNumber, payload });
  }

  if (valid.length === 0) return result;

  const fullPlates = valid.map((v) => v.payload.full_plate);
  const existingFullPlates = new Set();
  const CHUNK = 500;
  for (let i = 0; i < fullPlates.length; i += CHUNK) {
    const slice = fullPlates.slice(i, i + CHUNK);
    const found = await prisma.plate.findMany({
      where: { full_plate: { in: slice } },
      select: { full_plate: true },
    });
    for (const f of found) existingFullPlates.add(f.full_plate);
  }

  const toCreate = [];
  const toUpdate = [];
  for (const v of valid) {
    if (existingFullPlates.has(v.payload.full_plate)) toUpdate.push(v);
    else toCreate.push(v);
  }

  if (toCreate.length) {
    for (let i = 0; i < toCreate.length; i += CHUNK) {
      const slice = toCreate.slice(i, i + CHUNK);
      try {
        const res = await prisma.plate.createMany({
          data: slice.map((s) => s.payload),
          skipDuplicates: true,
        });
        result.inserted += res.count;
        if (res.count < slice.length) {
          result.failed += slice.length - res.count;
        }
      } catch (err) {
        for (const s of slice) {
          try {
            await prisma.plate.create({ data: s.payload });
            result.inserted += 1;
          } catch (e) {
            result.failed += 1;
            result.errors.push({
              row: s.rowNumber,
              message: e instanceof Error ? e.message : 'DB error',
            });
          }
        }
      }
    }
  }

  for (const u of toUpdate) {
    try {
      await prisma.plate.update({
        where: { full_plate: u.payload.full_plate },
        data: u.payload,
      });
      result.updated += 1;
    } catch (err) {
      result.failed += 1;
      result.errors.push({
        row: u.rowNumber,
        message: err instanceof Error ? err.message : 'DB error',
      });
    }
  }

  return result;
}

module.exports = { importPlates };
