import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coach } from '../coachTypes';
import { coachesApi } from '../api/coachesApi';

const CoachesList: React.FC = () => {
  console.log('CoachesList рендерится');
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Загрузка списка тренеров с механизмом повторной попытки
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const fetchedCoaches = await coachesApi.getAllCoaches();
        setCoaches(fetchedCoaches);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке тренеров:', err);
        setError('Не удалось загрузить список тренеров. Сервер временно недоступен.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [retryCount]);

  // Повторная попытка загрузки данных
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Удаление тренера
  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого тренера?')) {
      try {
        await coachesApi.deleteCoach(id);
        setCoaches(coaches.filter(coach => coach.id !== id));
      } catch (err) {
        console.error('Ошибка при удалении тренера:', err);
        setError('Не удалось удалить тренера');
        
        // Автоматически скрыть ошибку через 5 секунд
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
  };

  // Состояние загрузки с улучшенной анимацией
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка списка тренеров...</p>
        </div>
      </div>
    );
  }

  // Улучшенное отображение ошибки с возможностью повторной попытки
  if (error && !loading && coaches.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="p-6 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ошибка соединения</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Попробовать снова
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Вернуться в админ-панель
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Тренеры</h1>
          <p className="text-sm text-gray-600">Управление информацией о тренерах академии</p>
        </div>
        <button
          onClick={() => navigate('/admin/coaches/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить тренера
        </button>
      </div>

      {/* Уведомление об ошибке */}
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-start rounded-r">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Ошибка</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {coaches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">Фото</th>
                  <th className="p-3 text-left">Имя</th>
                  <th className="p-3 text-left">Роль</th>
                  <th className="p-3 text-left">Активен</th>
                  <th className="p-3 text-left">Порядок</th>
                  <th className="p-3 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map(coach => (
                  <tr key={coach.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      {coach.photo_url ? (
                        <img 
                          src={coach.photo_url} 
                          alt={coach.name_en} 
                          className="w-16 h-16 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                          Нет фото
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{coach.name_en}</td>
                    <td className="p-3 text-gray-600">{coach.role_en}</td>
                    <td className="p-3">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${coach.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {coach.is_active ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="p-3">{coach.sort_order || 0}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/coaches/edit/${coach.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Редактировать"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => coach.id && handleDelete(coach.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Удалить"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-6 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Список тренеров пуст</h3>
            <p className="text-gray-600 mb-6">Добавьте первого тренера, чтобы он появился в этом списке.</p>
            <button
              onClick={() => navigate('/admin/coaches/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить тренера
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachesList;