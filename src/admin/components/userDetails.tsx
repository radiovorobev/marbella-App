// UserDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { userApi } from '../api/userApi';
import UserFormModal from '../components/userFormModal';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('User ID is not specified');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userData = await userApi.getUserById(parseInt(id, 10));
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error loading user information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
  const handleToggleActive = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await userApi.toggleUserActive(user.id, !user.is_active);
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      setError('Error changing user status');
    }
  };
  
  const handleDelete = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(user.id);
        navigate('/users');
      } catch (err) {
        console.error(err);
        setError('Error deleting user');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error || 'User not found'}
        </div>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    );
  }
  
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'User':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Information</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Back to List
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {user.name} {user.last_name}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleClass(user.role)}`}
              >
                {user.role}
              </span>
              <button
                onClick={handleToggleActive}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">ID</p>
                <p>{user.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">First Name</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Name</p>
                <p>{user.last_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p>{user.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Creation Date</p>
                <p>{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Updated</p>
                <p>{new Date(user.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleToggleActive}
                className={`px-4 py-2 rounded ${
                  user.is_active
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {user.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <UserFormModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            // Reload user data
            const fetchUser = async () => {
              try {
                const userData = await userApi.getUserById(user.id);
                setUser(userData);
              } catch (err) {
                console.error(err);
              }
            };
            fetchUser();
          }}
        />
      )}
    </div>
  );
};

export default UserDetails;