export type Language = 'en' | 'es' | 'ru';
export type MenuType = 'Header' | 'Footer';

export interface MenuItem {
  id: number;
  created_at: string;
  updated_at: string;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  default_language: Language;
  type: MenuType | null;
}

export interface MenuItemFormData {
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  default_language: Language;
  type: MenuType | null;
}