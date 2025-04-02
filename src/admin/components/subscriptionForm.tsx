// src/admin/components/SubscriptionForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Subscription, SubscriptionFormData } from '../subscriptionTypes';
import { subscriptionsApi } from '../api/subscriptionsApi';

const SubscriptionForm: React.FC = () => {
  console.log('SubscriptionForm рендерится');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Состояния
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    title_en: '',
    title_es: '',
    title_ru: '',
    price: null,
    is_mountly: false,
    is_hourly: false,
    price_per_session: null,
    description_en: null,
    description_es: null,
    description_ru: null,
    sort_order: null,
    is_active: true
  });

  // Загрузка данных для редактирования
  useEffect(() => {
    if (isEditMode) {
      const fetchSubscription = async () => {
        try {
          setLoading(true);
          const subscription = await subscriptionsApi.getSubscriptionById(Number(id));
          setFormData({
            title_en: subscription.title_en || '',
            title_es: subscription.title_es || '',
            title_ru: subscription.title_ru || '',
            price: subscription.price,
            is_mountly: subscription.is_mountly,
            is_hourly: subscription.is_hourly,
            price_per_session: subscription.price_per_session,
            description_en: subscription.description_en,
            description_es: subscription.description_es,
            description_ru: subscription.description_ru,
            sort_order: subscription.sort_order,
            is_active: subscription.is_active
          });
        } catch (err) {
          console.error('Ошибка при загрузке программы:', err);
          setError('Не удалось загрузить данные программы');
        } finally {
          setLoading(false);
        }
      };

      fetchSubscription();
    }
  }, [id, isEditMode]);

  // Обработка изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'sort_order') {
      // Преобразование строки в число или null, если пусто
      const numValue = value === '' ? null : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (isEditMode) {
        await subscriptionsApi.updateSubscription(Number(id), formData);
      } else {
        await subscriptionsApi.createSubscription(formData);
      }
      
      navigate('/admin/subscriptions');
    } catch (err) {
      console.error('Ошибка при сохранении программы:', err);
      setError('Не удалось сохранить программу. Пожалуйста, проверьте введенные данные.');
      
      // Автоматически скрыть ошибку через 5 секунд
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  // Состояние загрузки при редактировании
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка данных программы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Редактирование программы' : 'Создание новой программы'}
        </h1>
        <button
          onClick={() => navigate('/admin/subscriptions')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Вкладки для языков */}
          <div className="mb-8">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="mr-2">
                <button
                  type="button"
                  className="inline-block p-4 rounded-t-lg border-b-2 border-blue-600 text-blue-600 active"
                >
                  Английский (EN)
                </button>
              </li>
              <li className="mr-2">
                <button
                  type="button"
                  className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
                >
                  Испанский (ES)
                </button>
              </li>
              <li className="mr-2">
                <button
                  type="button"
                  className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
                >
                  Русский (RU)
                </button>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Группа полей для EN */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-1">
                  Название программы (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title_en"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание программы (EN)
                </label>
                <textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Группа полей для ES */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title_es" className="block text-sm font-medium text-gray-700 mb-1">
                  Название программы (ES)
                </label>
                <input
                  type="text"
                  id="title_es"
                  name="title_es"
                  value={formData.title_es || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="description_es" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание программы (ES)
                </label>
                <textarea
                  id="description_es"
                  name="description_es"
                  value={formData.description_es || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Группа полей для RU */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700 mb-1">
                  Название программы (RU)
                </label>
                <input
                  type="text"
                  id="title_ru"
                  name="title_ru"
                  value={formData.title_ru || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание программы (RU)
                </label>
                <textarea
                  id="description_ru"
                  name="description_ru"
                  value={formData.description_ru || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Цена и настройки */}
            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (€)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price === null ? '' : formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="price_per_session" className="block text-sm font-medium text-gray-700 mb-1">
                  Цена за сессию (если применимо)
                </label>
                <input
                  type="text"
                  id="price_per_session"
                  name="price_per_session"
                  value={formData.price_per_session || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  id="sort_order"
                  name="sort_order"
                  value={formData.sort_order === null ? '' : formData.sort_order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_mountly"
                    name="is_mountly"
                    checked={formData.is_mountly}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_mountly" className="ml-2 block text-sm text-gray-700">
                    Месячная программа
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_hourly"
                    name="is_hourly"
                    checked={formData.is_hourly}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_hourly" className="ml-2 block text-sm text-gray-700">
                    Почасовая программа
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Активна
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/subscriptions')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              {saving && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isEditMode ? 'Сохранить изменения' : 'Создать программу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;