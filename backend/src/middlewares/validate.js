const HttpError = require('../utils/HttpError');

module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  console.log(result);
  
  if (!result.success) {
    return next(
      new HttpError(400, 'Validation failed', result.error.flatten())
    );
  }
  req[source] = result.data;
  next();
};
