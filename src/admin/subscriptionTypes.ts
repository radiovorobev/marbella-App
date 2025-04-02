// src/admin/subscriptionTypes.ts

export interface Subscription {
  id: number;
  created_at: string;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  price: number | null;
  is_mountly: boolean;
  is_hourly: boolean;
  price_per_session: string | null;
  description_en: string | null;
  description_es: string | null;
  description_ru: string | null;
  sort_order: number | null;
  is_active: boolean;
}

export interface SubscriptionFormData {
  title_en: string;
  title_es: string;
  title_ru: string;
  price: number | null;
  is_mountly: boolean;
  is_hourly: boolean;
  price_per_session: string | null;
  description_en: string | null;
  description_es: string | null;
  description_ru: string | null;
  sort_order: number | null;
  is_active: boolean;
}

export interface SubscriptionFilter {
  is_active?: boolean;
}