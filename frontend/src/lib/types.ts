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
