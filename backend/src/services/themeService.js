const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

async function list() {
  return prisma.theme.findMany({ orderBy: { created_at: 'desc' } });
}

async function getById(id) {
  const theme = await prisma.theme.findUnique({ where: { id } });
  if (!theme) throw new HttpError(404, 'Theme not found');
  return theme;
}

async function getActive() {
  return prisma.theme.findFirst({ where: { is_active: true } });
}

async function create(data) {
  if (data.is_active) {
    await prisma.theme.updateMany({ data: { is_active: false } });
  }
  return prisma.theme.create({ data });
}

async function update(id, data) {
  await getById(id);
  if (data.is_active) {
    await prisma.theme.updateMany({ data: { is_active: false } });
  }
  return prisma.theme.update({ where: { id }, data });
}

async function remove(id) {
  await getById(id);
  await prisma.theme.delete({ where: { id } });
}

async function activate(id) {
  await getById(id);
  await prisma.theme.updateMany({ data: { is_active: false } });
  return prisma.theme.update({ where: { id }, data: { is_active: true } });
}

module.exports = { list, getById, getActive, create, update, remove, activate };
