// UserFormModal.tsx
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserFormData, UserUpdateData } from '../types';
import { userApi } from '../api/userApi';

interface UserFormModalProps {
  user: User | null; // null if creating a new user
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
  
  // Initialize form with user data in edit mode
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        password: '', // Do not pre-fill password when editing
        role: user.role,
        is_active: user.is_active
      });
    }
  }, [user]);
  
  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Special handling for checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear errors when field changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'First name is required';
    }
    
    // Last name validation
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    // Password validation (only when creating or changing password)
    if (!user || formData.password) {
      if (!user && !formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError(null);
    
    try {
      if (user) {
        // Update existing user
        const updateData: UserUpdateData = {
          name: formData.name,
          last_name: formData.last_name,
          role: formData.role,
          is_active: formData.is_active
        };
        
        // Add password only if it was changed
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await userApi.updateUser(user.id, updateData);
      } else {
        // Create new user
        await userApi.createUser(formData);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'An error occurred. Please try again.');
      
      // Handle Supabase errors, if needed
      if (err.code === '23505') {
        setErrors((prev) => ({ ...prev, email: 'A user with this email already exists' }));
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
            {user ? 'Edit User' : 'Create User'}
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
              disabled={!!user} // Disable email change in edit mode
              className={`w-full p-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="name">
              First Name <span className="text-red-500">*</span>
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
          
          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="last_name">
              Last Name <span className="text-red-500">*</span>
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
          
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Password {!user && <span className="text-red-500">*</span>}
              {user && <span className="text-xs text-gray-500">(leave blank to keep current)</span>}
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
          
          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Manager">Manager</option>
              <option value="Admin">Administrator</option>
              <option value="User">User</option>
            </select>
          </div>
          
          {/* Active Status */}
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
              Active User
            </label>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : user
                ? 'Save Changes'
                : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;