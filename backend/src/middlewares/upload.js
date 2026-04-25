const multer = require('multer');
const HttpError = require('../utils/HttpError');

const ALLOWED_MIME = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/octet-stream',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const okMime = ALLOWED_MIME.has(file.mimetype);
    const okExt = /\.xlsx?$/i.test(file.originalname || '');
    if (okMime || okExt) return cb(null, true);
    cb(new HttpError(400, 'Only .xlsx or .xls files are allowed'));
  },
});

module.exports = upload;
