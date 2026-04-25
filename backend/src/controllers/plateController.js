const asyncHandler = require('../utils/asyncHandler');
const plateService = require('../services/plateService');

exports.list = asyncHandler(async (req, res) => {
  const data = await plateService.list(req.query);
  res.json(data);
});

exports.listCategories = asyncHandler(async (_req, res) => {
  const data = await plateService.listCategories();
  res.json(data);
});

exports.get = asyncHandler(async (req, res) => {
  const plate = await plateService.getById(req.params.id);
  res.json(plate);
});

exports.create = asyncHandler(async (req, res) => {
  const plate = await plateService.create(req.body);
  res.status(201).json(plate);
});

exports.update = asyncHandler(async (req, res) => {
  const plate = await plateService.update(req.params.id, req.body);
  res.json(plate);
});

exports.remove = asyncHandler(async (req, res) => {
  await plateService.remove(req.params.id);
  res.status(204).end();
});
