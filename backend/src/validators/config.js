const { z } = require('zod');

exports.upsertConfigSchema = z.object({
  key: z.string().min(1).max(64),
  value: z.string().max(4_000_000),
});
