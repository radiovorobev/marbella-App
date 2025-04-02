// newsTypes.ts
export type PostStatus = 'Draft' | 'Published' | 'Archived';

export interface News {
  id: number;
  created_at: string;
  updated_at: string;
  author_id: number;
  title_en: string;
  text_en: string;
  title_es: string | null;
  text_es: string | null;
  title_ru: string | null;
  text_ru: string | null;
  preview_image_url: string | null;
  status: PostStatus;
  publish_date: string | null;
}

export interface NewsFormData {
  author_id: number;
  title_en: string;
  text_en: string;
  title_es?: string | null;
  text_es?: string | null;
  title_ru?: string | null;
  text_ru?: string | null;
  preview_image_url?: string | null;
  status: PostStatus;
  publish_date?: string | null;
}

export interface NewsListItem {
  id: number;
  title_en: string;
  status: PostStatus;
  updated_at: string;
  publish_date: string | null;
  author_id: number;
}

// Расширенные типы для операций над новостями
export type NewsUpdateData = Partial<NewsFormData>;

export interface NewsFilter {
  status?: PostStatus;
  searchTerm?: string;
  authorId?: number;
  fromDate?: string;
  toDate?: string;
}