const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/HttpError');
const importService = require('../services/importService');

exports.importPlates = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    throw new HttpError(400, 'No file uploaded. Use form field "file".');
  }
  const defaults = {
    line_qr_url:
      typeof req.body?.line_qr_url === 'string'
        ? req.body.line_qr_url.trim()
        : '',
    contact_text:
      typeof req.body?.contact_text === 'string'
        ? req.body.contact_text.trim()
        : '',
  };
  const result = await importService.importPlates(req.file.buffer, defaults);
  res.json(result);
});
