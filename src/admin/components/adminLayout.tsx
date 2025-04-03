// adminLayout.tsx
import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../../index.css'; // Глобальные стили
import '../adminStyles.css'; // Специфичные стили для админки
import { useAuth } from '../../auth/context/authContext'; // Import the auth context

const AdminLayout: React.FC = () => {
  console.log('AdminLayout рендерится'); // Отладочный вывод
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // Get user and logout function from auth context

  // Функция для определения активности ссылки
  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  // Обработчик выхода из админки
  const handleLogout = () => {
    // Используем функцию logout из контекста аутентификации
    logout();
    // Перенаправляем на страницу логина
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Шапка административной панели */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="text-xl font-bold text-blue-600">
                  Marbella Academy Admin
                </Link>
              </div>
              <nav className="ml-6 flex space-x-4">
                <Link 
                  to="/admin/users" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveLink('/users') 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Пользователи
                </Link>
                <Link 
                  to="/admin/news" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveLink('/news') 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Новости
                </Link>
                <Link 
                  to="/admin/coaches" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveLink('/coaches') 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Тренеры
                </Link>
                {/* Здесь можно добавить ссылки на другие разделы админки */}
              </nav>
            </div>
            <div className="flex items-center">
              {/* Display current user info */}
              {user && (
                <span className="mr-4 text-sm text-gray-700">
                  {user.name} {user.last_name} ({user.role})
                </span>
              )}
              <Link 
                to="/" 
                target="_blank" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 mr-4"
              >
                Перейти на сайт
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент административной панели */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet /> {/* Здесь будут рендериться дочерние компоненты маршрутов */}
        </div>
      </main>
      
      {/* Футер административной панели */}
      <footer className="bg-white shadow-inner mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Marbella International Football Academy. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;