// NewsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { News, PostStatus, NewsFilter } from '../newsTypes';
import newsApi from '../api/newsApi';  // Импортируем реальное API

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Состояние для фильтров
  const [filter, setFilter] = useState<NewsFilter>({
    searchTerm: '',
    status: undefined
  });
  
  const pageSize = 10;
  
  // Загрузка новостей
  const fetchNews = async () => {
    try {
      setLoading(true);
      const { news, totalCount } = await newsApi.getNews(currentPage, pageSize, filter);
      setNews(news);
      setTotalPages(Math.ceil(totalCount / pageSize));
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке новостей:', err);
      setError('Не удалось загрузить список новостей');
    } finally {
      setLoading(false);
    }
  };
  
  // Загружаем новости при монтировании компонента
  // или при изменении страницы или фильтров
  useEffect(() => {
    fetchNews();
  }, [currentPage, filter]);
  
  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    // Используем debounce для предотвращения слишком частых запросов
    const timerId = setTimeout(() => {
      setFilter(prev => ({ ...prev, searchTerm }));
      setCurrentPage(1); // Сбрасываем на первую страницу при поиске
    }, 300);
    
    return () => clearTimeout(timerId);
  };
  
  // Обработчик изменения фильтра по статусу
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as PostStatus | undefined;
    setFilter(prev => ({ 
      ...prev, 
      status: e.target.value === 'all' ? undefined : status as PostStatus 
    }));
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  };
  
  // Обработчик опубликования новости
  const handlePublishNews = async (id: number) => {
    try {
      await newsApi.publishNews(id);
      fetchNews(); // Обновляем список после изменения
      
    } catch (err) {
      console.error('Ошибка при публикации новости:', err);
      setError('Не удалось опубликовать новость');
    }
  };
  
  // Обработчик архивирования новости
  const handleArchiveNews = async (id: number) => {
    try {
      await newsApi.archiveNews(id);
      fetchNews(); // Обновляем список после изменения
      
    } catch (err) {
      console.error('Ошибка при архивации новости:', err);
      setError('Не удалось заархивировать новость');
    }
  };
  
  // Обработчик удаления новости
  const handleDeleteNews = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await newsApi.deleteNews(id);
        fetchNews(); // Обновляем список после удаления
        
      } catch (err) {
        console.error('Ошибка при удалении новости:', err);
        setError('Не удалось удалить новость');
      }
    }
  };
  
  // Функция для отображения статуса новости
  const renderStatus = (status: PostStatus) => {
    const statusStyles = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Published': 'bg-green-100 text-green-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    
    const statusLabels = {
      'Draft': 'Черновик',
      'Published': 'Опубликовано',
      'Archived': 'В архиве'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление новостями</h1>
        <Link
          to="/admin/news/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Создать новость
        </Link>
      </div>
      
      {/* Фильтры */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <input
              type="text"
              placeholder="Поиск по заголовку..."
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              onChange={handleStatusFilterChange}
              className="w-full p-2 border rounded"
              defaultValue="all"
            >
              <option value="all">Все</option>
              <option value="Draft">Черновики</option>
              <option value="Published">Опубликованные</option>
              <option value="Archived">В архиве</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Сообщение об ошибке */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Таблица новостей */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Заголовок</th>
              <th className="p-3 text-left">Статус</th>
              <th className="p-3 text-left">Дата публикации</th>
              <th className="p-3 text-left">Последнее обновление</th>
              <th className="p-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  Загрузка...
                </td>
              </tr>
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  Новости не найдены
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">
                    <Link 
                      to={`/admin/news/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.title_en}
                    </Link>
                  </td>
                  <td className="p-3">{renderStatus(item.status)}</td>
                  <td className="p-3">
                    {item.publish_date 
                      ? new Date(item.publish_date).toLocaleDateString() 
                      : '—'}
                  </td>
                  <td className="p-3">
                    {new Date(item.updated_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/news/${item.id}/edit`}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Редактировать
                      </Link>
                      
                      {item.status === 'Draft' && (
                        <button
                          onClick={() => handlePublishNews(item.id)}
                          className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Опубликовать
                        </button>
                      )}
                      
                      {item.status === 'Published' && (
                        <button
                          onClick={() => handleArchiveNews(item.id)}
                          className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          В архив
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Пагинация */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-4 py-2">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NewsList;