const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

async function list({ category, plate_type, page, limit }) {
  const where = {};
  if (category) where.category = category;
  if (plate_type) where.plate_type = plate_type;

  const [items, total] = await Promise.all([
    prisma.plate.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.plate.count({ where }),
  ]);

  return { items, total, page, limit };
}

async function getById(id) {
  const plate = await prisma.plate.findUnique({ where: { id } });
  if (!plate) throw new HttpError(404, 'Plate not found');
  return plate;
}

function create(data) {
  return prisma.plate.create({ data });
}

async function update(id, data) {
  await getById(id);
  return prisma.plate.update({ where: { id }, data });
}

async function remove(id) {
  await getById(id);
  await prisma.plate.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
