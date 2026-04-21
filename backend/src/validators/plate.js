const { z } = require('zod');

const plateBase = {
  prefix: z.string().min(1).max(10),
  number: z.string().min(1).max(10),
  full_plate: z.string().min(1).max(32),
  category: z.string().min(1).max(64),
  plate_type: z.string().min(1).max(64),
  numerology_sum: z.number().int().min(0).max(999),
  price: z.number().int().min(0).default(0),
  line_qr_url: z.string().url(),
  contact_text: z.string().min(1).max(500),
};

exports.createPlateSchema = z.object(plateBase);

exports.updatePlateSchema = z.object(plateBase).partial();

exports.listPlatesQuerySchema = z.object({
  category: z.string().optional(),
  plate_type: z.string().optional(),
  q: z.string().trim().max(64).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
