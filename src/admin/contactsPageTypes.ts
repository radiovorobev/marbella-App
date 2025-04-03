// src/admin/contactsPageTypes.ts

export interface ContactsPageData {
  id: number;
  created_at: string;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  maps_embed: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
}

export interface ContactsPageFormData {
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  maps_embed: string | null;
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
}