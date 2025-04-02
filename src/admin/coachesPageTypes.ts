// src/admin/coachesPageTypes.ts

export interface CoachesPageData {
  id: number;
  created_at: string;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
}

export interface CoachesPageFormData {
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
}