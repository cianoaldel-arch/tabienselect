export type Plate = {
  id: string;
  prefix: string;
  number: string;
  full_plate: string;
  category: string;
  plate_type: string;
  numerology_sum: number;
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
