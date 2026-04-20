import { api } from '@/lib/api';

const DEFAULTS = {
  primary: '#172c5c',
  accent: '#d4af37',
  background: '#f4f6fa',
  foreground: '#0a1628',
  muted: '#64748b',
};

export async function getThemeVars() {
  try {
    const theme = await api.getActiveTheme();
    const t = theme ?? DEFAULTS;
    return {
      '--color-primary': t.primary,
      '--color-accent': t.accent,
      '--color-background': t.background,
      '--color-foreground': t.foreground,
      '--color-muted': t.muted,
    } as React.CSSProperties;
  } catch {
    return {
      '--color-primary': DEFAULTS.primary,
      '--color-accent': DEFAULTS.accent,
      '--color-background': DEFAULTS.background,
      '--color-foreground': DEFAULTS.foreground,
      '--color-muted': DEFAULTS.muted,
    } as React.CSSProperties;
  }
}

export async function getConfigMap() {
  try {
    return await api.listConfig();
  } catch {
    return {} as Record<string, string>;
  }
}
