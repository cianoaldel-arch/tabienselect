const asyncHandler = require('../utils/asyncHandler');
const configService = require('../services/configService');

exports.list = asyncHandler(async (_req, res) => {
  res.json(await configService.list());
});

exports.upsert = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  res.json(await configService.upsert(key, value));
});

exports.remove = asyncHandler(async (req, res) => {
  await configService.remove(req.params.key);
  res.status(204).end();
});
