const asyncHandler = require('../utils/asyncHandler');
const themeService = require('../services/themeService');

exports.list = asyncHandler(async (_req, res) => {
  res.json({ items: await themeService.list() });
});

exports.active = asyncHandler(async (_req, res) => {
  res.json(await themeService.getActive());
});

exports.get = asyncHandler(async (req, res) => {
  res.json(await themeService.getById(req.params.id));
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await themeService.create(req.body));
});

exports.update = asyncHandler(async (req, res) => {
  res.json(await themeService.update(req.params.id, req.body));
});

exports.remove = asyncHandler(async (req, res) => {
  await themeService.remove(req.params.id);
  res.status(204).end();
});

exports.activate = asyncHandler(async (req, res) => {
  res.json(await themeService.activate(req.params.id));
});
