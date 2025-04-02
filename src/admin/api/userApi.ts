import { createClient } from '@supabase/supabase-js';
import { User, UserFormData, UserUpdateData } from '../types';

// Инициализация Supabase клиента
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Проверка наличия необходимых переменных окружения
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL и Anon Key должны быть указаны в переменных окружения');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Сервис для работы с пользователями
export const userApi = {
  // Получение списка пользователей с пагинацией
  async getUsers(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    // Добавляем поиск, если есть searchTerm
    if (searchTerm) {
      query = query.or(
        `email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
      );
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      users: data as User[],
      totalCount: count || 0
    };
  },
  
  // Получение пользователя по ID
  async getUserById(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as User;
  },
  
  // Создание нового пользователя
  async createUser(userData: UserFormData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    
    return data[0] as User;
  },
  
  // Обновление информации о пользователе
  async updateUser(id: number, userData: UserUpdateData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data[0] as User;
  },
  
  // Изменение статуса активности пользователя
  async toggleUserActive(id: number, isActive: boolean) {
    return this.updateUser(id, { is_active: isActive });
  },
  
  // Удаление пользователя
  async deleteUser(id: number) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  }
};