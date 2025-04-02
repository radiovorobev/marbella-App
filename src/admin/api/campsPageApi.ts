// src/admin/api/campsPageApi.ts
import { supabase } from '../../utils/supabaseClient';
import { CampsPageData, CampsPageFormData } from '../campsPageTypes';

export const campsPageApi = {
  // Получить данные страницы лагерей
  async getCampsPageData(): Promise<CampsPageData | null> {
    try {
      console.log('Начинаем запрос данных страницы лагерей к Supabase...');
      const { data, error } = await supabase
        .from('temp_camps_page')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // Если записи нет, это не ошибка для нас - просто нет данных
        if (error.code === 'PGRST116') {
          console.log('Данные страницы лагерей не найдены');
          return null;
        }
        console.error('Ошибка Supabase при получении данных страницы лагерей:', error);
        throw error;
      }
      
      console.log('Получены данные страницы лагерей:', data);
      return data;
    } catch (e) {
      console.error('Необработанная ошибка в getCampsPageData:', e);
      throw e;
    }
  },

  // Обновить/создать данные страницы лагерей
  async updateCampsPageData(formData: CampsPageFormData): Promise<CampsPageData> {
    try {
      // Сначала проверяем, есть ли уже запись
      const existingData = await this.getCampsPageData();
      
      if (existingData) {
        // Обновляем существующую запись
        const { data, error } = await supabase
          .from('temp_camps_page')
          .update(formData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) {
          console.error('Ошибка при обновлении данных страницы лагерей:', error);
          throw error;
        }
        
        return data;
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('temp_camps_page')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Ошибка при создании данных страницы лагерей:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Необработанная ошибка в updateCampsPageData:', e);
      throw e;
    }
  }
};