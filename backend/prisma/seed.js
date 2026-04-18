const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@tabienselect.local';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const password_hash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { password_hash },
    create: { email, password_hash },
  });

  const samples = [
    {
      prefix: 'กก',
      number: '9999',
      full_plate: 'กก 9999',
      category: 'Premium',
      plate_type: 'Sedan',
      numerology_sum: 36,
      line_qr_url: 'https://placehold.co/300x300?text=LINE+QR',
      contact_text: 'Contact via LINE: @tabienselect',
    },
    {
      prefix: 'ขข',
      number: '1234',
      full_plate: 'ขข 1234',
      category: 'Standard',
      plate_type: 'Pickup',
      numerology_sum: 10,
      line_qr_url: 'https://placehold.co/300x300?text=LINE+QR',
      contact_text: 'Contact via LINE: @tabienselect',
    },
    {
      prefix: 'ฆฆ',
      number: '8888',
      full_plate: 'ฆฆ 8888',
      category: 'Lucky',
      plate_type: 'Sedan',
      numerology_sum: 32,
      line_qr_url: 'https://placehold.co/300x300?text=LINE+QR',
      contact_text: 'Contact via LINE: @tabienselect',
    },
  ];

  for (const s of samples) {
    await prisma.plate.upsert({
      where: { full_plate: s.full_plate },
      update: s,
      create: s,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
