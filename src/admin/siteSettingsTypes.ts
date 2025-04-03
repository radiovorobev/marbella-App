// src/admin/siteSettingsTypes.ts

export interface SiteSettings {
  id: number;
  created_at: string;
  updated_at: string;
  address_en: string;
  address_es: string | null;
  address_ru: string | null;
  phone_number: string;
  whatsapp_link: string;
  email: string;
  logo_svg: string;
  site_name: string;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  address_url: string | null;
}

export interface SiteSettingsFormData {
  address_en: string;
  address_es: string | null;
  address_ru: string | null;
  phone_number: string;
  whatsapp_link: string;
  email: string;
  logo_svg: string;
  site_name: string;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  address_url: string | null;
}