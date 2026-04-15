const { verify } = require('../utils/jwt');
const HttpError = require('../utils/HttpError');

module.exports = function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }
  try {
    const payload = verify(token);
    if (payload.role !== 'admin') {
      return next(new HttpError(403, 'Forbidden'));
    }
    req.user = payload;
    next();
  } catch (e) {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};
