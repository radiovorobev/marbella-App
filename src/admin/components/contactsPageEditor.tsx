// src/admin/components/contactsPageEditor.tsx
import React, { useState, useEffect } from 'react';
import { ContactsPageFormData } from '../contactsPageTypes';
import { contactsPageApi } from '../api/contactsPageApi';
import QuillEditor from '../components/quillEditor';

const ContactsPageEditor: React.FC = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'ru'>('en');
  const [formData, setFormData] = useState<ContactsPageFormData>({
    title_en: '',
    title_es: null,
    title_ru: null,
    maps_embed: '',
    text_en: '',
    text_es: null,
    text_ru: null
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [previewMap, setPreviewMap] = useState(false);

  // Load page data
  useEffect(() => {
    const fetchContactsPageData = async () => {
      try {
        setLoading(true);
        const pageData = await contactsPageApi.getContactsPageData();
        
        if (pageData) {
          setFormData({
            title_en: pageData.title_en || '',
            title_es: pageData.title_es || null,
            title_ru: pageData.title_ru || null,
            maps_embed: pageData.maps_embed || '',
            text_en: pageData.text_en || '',
            text_es: pageData.text_es || null,
            text_ru: pageData.text_ru || null
          });
          
          // Format last saved date
          const saveDate = new Date(pageData.created_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading contacts page data:', err);
        setError('Failed to load page data. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactsPageData();
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
      await contactsPageApi.updateContactsPageData(formData);
      
      // Update last saved time
      const now = new Date();
      setLastSaved(now.toLocaleString('en-US'));
      
      // Clear error
      setError(null);
      
      // Show success message
      alert('Contacts page content saved successfully');
    } catch (err) {
      console.error('Error saving contacts page data:', err);
      setError('Failed to save page data. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle map preview
  const toggleMapPreview = () => {
    setPreviewMap(!previewMap);
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
          <p className="text-gray-700 font-medium">Loading contacts page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Contacts Page</h1>
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
                <label htmlFor={`title_${activeTab}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  id={`title_${activeTab}`}
                  name={`title_${activeTab}`}
                  value={formData[`title_${activeTab}` as keyof ContactsPageFormData] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Contact Text Content */}
              <div>
                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                <QuillEditor
                  label={`Contact Text (${activeTab.toUpperCase()})`}
                  value={formData[`text_${activeTab}` as keyof ContactsPageFormData] || ''}
                  onChange={(value) => handleQuillChange(`text_${activeTab}`, value)}
                />
              </div>
            </div>
          </div>

          {/* Google Maps Section (Common for all languages) */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-3">Google Maps Embed</h3>
            
            <div className="mb-4">
              <label htmlFor="maps_embed" className="block text-sm font-medium text-gray-700 mb-1">
                Embed Code
              </label>
              <textarea
                id="maps_embed"
                name="maps_embed"
                value={formData.maps_embed || ''}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the HTML iframe code from Google Maps. Go to Google Maps, select your location, click "Share", then "Embed a map" and copy the HTML.
              </p>
            </div>
            
            {/* Toggle map preview */}
            <div className="mb-4">
              <button 
                type="button"
                onClick={toggleMapPreview}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {previewMap ? 'Hide Map Preview' : 'Show Map Preview'}
              </button>
            </div>
            
            {/* Map preview */}
            {previewMap && formData.maps_embed && (
              <div className="mb-4">
                <div className="w-full h-80 border border-gray-300 rounded-lg overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: formData.maps_embed }} />
                </div>
              </div>
            )}
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
            {formData[`title_${activeTab}` as keyof ContactsPageFormData] || 'Contacts Page Title'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: formData[`text_${activeTab}` as keyof ContactsPageFormData] || '<p>Contact information goes here...</p>' 
              }} />
            </div>
            
            {formData.maps_embed && (
              <div className="w-full h-80 border border-gray-300 rounded-lg overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: formData.maps_embed }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPageEditor;