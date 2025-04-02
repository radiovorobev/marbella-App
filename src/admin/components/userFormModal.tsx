// UserFormModal.tsx
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserFormData, UserUpdateData } from '../types';
import { userApi } from '../api/userApi';

interface UserFormModalProps {
  user: User | null; // null, если создаем нового пользователя
  onClose: () => void;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    last_name: '',
    password: '',
    role: 'Manager',
    is_active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Инициализируем форму данными пользователя, если режим редактирования
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        password: '', // Не заполняем пароль при редактировании
        role: user.role,
        is_active: user.is_active
      });
    }
  }, [user]);
  
  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Для чекбоксов обрабатываем особым образом
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Очищаем ошибки при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    // Проверка имени
    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
    }
    
    // Проверка фамилии
    if (!formData.last_name) {
      newErrors.last_name = 'Фамилия обязательна';
    }
    
    // Проверка пароля (только при создании или изменении пароля)
    if (!user || formData.password) {
      if (!user && !formData.password) {
        newErrors.password = 'Пароль обязателен';
      } else if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать не менее 6 символов';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем валидность формы
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError(null);
    
    try {
      if (user) {
        // Обновление существующего пользователя
        const updateData: UserUpdateData = {
          name: formData.name,
          last_name: formData.last_name,
          role: formData.role,
          is_active: formData.is_active
        };
        
        // Добавляем пароль только если он был изменен
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await userApi.updateUser(user.id, updateData);
      } else {
        // Создание нового пользователя
        await userApi.createUser(formData);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.');
      
      // Обработка ошибок Supabase, если нужно
      if (err.code === '23505') {
        setErrors((prev) => ({ ...prev, email: 'Пользователь с таким email уже существует' }));
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user ? 'Редактирование пользователя' : 'Создание пользователя'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {submitError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!user} // Запрещаем изменение email при редактировании
              className={`w-full p-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Имя */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="name">
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Фамилия */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="last_name">
              Фамилия <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>
          
          {/* Пароль */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Пароль {!user && <span className="text-red-500">*</span>}
              {user && <span className="text-xs text-gray-500">(оставьте пустым, чтобы не менять)</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Роль */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="role">
              Роль
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Manager">Менеджер</option>
              <option value="Admin">Администратор</option>
              <option value="User">Пользователь</option>
            </select>
          </div>
          
          {/* Статус активности */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => 
                setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
              }
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-gray-700">
              Активный пользователь
            </label>
          </div>
          
          {/* Кнопки */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
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
              {loading
                ? 'Сохранение...'
                : user
                ? 'Сохранить изменения'
                : 'Создать пользователя'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;