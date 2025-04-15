import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import AdminContainer from '../components/adminContainer';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AdminContainer>
      <div className="min-h-screen bg-gray-100">
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
                    Users
                  </Link>
                  <Link 
                    to="/admin/news" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActiveLink('/news') 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    News
                  </Link>
                  <Link 
                    to="/admin/coaches" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActiveLink('/coaches') 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Coaches
                  </Link>
                  {/* Additional admin panel links can be added here */}
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
                  Go to Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet /> {/* This is where child route components will be rendered */}
          </div>
        </main>
        <footer className="bg-white shadow-inner mt-auto py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Marbella International Football Academy. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </AdminContainer>
  );
};

export default AdminLayout;