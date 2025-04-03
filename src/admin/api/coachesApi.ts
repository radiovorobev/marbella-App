import { supabase } from '../../utils/supabaseClient';
import { Coach, CoachFormData } from '../coachTypes';

export const coachesApi = {
  // Получить всех тренеров
  async getAllCoaches(): Promise<Coach[]> {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('sort_order', { ascending: true });
  
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data || [];
    } catch (e) {
      console.error('Необработанная ошибка в getAllCoaches:', e);
      throw e;
    }
  },

  // Получить тренера по ID
  async getCoachById(id: number): Promise<Coach> {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создать нового тренера
  async createCoach(coachData: CoachFormData): Promise<Coach> {
    const { data, error } = await supabase
      .from('coaches')
      .insert(coachData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить существующего тренера
  async updateCoach(id: number, coachData: CoachFormData): Promise<Coach> {
    const { data, error } = await supabase
      .from('coaches')
      .update(coachData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удалить тренера
  async deleteCoach(id: number): Promise<void> {
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Загрузка фото тренера
  async uploadCoachPhoto(file: File): Promise<string> {
    if (!file) throw new Error('No file provided');
  
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `coaches/${fileName}`;
  
    const { error: uploadError } = await supabase.storage
      .from('coaches')
      .upload(filePath, file);
  
    if (uploadError) throw uploadError;
  
    const { data } = supabase.storage
      .from('coaches')
      .getPublicUrl(filePath);
  
    return data.publicUrl;
  },

  // Получить активных тренеров
  async getActiveCoaches(): Promise<Coach[]> {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};