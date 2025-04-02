import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NewsFormData, News, PostStatus } from '../newsTypes';
import { newsApi } from '../api/newsApi';
import QuillEditor from '../components/quillEditor'; // Импортируем новый редактор

const NewsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Состояние формы
  const [formData, setFormData] = useState<NewsFormData>({
    author_id: 1, // В реальном приложении здесь будет ID текущего пользователя
    title_en: '',
    text_en: '',
    title_es: null,
    text_es: null,
    title_ru: null,
    text_ru: null,
    preview_image_url: null,
    status: 'Draft'
  });
  
  // Состояние формы
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRussian, setShowRussian] = useState(false);
  const [showSpanish, setShowSpanish] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  
  // Загрузка данных новости, если мы в режиме редактирования
  useEffect(() => {
    const fetchNewsData = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const newsData = await newsApi.getNewsById(parseInt(id, 10));
          
          // Устанавливаем полученные данные в форму
          setFormData({
            author_id: newsData.author_id,
            title_en: newsData.title_en,
            text_en: newsData.text_en,
            title_es: newsData.title_es,
            text_es: newsData.text_es,
            title_ru: newsData.title_ru,
            text_ru: newsData.text_ru,
            preview_image_url: newsData.preview_image_url,
            status: newsData.status,
            publish_date: newsData.publish_date
          });
          
          // Показываем дополнительные языки, если они заполнены
          if (newsData.title_ru || newsData.text_ru) {
            setShowRussian(true);
          }
          
          if (newsData.title_es || newsData.text_es) {
            setShowSpanish(true);
          }
          
          setError(null);
        } catch (err) {
          console.error('Ошибка при загрузке данных новости:', err);
          setError('Не удалось загрузить данные новости');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchNewsData();
  }, [id, isEditMode]);
  
  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработчик изменения полей редактора текста
  const handleEditorChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Обработчик изменения выбранного изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreviewImage(files[0]);
    }
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем изображение, если оно выбрано
      let imageUrl = formData.preview_image_url;
      if (previewImage) {
        imageUrl = await newsApi.uploadPreviewImage(previewImage);
      }
      
      // Подготавливаем данные для сохранения
      const newsData: NewsFormData = {
        ...formData,
        preview_image_url: imageUrl,
        // Устанавливаем пустые значения для неиспользуемых языков
        title_ru: showRussian ? formData.title_ru : null,
        text_ru: showRussian ? formData.text_ru : null,
        title_es: showSpanish ? formData.title_es : null,
        text_es: showSpanish ? formData.text_es : null,
      };
      
      // Сохраняем данные
      if (isEditMode && id) {
        await newsApi.updateNews(parseInt(id, 10), newsData);
      } else {
        await newsApi.createNews(newsData);
      }
      
      // Перенаправляем на список новостей
      navigate('/admin/news');
      
    } catch (err) {
      console.error('Ошибка при сохранении новости:', err);
      setError('Не удалось сохранить новость. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };
  
  // Публикация новости
  const handlePublish = async () => {
    if (isEditMode && id) {
      try {
        setLoading(true);
        await newsApi.publishNews(parseInt(id, 10));
        navigate('/admin/news');
      } catch (err) {
        console.error('Ошибка при публикации новости:', err);
        setError('Не удалось опубликовать новость');
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (loading && !formData.title_en) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Редактирование новости' : 'Создание новости'}
        </h1>
        <button
          onClick={() => navigate('/admin/news')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Назад к списку
        </button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Английская версия</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <QuillEditor
            label="Текст новости"
            value={formData.text_en}
            onChange={(value) => handleEditorChange('text_en', value)}
            required
          />
        </div>
        
        {/* Русская версия */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Русская версия</h2>
            <button 
              type="button"
              onClick={() => setShowRussian(!showRussian)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showRussian ? 'Скрыть' : 'Показать'}
            </button>
          </div>
          
          {showRussian && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок (RU)
                </label>
                <input
                  type="text"
                  name="title_ru"
                  value={formData.title_ru || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="Текст новости (RU)"
                value={formData.text_ru || ''}
                onChange={(value) => handleEditorChange('text_ru', value)}
              />
            </>
          )}
        </div>
        
        {/* Испанская версия */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Испанская версия</h2>
            <button 
              type="button"
              onClick={() => setShowSpanish(!showSpanish)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showSpanish ? 'Скрыть' : 'Показать'}
            </button>
          </div>
          
          {showSpanish && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок (ES)
                </label>
                <input
                  type="text"
                  name="title_es"
                  value={formData.title_es || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="Текст новости (ES)"
                value={formData.text_es || ''}
                onChange={(value) => handleEditorChange('text_es', value)}
              />
            </>
          )}
        </div>
        
        {/* Изображение превью */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Изображение превью</h2>
          
          {formData.preview_image_url && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Текущее изображение:</p>
              <img 
                src={formData.preview_image_url} 
                alt="Preview" 
                className="max-w-full h-auto max-h-48 border"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Загрузить новое изображение
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Рекомендуемый размер: 1200x630 пикселей
            </p>
          </div>
        </div>
        
        {/* Статус */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Настройки публикации</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Draft">Черновик</option>
              <option value="Published">Опубликовано</option>
              <option value="Archived">В архиве</option>
            </select>
          </div>
        </div>
        
        {/* Кнопки действий */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          
          {isEditMode && formData.status === 'Draft' && (
            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              Опубликовать
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewsForm;