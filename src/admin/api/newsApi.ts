// newsApi.ts
import { createClient } from '@supabase/supabase-js';
import { News, NewsFormData, NewsUpdateData, NewsFilter, PostStatus } from '../newsTypes';

// Инициализация Supabase клиента
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Проверка наличия необходимых переменных окружения
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL и Anon Key должны быть указаны в переменных окружения');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// API для работы с новостями
export const newsApi = {
  // Получение списка новостей с пагинацией и фильтрацией
  async getNews(page = 1, limit = 10, filter: NewsFilter = {}) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('news')
      .select('id, title_en, status, updated_at, publish_date, author_id', { count: 'exact' });
    
    // Применяем фильтры, если они указаны
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    
    if (filter.authorId) {
      query = query.eq('author_id', filter.authorId);
    }
    
    if (filter.searchTerm) {
      query = query.or(`title_en.ilike.%${filter.searchTerm}%,title_ru.ilike.%${filter.searchTerm}%,title_es.ilike.%${filter.searchTerm}%`);
    }
    
    if (filter.fromDate) {
      query = query.gte('publish_date', filter.fromDate);
    }
    
    if (filter.toDate) {
      query = query.lte('publish_date', filter.toDate);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      news: data as News[],
      totalCount: count || 0
    };
  },
  
  // Получение новости по ID
  async getNewsById(id: number) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as News;
  },
  
  // Создание новой новости
  async createNews(newsData: NewsFormData) {
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select();
    
    if (error) throw error;
    
    return data[0] as News;
  },
  
  // Обновление информации о новости
  async updateNews(id: number, newsData: NewsUpdateData) {
    const { data, error } = await supabase
      .from('news')
      .update(newsData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data[0] as News;
  },
  
  // Изменение статуса новости
  async updateNewsStatus(id: number, status: PostStatus) {
    return this.updateNews(id, { status });
  },
  
  // Публикация новости
  async publishNews(id: number) {
    const publishDate = new Date().toISOString();
    return this.updateNews(id, { 
      status: 'Published', 
      publish_date: publishDate 
    });
  },
  
  // Архивирование новости
  async archiveNews(id: number) {
    return this.updateNews(id, { status: 'Archived' });
  },
  
  // Удаление новости
  async deleteNews(id: number) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  },
  
  // Загрузка изображения превью
  async uploadPreviewImage(file: File) {
    const fileName = `news-preview-${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase
      .storage
      .from('news-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Получаем публичный URL для загруженного файла
    const { data: { publicUrl } } = supabase
      .storage
      .from('news-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  }
};

// Экспортируем newsApi для использования в компонентах
export default newsApi;