// src/admin/components/venuesPageEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { VenuesPageFormData } from '../venuesPageTypes';
import { venuesPageApi } from '../api/venuesPageApi';
import QuillEditor from '../components/quillEditor';

const VenuesPageEditor: React.FC = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'ru'>('en');
  const [formData, setFormData] = useState<VenuesPageFormData>({
    venues_text_one_en: '',
    venues_text_one_es: null,
    venues_text_one_ru: null,
    venues_text_two_en: '',
    venues_text_two_es: null,
    venues_text_two_ru: null,
    venues_image: null,
    page_title_en: '',
    page_title_es: null,
    page_title_ru: null
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [venuesImage, setVenuesImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load page data
  useEffect(() => {
    const fetchVenuesPageData = async () => {
      try {
        setLoading(true);
        const pageData = await venuesPageApi.getVenuesPageData();
        
        if (pageData) {
          setFormData({
            venues_text_one_en: pageData.venues_text_one_en || '',
            venues_text_one_es: pageData.venues_text_one_es || null,
            venues_text_one_ru: pageData.venues_text_one_ru || null,
            venues_text_two_en: pageData.venues_text_two_en || '',
            venues_text_two_es: pageData.venues_text_two_es || null,
            venues_text_two_ru: pageData.venues_text_two_ru || null,
            venues_image: pageData.venues_image || null,
            page_title_en: pageData.page_title_en || '',
            page_title_es: pageData.page_title_es || null,
            page_title_ru: pageData.page_title_ru || null
          });
          
          // Format last saved date
          const saveDate = new Date(pageData.created_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading venues page data:', err);
        setError('Failed to load page data. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenuesPageData();
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

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVenuesImage(files[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Upload image if selected
      let imageUrl = formData.venues_image;
      if (venuesImage) {
        imageUrl = await venuesPageApi.uploadVenuesImage(venuesImage);
      }
      
      // Update form data with new image URL
      const updatedFormData = {
        ...formData,
        venues_image: imageUrl
      };
      
      await venuesPageApi.updateVenuesPageData(updatedFormData);
      
      // Update form data
      setFormData(updatedFormData);
      
      // Update last saved time
      const now = new Date();
      setLastSaved(now.toLocaleString('en-US'));
      
      // Clear error
      setError(null);
      
      // Show success message
      alert('Venues page content saved successfully');
    } catch (err) {
      console.error('Error saving venues page data:', err);
      setError('Failed to save page data. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Change tab
  const handleTabChange = (tab: 'en' | 'es' | 'ru') => {
    setActiveTab(tab);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading venues page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Venues Page</h1>
          {lastSaved && (
            <p className="text-sm text-gray-600">
              Last saved: {lastSaved}
            </p>
          )}
        </div>
      </div>

      {/* Error Notification */}
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <form onSubmit={handleSubmit}>
          {/* Language Tabs */}
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

          {/* Content Section */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Page Title */}
              <div>
                <label htmlFor={`page_title_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  id={`page_title_${activeTab}`}
                  name={`page_title_${activeTab}`}
                  value={formData[`page_title_${activeTab}` as keyof VenuesPageFormData] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* First Text Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">First Text Section</h3>
                <QuillEditor
                  label={`Text Content (${activeTab.toUpperCase()})`}
                  value={formData[`venues_text_one_${activeTab}` as keyof VenuesPageFormData] || ''}
                  onChange={(value) => handleQuillChange(`venues_text_one_${activeTab}`, value)}
                />
              </div>
              
              {/* Second Text Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Second Text Section</h3>
                <QuillEditor
                  label={`Text Content (${activeTab.toUpperCase()})`}
                  value={formData[`venues_text_two_${activeTab}` as keyof VenuesPageFormData] || ''}
                  onChange={(value) => handleQuillChange(`venues_text_two_${activeTab}`, value)}
                />
              </div>
            </div>
          </div>

          {/* Image Section (Common for all languages) */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-3">Featured Image</h3>
            
            {formData.venues_image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <div className="relative max-w-xl overflow-hidden rounded-lg">
                  <img 
                    src={formData.venues_image} 
                    alt="Venues" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1600x900 pixels (16:9 ratio)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
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
          <h1 className="text-3xl font-bold mb-6">
            {formData[`page_title_${activeTab}` as keyof VenuesPageFormData] || 'Venues Page Title'}
          </h1>
          
          {formData.venues_image && (
            <div className="my-6">
              <img 
                src={formData.venues_image} 
                alt="Venues" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ 
              __html: formData[`venues_text_one_${activeTab}` as keyof VenuesPageFormData] || '<p>First text section goes here...</p>' 
            }} />
          </div>
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: formData[`venues_text_two_${activeTab}` as keyof VenuesPageFormData] || '<p>Second text section goes here...</p>' 
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesPageEditor;