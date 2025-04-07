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
    try {
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
    } catch (e) {
      console.error('Ошибка в getNews:', e);
      throw e;
    }
  },
  
  // Получение новости по ID
  async getNewsById(id: number) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as News;
    } catch (e) {
      console.error(`Ошибка в getNewsById для id=${id}:`, e);
      throw e;
    }
  },
  
  // Создание новой новости
  async createNews(newsData: NewsFormData) {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select();
      
      if (error) throw error;
      
      return data[0] as News;
    } catch (e) {
      console.error('Ошибка в createNews:', e);
      throw e;
    }
  },
  
  // Обновление информации о новости
  async updateNews(id: number, newsData: NewsUpdateData) {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return data[0] as News;
    } catch (e) {
      console.error(`Ошибка в updateNews для id=${id}:`, e);
      throw e;
    }
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
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (e) {
      console.error(`Ошибка в deleteNews для id=${id}:`, e);
      throw e;
    }
  },
  
  // Загрузка изображения превью
  async uploadPreviewImage(file: File) {
    try {
      if (!file) throw new Error('No file provided');

      // Генерируем уникальное имя файла с сохранением расширения
      const fileExt = file.name.split('.').pop();
      const fileName = `news-preview-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('Uploading news image:', fileName);
      
      const { data, error } = await supabase
        .storage
        .from('news-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Получаем публичный URL для загруженного файла
      const { data: urlData } = supabase
        .storage
        .from('news-images')
        .getPublicUrl(data.path);
      
      console.log('Generated public URL:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (e) {
      console.error('Ошибка в uploadPreviewImage:', e);
      throw e;
    }
  }
};

// Экспортируем newsApi для использования в компонентах
export default newsApi;