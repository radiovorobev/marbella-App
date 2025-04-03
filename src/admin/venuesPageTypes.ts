// src/admin/venuesPageTypes.ts

export interface VenuesPageData {
  id: number;
  created_at: string;
  venues_text_one_en: string | null;
  venues_text_one_es: string | null;
  venues_text_one_ru: string | null;
  venues_text_two_en: string | null;
  venues_text_two_es: string | null;
  venues_text_two_ru: string | null;
  venues_image: string | null;
  page_title_en: string | null;
  page_title_es: string | null;
  page_title_ru: string | null;
}

export interface VenuesPageFormData {
  venues_text_one_en: string | null;
  venues_text_one_es: string | null;
  venues_text_one_ru: string | null;
  venues_text_two_en: string | null;
  venues_text_two_es: string | null;
  venues_text_two_ru: string | null;
  venues_image: string | null;
  page_title_en: string | null;
  page_title_es: string | null;
  page_title_ru: string | null;
}