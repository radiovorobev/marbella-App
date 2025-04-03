// src/admin/components/MenuItemForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItemFormData, Language, MenuType } from '../menuTypes';
import { menuApi } from '../api/menuApi';

const MenuItemForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<MenuItemFormData>({
    title_en: '',
    title_es: null,
    title_ru: null,
    url: '',
    sort_order: 0,
    is_active: true,
    default_language: 'en',
    type: 'Header'
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRussian, setShowRussian] = useState(false);
  const [showSpanish, setShowSpanish] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load menu item data when editing
  useEffect(() => {
    const fetchMenuItem = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const menuItemData = await menuApi.getMenuItemById(parseInt(id, 10));
          
          setFormData({
            title_en: menuItemData.title_en,
            title_es: menuItemData.title_es,
            title_ru: menuItemData.title_ru,
            url: menuItemData.url,
            sort_order: menuItemData.sort_order,
            is_active: menuItemData.is_active,
            default_language: menuItemData.default_language,
            type: menuItemData.type
          });

          // Show additional languages if they are filled
          if (menuItemData.title_ru) {
            setShowRussian(true);
          }
          
          if (menuItemData.title_es) {
            setShowSpanish(true);
          }
          
          setError(null);
        } catch (err) {
          console.error('Error loading menu item:', err);
          setError('Failed to load menu item data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchMenuItem();
  }, [id, isEditMode]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // For checkbox, handle value specially
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title_en.trim()) {
      errors.title_en = 'Title in English is required';
    }
    
    if (!formData.url.trim()) {
      errors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      errors.url = 'Please enter a valid URL (e.g. /about or https://example.com)';
    }
    
    if (formData.type === null) {
      errors.type = 'Menu type is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    // Принимаем:
    // 1. URL, начинающиеся с "/" (внутренние ссылки)
    // 2. URL с http:// или https:// (внешние ссылки)
    // 3. Простые строки без слешей (внутренние ссылки, например "venues")
    return url.startsWith('/') || 
           url.match(/^https?:\/\//) !== null || 
           (url.trim().length > 0 && !url.includes(' '));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for saving
      const menuItemData: MenuItemFormData = {
        ...formData,
        // Set empty values for unused languages
        title_ru: showRussian ? formData.title_ru : null,
        title_es: showSpanish ? formData.title_es : null,
      };
      
      // Save data
      if (isEditMode && id) {
        await menuApi.updateMenuItem(parseInt(id, 10), menuItemData);
      } else {
        await menuApi.createMenuItem(menuItemData);
      }
      
      // Redirect to menu items list
      navigate('/admin/menu');
      
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError('Failed to save menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.title_en) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Menu Item' : 'Create Menu Item'}
        </h1>
        <button
          onClick={() => navigate('/admin/menu')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* English version */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">English (Required)</h2>
          
          <div className="mb-4">
            <label htmlFor="title_en" className="block text-gray-700 text-sm font-bold mb-2">
              Title (EN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                validationErrors.title_en ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {validationErrors.title_en && (
              <p className="text-red-500 text-xs italic mt-1">{validationErrors.title_en}</p>
            )}
          </div>
        </div>
        
        {/* Spanish version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Spanish (Optional)</h2>
            <button 
              type="button"
              onClick={() => setShowSpanish(!showSpanish)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              {showSpanish ? 'Hide' : 'Show'} Spanish
            </button>
          </div>
          
          {showSpanish && (
            <div className="mb-4">
              <label htmlFor="title_es" className="block text-gray-700 text-sm font-bold mb-2">
                Title (ES)
              </label>
              <input
                type="text"
                id="title_es"
                name="title_es"
                value={formData.title_es || ''}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
        </div>
        
        {/* Russian version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Russian (Optional)</h2>
            <button 
              type="button"
              onClick={() => setShowRussian(!showRussian)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              {showRussian ? 'Hide' : 'Show'} Russian
            </button>
          </div>
          
          {showRussian && (
            <div className="mb-4">
              <label htmlFor="title_ru" className="block text-gray-700 text-sm font-bold mb-2">
                Title (RU)
              </label>
              <input
                type="text"
                id="title_ru"
                name="title_ru"
                value={formData.title_ru || ''}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
        </div>
        
        {/* Common settings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Menu Settings</h2>
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="/about or https://example.com"
              className={`shadow appearance-none border ${
                validationErrors.url ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {validationErrors.url && (
              <p className="text-red-500 text-xs italic mt-1">{validationErrors.url}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                Menu Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className={`shadow appearance-none border ${
                  validationErrors.type ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              >
                <option value="Header">Header Menu</option>
                <option value="Footer">Footer Menu</option>
              </select>
              {validationErrors.type && (
                <p className="text-red-500 text-xs italic mt-1">{validationErrors.type}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="default_language" className="block text-gray-700 text-sm font-bold mb-2">
                Default Language
              </label>
              <select
                id="default_language"
                name="default_language"
                value={formData.default_language}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="en">English (EN)</option>
                {showSpanish && <option value="es">Spanish (ES)</option>}
                {showRussian && <option value="ru">Russian (RU)</option>}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="sort_order" className="block text-gray-700 text-sm font-bold mb-2">
                Sort Order
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                min="0"
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-gray-600 text-xs mt-1">Lower numbers appear first</p>
            </div>
            
            <div className="flex items-center h-full pt-8">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-gray-700 font-medium">
                Active (Visible on the website)
              </label>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/menu')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center`}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditMode ? 'Update Menu Item' : 'Create Menu Item'}
          </button>
        </div>
      </form>
      
      {/* Preview */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Preview</h2>
        
        <div className="overflow-hidden mb-4">
          <h3 className="font-medium text-gray-700 mb-2">How it will look in {formData.type} Menu:</h3>
          <div className={`${
            formData.type === 'Header'
              ? 'bg-white border-b border-gray-200 py-4'
              : 'bg-gray-800 py-4'
          } px-4`}>
            <div className={`${
              formData.type === 'Header'
                ? 'text-blue-600 hover:text-blue-800'
                : 'text-white hover:text-gray-300'
            } cursor-pointer font-medium inline-flex items-center transition-colors`}>
              {formData.title_en || 'Menu Item'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium text-gray-700 mb-2">English</h3>
            <p>{formData.title_en || 'No title'}</p>
          </div>
          
          {showSpanish && (
            <div className="border p-4 rounded">
              <h3 className="font-medium text-gray-700 mb-2">Spanish</h3>
              <p>{formData.title_es || 'No title'}</p>
            </div>
          )}
          
          {showRussian && (
            <div className="border p-4 rounded">
              <h3 className="font-medium text-gray-700 mb-2">Russian</h3>
              <p>{formData.title_ru || 'No title'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;