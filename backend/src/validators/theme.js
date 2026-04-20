const { z } = require('zod');

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

const themeBase = {
  name: z.string().min(1).max(64),
  primary: hex,
  accent: hex,
  background: hex,
  foreground: hex,
  muted: hex,
  is_active: z.boolean().optional(),
};

exports.createThemeSchema = z.object(themeBase);
exports.updateThemeSchema = z.object(themeBase).partial();
