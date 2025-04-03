// src/admin/components/indexPageEditor.tsx
import React, { useState, useEffect } from 'react';
import { IndexPageFormData } from '../indexPageTypes';
import { indexPageApi } from '../api/indexPageApi';
import QuillEditor from '../components/quillEditor';

const IndexPageEditor: React.FC = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'ru'>('en');
  const [formData, setFormData] = useState<IndexPageFormData>({
    page_title_en: '',
    page_title_es: null,
    page_title_ru: null,
    about_header_en: '',
    about_header_es: null,
    about_header_ru: null,
    bullit_one_header_en: '',
    bullit_one_header_es: null,
    bullit_one_header_ru: null,
    bullit_one_text_en: '',
    bullit_one_text_es: null,
    bullit_one_text_ru: null,
    news_header_en: '',
    news_header_es: null,
    news_header_ru: null,
    gallery_header_en: '',
    gallery_header_es: null,
    gallery_header_ru: null,
    bullit_two_header_en: '',
    bullit_two_header_es: null,
    bullit_two_header_ru: null,
    bullit_two_text_en: '',
    bullit_two_text_es: null,
    bullit_two_text_ru: null,
    bullit_three_header_en: '',
    bullit_three_header_es: null,
    bullit_three_header_ru: null,
    bullit_three_text_en: '',
    bullit_three_text_es: null,
    bullit_three_text_ru: null
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'general' | 'about' | 'features' | 'news-gallery'>('general');

  // Load page data
  useEffect(() => {
    const fetchIndexPageData = async () => {
      try {
        setLoading(true);
        const pageData = await indexPageApi.getIndexPageData();
        
        if (pageData) {
          setFormData({
            page_title_en: pageData.page_title_en || '',
            page_title_es: pageData.page_title_es || null,
            page_title_ru: pageData.page_title_ru || null,
            about_header_en: pageData.about_header_en || '',
            about_header_es: pageData.about_header_es || null,
            about_header_ru: pageData.about_header_ru || null,
            bullit_one_header_en: pageData.bullit_one_header_en || '',
            bullit_one_header_es: pageData.bullit_one_header_es || null,
            bullit_one_header_ru: pageData.bullit_one_header_ru || null,
            bullit_one_text_en: pageData.bullit_one_text_en || '',
            bullit_one_text_es: pageData.bullit_one_text_es || null,
            bullit_one_text_ru: pageData.bullit_one_text_ru || null,
            news_header_en: pageData.news_header_en || '',
            news_header_es: pageData.news_header_es || null,
            news_header_ru: pageData.news_header_ru || null,
            gallery_header_en: pageData.gallery_header_en || '',
            gallery_header_es: pageData.gallery_header_es || null,
            gallery_header_ru: pageData.gallery_header_ru || null,
            bullit_two_header_en: pageData.bullit_two_header_en || '',
            bullit_two_header_es: pageData.bullit_two_header_es || null,
            bullit_two_header_ru: pageData.bullit_two_header_ru || null,
            bullit_two_text_en: pageData.bullit_two_text_en || '',
            bullit_two_text_es: pageData.bullit_two_text_es || null,
            bullit_two_text_ru: pageData.bullit_two_text_ru || null,
            bullit_three_header_en: pageData.bullit_three_header_en || '',
            bullit_three_header_es: pageData.bullit_three_header_es || null,
            bullit_three_header_ru: pageData.bullit_three_header_ru || null,
            bullit_three_text_en: pageData.bullit_three_text_en || '',
            bullit_three_text_es: pageData.bullit_three_text_es || null,
            bullit_three_text_ru: pageData.bullit_three_text_ru || null
          });
          
          // Format last saved date
          const saveDate = new Date(pageData.created_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading homepage data:', err);
        setError('Failed to load page data. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchIndexPageData();
  }, []);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await indexPageApi.updateIndexPageData(formData);
      
      // Update last saved time
      const now = new Date();
      setLastSaved(now.toLocaleString('en-US'));
      
      // Clear error
      setError(null);
      
      // Show success message
      alert('Homepage content saved successfully');
    } catch (err) {
      console.error('Error saving homepage data:', err);
      setError('Failed to save page data. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Change tab
  const handleTabChange = (tab: 'en' | 'es' | 'ru') => {
    setActiveTab(tab);
  };

  // Change section
  const handleSectionChange = (section: 'general' | 'about' | 'features' | 'news-gallery') => {
    setActiveSection(section);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading homepage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Homepage</h1>
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
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex flex-wrap">
            <button
              type="button"
              onClick={() => handleSectionChange('general')}
              className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'general' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => handleSectionChange('about')}
              className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'about' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              About Section
            </button>
            <button
              type="button"
              onClick={() => handleSectionChange('features')}
              className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'features' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Features/Bullits
            </button>
            <button
              type="button"
              onClick={() => handleSectionChange('news-gallery')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'news-gallery' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              News & Gallery
            </button>
          </div>
        </div>

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

          {/* General Section */}
          {activeSection === 'general' && (
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
                    value={formData[`page_title_${activeTab}` as keyof IndexPageFormData] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* About Header */}
                <div>
                  <label htmlFor={`about_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                    About Section Header ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    id={`about_header_${activeTab}`}
                    name={`about_header_${activeTab}`}
                    value={formData[`about_header_${activeTab}` as keyof IndexPageFormData] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features/Bullits Section */}
          {activeSection === 'features' && (
            <div className="p-6">
              <div className="space-y-8">
                {/* Feature 1 */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Feature/Bullit 1</h3>
                  
                  <div className="mb-4">
                    <label htmlFor={`bullit_one_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Heading ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      id={`bullit_one_header_${activeTab}`}
                      name={`bullit_one_header_${activeTab}`}
                      value={formData[`bullit_one_header_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <QuillEditor
                      label={`Text (${activeTab.toUpperCase()})`}
                      value={formData[`bullit_one_text_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={(value) => handleQuillChange(`bullit_one_text_${activeTab}`, value)}
                    />
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Feature/Bullit 2</h3>
                  
                  <div className="mb-4">
                    <label htmlFor={`bullit_two_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Heading ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      id={`bullit_two_header_${activeTab}`}
                      name={`bullit_two_header_${activeTab}`}
                      value={formData[`bullit_two_header_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <QuillEditor
                      label={`Text (${activeTab.toUpperCase()})`}
                      value={formData[`bullit_two_text_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={(value) => handleQuillChange(`bullit_two_text_${activeTab}`, value)}
                    />
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Feature/Bullit 3</h3>
                  
                  <div className="mb-4">
                    <label htmlFor={`bullit_three_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Heading ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      id={`bullit_three_header_${activeTab}`}
                      name={`bullit_three_header_${activeTab}`}
                      value={formData[`bullit_three_header_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <QuillEditor
                      label={`Text (${activeTab.toUpperCase()})`}
                      value={formData[`bullit_three_text_${activeTab}` as keyof IndexPageFormData] || ''}
                      onChange={(value) => handleQuillChange(`bullit_three_text_${activeTab}`, value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News & Gallery Section */}
          {activeSection === 'news-gallery' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* News Header */}
                <div>
                  <label htmlFor={`news_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                    News Section Heading ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    id={`news_header_${activeTab}`}
                    name={`news_header_${activeTab}`}
                    value={formData[`news_header_${activeTab}` as keyof IndexPageFormData] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
            {/* Gallery Header */}
            <div>
                  <label htmlFor={`gallery_header_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery Section Heading ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    id={`gallery_header_${activeTab}`}
                    name={`gallery_header_${activeTab}`}
                    value={formData[`gallery_header_${activeTab}` as keyof IndexPageFormData] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

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
              Save All Changes
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preview ({activeTab.toUpperCase()})</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          {activeSection === 'general' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">
                {formData[`page_title_${activeTab}` as keyof IndexPageFormData] || 'No Title'}
              </h1>
            </div>
          )}
          
          {activeSection === 'about' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {formData[`about_header_${activeTab}` as keyof IndexPageFormData] || 'No About Heading'}
              </h2>
            </div>
          )}
          
          {activeSection === 'features' && (
  <div className="space-y-6">
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-2">
        {formData[`bullit_one_header_${activeTab}` as keyof IndexPageFormData] || 'No Feature 1 Heading'}
      </h3>
      <div className="text-gray-700 prose max-w-none" 
           dangerouslySetInnerHTML={{ 
             __html: formData[`bullit_one_text_${activeTab}` as keyof IndexPageFormData] || 'No Feature 1 Text' 
           }} 
      />
    </div>
    
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-2">
        {formData[`bullit_two_header_${activeTab}` as keyof IndexPageFormData] || 'No Feature 2 Heading'}
      </h3>
      <div className="text-gray-700 prose max-w-none" 
           dangerouslySetInnerHTML={{ 
             __html: formData[`bullit_two_text_${activeTab}` as keyof IndexPageFormData] || 'No Feature 2 Text' 
           }} 
      />
    </div>
    
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-2">
        {formData[`bullit_three_header_${activeTab}` as keyof IndexPageFormData] || 'No Feature 3 Heading'}
      </h3>
      <div className="text-gray-700 prose max-w-none" 
           dangerouslySetInnerHTML={{ 
             __html: formData[`bullit_three_text_${activeTab}` as keyof IndexPageFormData] || 'No Feature 3 Text' 
           }} 
      />
    </div>
  </div>
)}
          
          {activeSection === 'news-gallery' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {formData[`news_header_${activeTab}` as keyof IndexPageFormData] || 'No News Heading'}
                </h2>
                <div className="p-4 bg-gray-100 text-center rounded">
                  [News items will be displayed here]
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {formData[`gallery_header_${activeTab}` as keyof IndexPageFormData] || 'No Gallery Heading'}
                </h2>
                <div className="p-4 bg-gray-100 text-center rounded">
                  [Gallery items will be displayed here]
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPageEditor;