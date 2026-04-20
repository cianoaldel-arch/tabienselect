const prisma = require('../config/prisma');

async function list() {
  const rows = await prisma.config.findMany();
  return rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
}

async function get(key) {
  const row = await prisma.config.findUnique({ where: { key } });
  return row?.value ?? null;
}

async function upsert(key, value) {
  return prisma.config.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

async function remove(key) {
  await prisma.config.delete({ where: { key } }).catch(() => null);
}

module.exports = { list, get, upsert, remove };
