// src/admin/components/CoachesPageEditor.tsx
import React, { useState, useEffect } from 'react';
import { CoachesPageData, CoachesPageFormData } from '../coachesPageTypes';
import { coachesPageApi } from '../api/coachesPageApi';
import QuillEditor from './quillEditor';

const CoachesPageEditor: React.FC = () => {
  console.log('CoachesPageEditor rendering');
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'ru'>('en');
  const [formData, setFormData] = useState<CoachesPageFormData>({
    title_en: '',
    title_es: '',
    title_ru: '',
    text_en: '',
    text_es: '',
    text_ru: ''
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load page data
  useEffect(() => {
    const fetchCoachesPageData = async () => {
      try {
        setLoading(true);
        const pageData = await coachesPageApi.getCoachesPageData();
        
        if (pageData) {
          setFormData({
            title_en: pageData.title_en || '',
            title_es: pageData.title_es || '',
            title_ru: pageData.title_ru || '',
            text_en: pageData.text_en || '',
            text_es: pageData.text_es || '',
            text_ru: pageData.text_ru || ''
          });
          
          // Format last saved date
          const saveDate = new Date(pageData.created_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading coaches page data:', err);
        setError('Failed to load page data. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachesPageData();
  }, []);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Quill editor changes
  const handleQuillChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await coachesPageApi.updateCoachesPageData(formData);
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now.toLocaleString('en-US'));
      
      // Show success message
      setSuccessMessage('Page content saved successfully');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      setError(null);
    } catch (err) {
      console.error('Error saving coaches page data:', err);
      setError('Failed to save page data. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Change active tab
  const handleTabChange = (tab: 'en' | 'es' | 'ru') => {
    setActiveTab(tab);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading coaches page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Coaches Page</h1>
          {lastSaved && (
            <p className="text-sm text-gray-600">
              Last saved: {lastSaved}
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-start rounded-r">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Error</p>
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

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex items-start rounded-r">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Success</p>
            <p>{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)} 
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Language tabs */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                type="button"
                onClick={() => handleTabChange('en')}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'en' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('es')}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'es' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Spanish (ES)
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('ru')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ru' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Russian (RU)
              </button>
            </div>
          </div>

          {/* EN tab content */}
          <div className={`p-6 ${activeTab === 'en' ? '' : 'hidden'}`}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title (EN)
                </label>
                <input
                  type="text"
                  id="title_en"
                  name="title_en"
                  value={formData.title_en || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <QuillEditor
                  label="Page Content (EN)"
                  value={formData.text_en || ''}
                  onChange={(value) => handleQuillChange('text_en', value)}
                />
              </div>
            </div>
          </div>

          {/* ES tab content */}
          <div className={`p-6 ${activeTab === 'es' ? '' : 'hidden'}`}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title_es" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title (ES)
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
                <QuillEditor
                  label="Page Content (ES)"
                  value={formData.text_es || ''}
                  onChange={(value) => handleQuillChange('text_es', value)}
                />
              </div>
            </div>
          </div>

          {/* RU tab content */}
          <div className={`p-6 ${activeTab === 'ru' ? '' : 'hidden'}`}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title (RU)
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
                <QuillEditor
                  label="Page Content (RU)"
                  value={formData.text_ru || ''}
                  onChange={(value) => handleQuillChange('text_ru', value)}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preview ({activeTab.toUpperCase()})</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          {activeTab === 'en' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">{formData.title_en || 'No title'}</h1>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_en || 'No content' }} />
            </div>
          )}
          
          {activeTab === 'es' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">{formData.title_es || 'Sin título'}</h1>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_es || 'Sin contenido' }} />
            </div>
          )}
          
          {activeTab === 'ru' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">{formData.title_ru || 'No title'}</h1>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_ru || 'No content' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachesPageEditor;