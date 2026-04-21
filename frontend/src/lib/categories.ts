export const PLATE_CATEGORIES = [
  { value: '2-digit', label: '2-digit numbers' },
  { value: '3-digit', label: '3-digit numbers' },
  { value: 'popular', label: 'Popular numbers' },
] as const;

export type PlateCategoryValue = (typeof PLATE_CATEGORIES)[number]['value'];
