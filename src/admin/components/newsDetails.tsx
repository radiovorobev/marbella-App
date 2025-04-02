// NewsDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { News, PostStatus } from '../newsTypes';
import { newsApi } from '../api/newsApi';

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'ru' | 'es'>('en');
  
  useEffect(() => {
    const fetchNews = async () => {
      if (!id) {
        setError('ID новости не указан');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const newsData = await newsApi.getNewsById(parseInt(id, 10));
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке информации о новости');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [id]);
  
  // Обработчик публикации новости
  const handlePublish = async () => {
    if (!news) return;
    
    try {
      setLoading(true);
      const updatedNews = await newsApi.publishNews(news.id);
      setNews(updatedNews);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Ошибка при публикации новости');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик архивирования новости
  const handleArchive = async () => {
    if (!news) return;
    
    try {
      setLoading(true);
      const updatedNews = await newsApi.archiveNews(news.id);
      setNews(updatedNews);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Ошибка при архивировании новости');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик удаления новости
  const handleDelete = async () => {
    if (!news) return;
    
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        setLoading(true);
        await newsApi.deleteNews(news.id);
        navigate('/admin/news');
      } catch (err) {
        console.error(err);
        setError('Ошибка при удалении новости');
        setLoading(false);
      }
    }
  };
  
  // Функция для форматирования статуса
  const getStatusBadge = (status: PostStatus) => {
    const statusConfig = {
      'Draft': { color: 'bg-yellow-100 text-yellow-800', label: 'Черновик' },
      'Published': { color: 'bg-green-100 text-green-800', label: 'Опубликовано' },
      'Archived': { color: 'bg-gray-100 text-gray-800', label: 'В архиве' }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
        {statusConfig[status].label}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  if (error || !news) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error || 'Новость не найдена'}
        </div>
        <button
          onClick={() => navigate('/admin/news')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Информация о новости</h1>
        <div className="flex space-x-2">
          <Link
            to={`/admin/news/${news.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Редактировать
          </Link>
          <button
            onClick={() => navigate('/admin/news')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Назад к списку
          </button>
        </div>
      </div>
      
      {/* Основная информация */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{news.title_en}</h2>
              <p className="text-gray-500 text-sm mt-1">
                ID: {news.id} | 
                Последнее обновление: {new Date(news.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(news.status)}
              
              {news.publish_date && (
                <span className="text-sm text-gray-600">
                  Опубликовано: {new Date(news.publish_date).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Превью изображение */}
          {news.preview_image_url && (
            <div className="mb-4">
              <img 
                src={news.preview_image_url} 
                alt="Preview" 
                className="max-w-full h-auto border rounded"
              />
            </div>
          )}
          
          {/* Вкладки для переключения между языками */}
          <div className="mb-4 border-b">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('en')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'en' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
              </li>
              {news.title_ru && (
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('ru')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'ru' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Русский
                  </button>
                </li>
              )}
              {news.title_es && (
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('es')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'es' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Español
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          {/* Содержимое новости по вкладкам */}
          <div className="mb-6">
            {activeTab === 'en' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_en}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_en }}
                />
              </div>
            )}
            
            {activeTab === 'ru' && news.title_ru && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_ru}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_ru || '' }}
                />
              </div>
            )}
            
            {activeTab === 'es' && news.title_es && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_es}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_es || '' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Метаданные и действия */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Действия</h3>
          
          <div className="flex space-x-2">
            <Link
              to={`/admin/news/${news.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Редактировать
            </Link>
            
            {news.status === 'Draft' && (
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Опубликовать
              </button>
            )}
            
            {news.status === 'Published' && (
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                В архив
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;