export interface Coach {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name_en: string;
  name_es?: string | null;
  name_ru?: string | null;
  role_en: string;
  role_es?: string | null;
  role_ru?: string | null;
  license?: string | null;
  bio_en: string;
  bio_es?: string | null;
  bio_ru?: string | null;
  photo_url?: string | null;
  sort_order?: number;
  is_active: boolean;
}

export interface CoachFormData extends Omit<Coach, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
}