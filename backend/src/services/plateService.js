const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

async function list({ category, plate_type, q, page, limit }) {
  const where = {};
  if (category) where.category = category;
  if (plate_type) where.plate_type = plate_type;
  if (q) {
    where.OR = [
      { full_plate: { contains: q, mode: 'insensitive' } },
      { number: { contains: q, mode: 'insensitive' } },
      { prefix: { contains: q, mode: 'insensitive' } },
    ];
  }

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

async function listCategories() {
  const grouped = await prisma.plate.groupBy({
    by: ['category'],
    _count: { _all: true },
    orderBy: { category: 'asc' },
  });
  return {
    items: grouped
      .filter((g) => g.category && g.category.trim() !== '')
      .map((g) => ({ category: g.category, count: g._count._all })),
  };
}

module.exports = { list, getById, create, update, remove, listCategories };
