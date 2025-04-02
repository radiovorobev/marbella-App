// src/admin/components/SubscriptionsList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subscription } from '../subscriptionTypes';
import { subscriptionsApi } from '../api/subscriptionsApi';

const SubscriptionsList: React.FC = () => {
  console.log('SubscriptionsList рендерится');
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Загрузка списка программ
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        let fetchedSubscriptions: Subscription[];
        
        switch (filter) {
          case 'active':
            fetchedSubscriptions = await subscriptionsApi.getFilteredSubscriptions({ is_active: true });
            break;
          case 'inactive':
            fetchedSubscriptions = await subscriptionsApi.getFilteredSubscriptions({ is_active: false });
            break;
          default:
            fetchedSubscriptions = await subscriptionsApi.getAllSubscriptions();
            break;
        }
        
        setSubscriptions(fetchedSubscriptions);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке программ подписки:', err);
        setError('Не удалось загрузить список программ подписки. Сервер временно недоступен.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [retryCount, filter]);

  // Повторная попытка загрузки данных
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Удаление программы
  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту программу подписки?')) {
      try {
        await subscriptionsApi.deleteSubscription(id);
        setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
      } catch (err) {
        console.error('Ошибка при удалении программы:', err);
        setError('Не удалось удалить программу');
        
        // Автоматически скрыть ошибку через 5 секунд
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
  };

  // Изменение фильтра
  const handleFilterChange = (newFilter: 'all' | 'active' | 'inactive') => {
    setFilter(newFilter);
  };

  // Форматирование цены
  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return `${price} €`;
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка списка программ подписки...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error && !loading && subscriptions.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Программы подписки</h1>
          <p className="text-sm text-gray-600">Управление программами и курсами академии</p>
        </div>
        <button
          onClick={() => navigate('/admin/subscriptions/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить программу
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

      {/* Фильтр */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            Все программы
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('active')}
          >
            Активные
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'inactive' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('inactive')}
          >
            Неактивные
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">Название (EN)</th>
                  <th className="p-3 text-left">Цена</th>
                  <th className="p-3 text-left">Тип</th>
                  <th className="p-3 text-left">Активна</th>
                  <th className="p-3 text-left">Порядок</th>
                  <th className="p-3 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(subscription => (
                  <tr key={subscription.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium">{subscription.title_en || '-'}</td>
                    <td className="p-3 text-gray-600">{formatPrice(subscription.price)}</td>
                    <td className="p-3">
                      {subscription.is_mountly && 'Месячная'} 
                      {subscription.is_hourly && (subscription.is_mountly ? ' / Почасовая' : 'Почасовая')}
                    </td>
                    <td className="p-3">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${subscription.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {subscription.is_active ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="p-3">{subscription.sort_order || '-'}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/subscriptions/edit/${subscription.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Редактировать"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => subscription.id && handleDelete(subscription.id)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Список программ пуст</h3>
            <p className="text-gray-600 mb-6">Добавьте первую программу подписки, чтобы она появилась в этом списке.</p>
            <button
              onClick={() => navigate('/admin/subscriptions/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить программу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsList;