const { z } = require('zod');

const imageUrl = z
  .string()
  .max(2_000_000)
  .refine((v) => v.startsWith('data:image/') || /^https?:\/\//.test(v) || v.startsWith('/'), {
    message: 'image_url must be a URL, root-relative path, or data URL',
  });

const base = {
  headline: z.string().max(200).optional(),
  highlight: z.string().max(200).optional(),
  subheadline: z.string().max(500).nullable().optional(),
  plate_code: z.string().max(32).optional(),
  plate_region: z.string().max(64).optional(),
  image_url: imageUrl.nullable().optional(),
  footer_title: z.string().max(100).optional(),
  footer_tagline: z.string().max(100).optional(),
  phone: z.string().max(100).optional(),
  line_id: z.string().max(100).optional(),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().optional(),
};

exports.createPromoBannerSchema = z.object(base);
exports.updatePromoBannerSchema = z.object(base).partial();
