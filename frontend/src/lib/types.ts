export type Plate = {
  id: string;
  prefix: string;
  number: string;
  full_plate: string;
  category: string;
  plate_type: string;
  numerology_sum: number;
  price: number;
  line_qr_url: string;
  contact_text: string;
  created_at: string;
  updated_at: string;
};

export type PlateListResponse = {
  items: Plate[];
  total: number;
  page: number;
  limit: number;
};

export type Theme = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ThemeInput = Omit<Theme, 'id' | 'created_at' | 'updated_at'>;

export type ConfigMap = Record<string, string>;

export type PromoBanner = {
  id: string;
  headline: string;
  highlight: string;
  subheadline: string | null;
  plate_code: string;
  plate_region: string;
  image_url: string | null;
  footer_title: string;
  footer_tagline: string;
  phone: string;
  line_id: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PromoBannerInput = Omit<
  PromoBanner,
  'id' | 'created_at' | 'updated_at'
>;

export type ImportPlatesResult = {
  total: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: { row: number; message: string }[];
};
