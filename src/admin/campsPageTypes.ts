// src/admin/campsPageTypes.ts

export interface CampsPageData {
  id: number;
  created_at: string;
  intro_en: string | null;
  intro_es: string | null;
  intro_ru: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
}

export interface CampsPageFormData {
  intro_en: string | null;
  intro_es: string | null;
  intro_ru: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
}