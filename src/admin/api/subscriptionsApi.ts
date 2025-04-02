// src/admin/api/subscriptionsApi.ts
import { supabase } from '../../utils/supabaseClient';
import { Subscription, SubscriptionFormData, SubscriptionFilter } from '../subscriptionTypes';

export const subscriptionsApi = {
  // Получить все программы подписки
  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      console.log('Начинаем запрос программ подписки к Supabase...');
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Ошибка Supabase при получении программ подписки:', error);
        throw error;
      }
      
      console.log('Получены данные программ:', data);
      return data || [];
    } catch (e) {
      console.error('Необработанная ошибка в getAllSubscriptions:', e);
      throw e;
    }
  },

  // Получить программу подписки по ID
  async getSubscriptionById(id: number): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создать новую программу подписки
  async createSubscription(subscriptionData: SubscriptionFormData): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить существующую программу подписки
  async updateSubscription(id: number, subscriptionData: SubscriptionFormData): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удалить программу подписки
  async deleteSubscription(id: number): Promise<void> {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Получить активные программы подписки
  async getActiveSubscriptions(): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Получить программы подписки с фильтрацией
  async getFilteredSubscriptions(filter: SubscriptionFilter): Promise<Subscription[]> {
    let query = supabase
      .from('subscriptions')
      .select('*');
    
    if (filter.is_active !== undefined) {
      query = query.eq('is_active', filter.is_active);
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};