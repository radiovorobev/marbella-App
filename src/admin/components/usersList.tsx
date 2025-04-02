// UsersList.tsx
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { userApi } from '../api/userApi';
import UserFormModal from './userFormModal';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const pageSize = 10;
  
  // Загрузка пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users, totalCount } = await userApi.getUsers(currentPage, pageSize, searchTerm);
      setUsers(users);
      setTotalPages(Math.ceil(totalCount / pageSize));
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Загружаем пользователей при монтировании компонента
  // или при изменении страницы или поискового запроса
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);
  
  // Обработчик изменения поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };
  
  // Обработчик изменения статуса активности
  const handleToggleActive = async (user: User) => {
    try {
      await userApi.toggleUserActive(user.id, !user.is_active);
      // Обновляем список после изменения
      fetchUsers();
    } catch (err) {
      setError('Ошибка при изменении статуса пользователя');
      console.error(err);
    }
  };
  
  // Обработчик удаления пользователя
  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await userApi.deleteUser(id);
        // Обновляем список после удаления
        fetchUsers();
      } catch (err) {
        setError('Ошибка при удалении пользователя');
        console.error(err);
      }
    }
  };
  
  // Открытие модального окна для редактирования
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  // Открытие модального окна для создания
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };
  
  // Отображение роли пользователя
  const renderRole = (role: UserRole) => {
    const roleColors = {
      'Admin': 'bg-red-100 text-red-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'User': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role]}`}>
        {role}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Добавить пользователя
        </button>
      </div>
      
      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по имени, фамилии или email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Сообщение об ошибке */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Таблица пользователей */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Имя</th>
              <th className="p-3 text-left">Фамилия</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Роль</th>
              <th className="p-3 text-left">Статус</th>
              <th className="p-3 text-left">Дата создания</th>
              <th className="p-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-3 text-center">
                  Загрузка...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-3 text-center">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.last_name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{renderRole(user.role)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-2 py-1 rounded text-white text-xs ${
                        user.is_active ? 'bg-green-600' : 'bg-gray-400'
                      }`}
                    >
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td className="p-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
      
      {/* Здесь будет модальное окно с формой редактирования/создания */}
      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UsersList;