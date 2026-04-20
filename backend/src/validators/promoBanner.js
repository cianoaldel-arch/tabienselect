const { z } = require('zod');

const imageUrl = z
  .string()
  .max(2_000_000)
  .refine((v) => v.startsWith('data:image/') || /^https?:\/\//.test(v) || v.startsWith('/'), {
    message: 'image_url must be a URL, root-relative path, or data URL',
  });

const base = {
  headline: z.string().min(1).max(200),
  highlight: z.string().min(1).max(200),
  subheadline: z.string().max(500).nullable().optional(),
  plate_code: z.string().min(1).max(32),
  plate_region: z.string().min(1).max(64),
  image_url: imageUrl.nullable().optional(),
  footer_title: z.string().min(1).max(100),
  footer_tagline: z.string().min(1).max(100),
  phone: z.string().min(1).max(100),
  line_id: z.string().min(1).max(100),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().optional(),
};

exports.createPromoBannerSchema = z.object(base);
exports.updatePromoBannerSchema = z.object(base).partial();
