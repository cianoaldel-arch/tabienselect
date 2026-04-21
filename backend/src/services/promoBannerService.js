const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

async function list({ activeOnly = false } = {}) {
  return prisma.promoBanner.findMany({
    where: activeOnly ? { is_active: true } : undefined,
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
  });
}

async function getById(id) {
  const banner = await prisma.promoBanner.findUnique({ where: { id } });
  if (!banner) throw new HttpError(404, 'Promo banner not found');
  return banner;
}

const TEXT_DEFAULTS = {
  headline: '',
  highlight: '',
  plate_code: '',
  plate_region: '',
  footer_title: '',
  footer_tagline: '',
  phone: '',
  line_id: '',
};

function create(data) {
  return prisma.promoBanner.create({ data: { ...TEXT_DEFAULTS, ...data } });
}

async function update(id, data) {
  await getById(id);
  return prisma.promoBanner.update({ where: { id }, data });
}

async function remove(id) {
  await getById(id);
  await prisma.promoBanner.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
