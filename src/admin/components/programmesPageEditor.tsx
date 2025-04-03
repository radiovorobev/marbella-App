// src/admin/components/ProgrammesPageEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ProgrammesPageData, ProgrammesPageFormData } from '../programmesPageTypes';
import { programmesPageApi } from '../api/programmesPageApi';
import QuillEditor from './quillEditor'; // Adjust path as needed

const ProgrammesPageEditor: React.FC = () => {
  console.log('ProgrammesPageEditor rendering');
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'ru'>('en');
  const [activeSection, setActiveSection] = useState<'main' | 'subscriptions' | 'cards' | 'textTwo'>('main');
  const [formData, setFormData] = useState<ProgrammesPageFormData>({
    title_en: '',
    title_es: '',
    title_ru: '',
    text_en: '',
    text_es: '',
    text_ru: '',
    subs_title_en: '',
    subs_title_es: '',
    subs_title_ru: '',
    subs_text_en: '',
    subs_text_es: '',
    subs_text_ru: '',
    text_two_en: '',
    text_two_es: '',
    text_two_ru: '',
    text_two_image: null,
    card_one_img: null,
    card_two_img: null,
    card_three_img: null,
    card_four_img: null,
    card_one_text_en: '',
    card_one_text_es: '',
    card_one_text_ru: '',
    card_two_text_en: '',
    card_two_text_es: '',
    card_two_text_ru: '',
    card_three_text_en: '',
    card_three_text_es: '',
    card_three_text_ru: '',
    card_four_text_en: '',
    card_four_text_es: '',
    card_four_text_ru: '',
    fourCards_title_en: '',
    fourCards_title_es: '',
    fourCards_title_ru: ''
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Refs for file inputs
  const textTwoImageRef = useRef<HTMLInputElement>(null);
  const cardOneImgRef = useRef<HTMLInputElement>(null);
  const cardTwoImgRef = useRef<HTMLInputElement>(null);
  const cardThreeImgRef = useRef<HTMLInputElement>(null);
  const cardFourImgRef = useRef<HTMLInputElement>(null);

  // Load page data
  useEffect(() => {
    const fetchProgrammesPageData = async () => {
      try {
        setLoading(true);
        const pageData = await programmesPageApi.getProgrammesPageData();
        
        if (pageData) {
          setFormData({
            title_en: pageData.title_en || '',
            title_es: pageData.title_es || '',
            title_ru: pageData.title_ru || '',
            text_en: pageData.text_en || '',
            text_es: pageData.text_es || '',
            text_ru: pageData.text_ru || '',
            subs_title_en: pageData.subs_title_en || '',
            subs_title_es: pageData.subs_title_es || '',
            subs_title_ru: pageData.subs_title_ru || '',
            subs_text_en: pageData.subs_text_en || '',
            subs_text_es: pageData.subs_text_es || '',
            subs_text_ru: pageData.subs_text_ru || '',
            text_two_en: pageData.text_two_en || '',
            text_two_es: pageData.text_two_es || '',
            text_two_ru: pageData.text_two_ru || '',
            text_two_image: pageData.text_two_image || null,
            card_one_img: pageData.card_one_img || null,
            card_two_img: pageData.card_two_img || null,
            card_three_img: pageData.card_three_img || null,
            card_four_img: pageData.card_four_img || null,
            card_one_text_en: pageData.card_one_text_en || '',
            card_one_text_es: pageData.card_one_text_es || '',
            card_one_text_ru: pageData.card_one_text_ru || '',
            card_two_text_en: pageData.card_two_text_en || '',
            card_two_text_es: pageData.card_two_text_es || '',
            card_two_text_ru: pageData.card_two_text_ru || '',
            card_three_text_en: pageData.card_three_text_en || '',
            card_three_text_es: pageData.card_three_text_es || '',
            card_three_text_ru: pageData.card_three_text_ru || '',
            card_four_text_en: pageData.card_four_text_en || '',
            card_four_text_es: pageData.card_four_text_es || '',
            card_four_text_ru: pageData.card_four_text_ru || '',
            fourCards_title_en: pageData.fourCards_title_en || '',
            fourCards_title_es: pageData.fourCards_title_es || '',
            fourCards_title_ru: pageData.fourCards_title_ru || ''
          });
          
          // Format last saved date
          const saveDate = new Date(pageData.created_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading programmes page data:', err);
        setError('Failed to load page data. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammesPageData();
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

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await programmesPageApi.uploadImage(file, 'programme');
      setFormData(prev => ({ ...prev, [imageField]: publicUrl }));
    } catch (err) {
      console.error(`Error uploading ${imageField}:`, err);
      setError(`Failed to upload image. Please try again.`);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await programmesPageApi.updateProgrammesPageData(formData);
      
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
      console.error('Error saving programmes page data:', err);
      setError('Failed to save page data. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Change active tab
  const handleTabChange = (tab: 'en' | 'es' | 'ru') => {
    setActiveTab(tab);
  };

  // Change active section
  const handleSectionChange = (section: 'main' | 'subscriptions' | 'cards' | 'textTwo') => {
    setActiveSection(section);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading programmes page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Programs Page</h1>
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
          {/* Section tabs */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSectionChange('main')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'main' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Main Content
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('subscriptions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'subscriptions' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Subscriptions Section
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('textTwo')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'textTwo' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Secondary Content
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('cards')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'cards' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Card Section
              </button>
            </div>
          </div>

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

          {/* Main Content Section */}
          <div className={`${activeSection === 'main' ? 'block' : 'hidden'}`}>
            {/* EN Main Content */}
            <div className={`p-6 ${activeTab === 'en' && activeSection === 'main' ? '' : 'hidden'}`}>
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
                    label="Main Content (EN)"
                    value={formData.text_en || ''}
                    onChange={(value) => handleQuillChange('text_en', value)}
                  />
                </div>
              </div>
            </div>

            {/* ES Main Content */}
            <div className={`p-6 ${activeTab === 'es' && activeSection === 'main' ? '' : 'hidden'}`}>
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
                    label="Main Content (ES)"
                    value={formData.text_es || ''}
                    onChange={(value) => handleQuillChange('text_es', value)}
                  />
                </div>
              </div>
            </div>

            {/* RU Main Content */}
            <div className={`p-6 ${activeTab === 'ru' && activeSection === 'main' ? '' : 'hidden'}`}>
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
                    label="Main Content (RU)"
                    value={formData.text_ru || ''}
                    onChange={(value) => handleQuillChange('text_ru', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscriptions Section */}
          <div className={`${activeSection === 'subscriptions' ? 'block' : 'hidden'}`}>
            {/* EN Subscriptions */}
            <div className={`p-6 ${activeTab === 'en' && activeSection === 'subscriptions' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="subs_title_en" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscriptions Section Title (EN)
                  </label>
                  <input
                    type="text"
                    id="subs_title_en"
                    name="subs_title_en"
                    value={formData.subs_title_en || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <QuillEditor
                    label="Subscriptions Section Content (EN)"
                    value={formData.subs_text_en || ''}
                    onChange={(value) => handleQuillChange('subs_text_en', value)}
                  />
                </div>
              </div>
            </div>

            {/* ES Subscriptions */}
            <div className={`p-6 ${activeTab === 'es' && activeSection === 'subscriptions' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="subs_title_es" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscriptions Section Title (ES)
                  </label>
                  <input
                    type="text"
                    id="subs_title_es"
                    name="subs_title_es"
                    value={formData.subs_title_es || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <QuillEditor
                    label="Subscriptions Section Content (ES)"
                    value={formData.subs_text_es || ''}
                    onChange={(value) => handleQuillChange('subs_text_es', value)}
                  />
                </div>
              </div>
            </div>

            {/* RU Subscriptions */}
            <div className={`p-6 ${activeTab === 'ru' && activeSection === 'subscriptions' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="subs_title_ru" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscriptions Section Title (RU)
                  </label>
                  <input
                    type="text"
                    id="subs_title_ru"
                    name="subs_title_ru"
                    value={formData.subs_title_ru || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <QuillEditor
                    label="Subscriptions Section Content (RU)"
                    value={formData.subs_text_ru || ''}
                    onChange={(value) => handleQuillChange('subs_text_ru', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Two Section */}
          <div className={`${activeSection === 'textTwo' ? 'block' : 'hidden'}`}>
            {/* Text Two Image Upload */}
            <div className="p-6 border-b border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Content Image
                </label>
                <div className="flex items-center gap-6">
                  {formData.text_two_image && (
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      <img 
                        src={formData.text_two_image} 
                        alt="Secondary content" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, text_two_image: null }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="text_two_image"
                      name="text_two_image"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'text_two_image')}
                      ref={textTwoImageRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => textTwoImageRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {formData.text_two_image ? 'Change Image' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* EN Text Two */}
            <div className={`p-6 ${activeTab === 'en' && activeSection === 'textTwo' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <QuillEditor
                    label="Secondary Content (EN)"
                    value={formData.text_two_en || ''}
                    onChange={(value) => handleQuillChange('text_two_en', value)}
                  />
                </div>
              </div>
            </div>

            {/* ES Text Two */}
            <div className={`p-6 ${activeTab === 'es' && activeSection === 'textTwo' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <QuillEditor
                    label="Secondary Content (ES)"
                    value={formData.text_two_es || ''}
                    onChange={(value) => handleQuillChange('text_two_es', value)}
                  />
                </div>
              </div>
            </div>

            {/* RU Text Two */}
            <div className={`p-6 ${activeTab === 'ru' && activeSection === 'textTwo' ? '' : 'hidden'}`}>
              <div className="space-y-6">
                <div>
                  <QuillEditor
                    label="Secondary Content (RU)"
                    value={formData.text_two_ru || ''}
                    onChange={(value) => handleQuillChange('text_two_ru', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className={`${activeSection === 'cards' ? 'block' : 'hidden'}`}>
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cards Title */}
                <div className="md:col-span-3 mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card Section Title</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="fourCards_title_en" className="block text-sm font-medium text-gray-700 mb-1">
                        Title (EN)
                      </label>
                      <input
                        type="text"
                        id="fourCards_title_en"
                        name="fourCards_title_en"
                        value={formData.fourCards_title_en || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="fourCards_title_es" className="block text-sm font-medium text-gray-700 mb-1">
                        Title (ES)
                      </label>
                      <input
                        type="text"
                        id="fourCards_title_es"
                        name="fourCards_title_es"
                        value={formData.fourCards_title_es || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="fourCards_title_ru" className="block text-sm font-medium text-gray-700 mb-1">
                        Title (RU)
                      </label>
                      <input
                        type="text"
                        id="fourCards_title_ru"
                        name="fourCards_title_ru"
                        value={formData.fourCards_title_ru || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 1 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card 1</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Image
                    </label>
                    <div className="flex items-start gap-4">
                      {formData.card_one_img && (
                        <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <img 
                            src={formData.card_one_img} 
                            alt="Card 1" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, card_one_img: null }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="card_one_img"
                          name="card_one_img"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'card_one_img')}
                          ref={cardOneImgRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cardOneImgRef.current?.click()}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          {formData.card_one_img ? 'Change' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card_one_text_en" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (EN)
                      </label>
                      <textarea
                        id="card_one_text_en"
                        name="card_one_text_en"
                        value={formData.card_one_text_en || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_one_text_es" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (ES)
                      </label>
                      <textarea
                        id="card_one_text_es"
                        name="card_one_text_es"
                        value={formData.card_one_text_es || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_one_text_ru" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (RU)
                      </label>
                      <textarea
                        id="card_one_text_ru"
                        name="card_one_text_ru"
                        value={formData.card_one_text_ru || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card 2</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Image
                    </label>
                    <div className="flex items-start gap-4">
                      {formData.card_two_img && (
                        <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <img 
                            src={formData.card_two_img} 
                            alt="Card 2" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, card_two_img: null }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="card_two_img"
                          name="card_two_img"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'card_two_img')}
                          ref={cardTwoImgRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cardTwoImgRef.current?.click()}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          {formData.card_two_img ? 'Change' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card_two_text_en" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (EN)
                      </label>
                      <textarea
                        id="card_two_text_en"
                        name="card_two_text_en"
                        value={formData.card_two_text_en || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_two_text_es" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (ES)
                      </label>
                      <textarea
                        id="card_two_text_es"
                        name="card_two_text_es"
                        value={formData.card_two_text_es || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_two_text_ru" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (RU)
                      </label>
                      <textarea
                        id="card_two_text_ru"
                        name="card_two_text_ru"
                        value={formData.card_two_text_ru || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card 3</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Image
                    </label>
                    <div className="flex items-start gap-4">
                      {formData.card_three_img && (
                        <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <img 
                            src={formData.card_three_img} 
                            alt="Card 3" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, card_three_img: null }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="card_three_img"
                          name="card_three_img"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'card_three_img')}
                          ref={cardThreeImgRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cardThreeImgRef.current?.click()}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          {formData.card_three_img ? 'Change' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card_three_text_en" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (EN)
                      </label>
                      <textarea
                        id="card_three_text_en"
                        name="card_three_text_en"
                        value={formData.card_three_text_en || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_three_text_es" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (ES)
                      </label>
                      <textarea
                        id="card_three_text_es"
                        name="card_three_text_es"
                        value={formData.card_three_text_es || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_three_text_ru" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (RU)
                      </label>
                      <textarea
                        id="card_three_text_ru"
                        name="card_three_text_ru"
                        value={formData.card_three_text_ru || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card 4</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Image
                    </label>
                    <div className="flex items-start gap-4">
                      {formData.card_four_img && (
                        <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <img 
                            src={formData.card_four_img} 
                            alt="Card 4" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, card_four_img: null }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="card_four_img"
                          name="card_four_img"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'card_four_img')}
                          ref={cardFourImgRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cardFourImgRef.current?.click()}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          {formData.card_four_img ? 'Change' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="card_four_text_en" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (EN)
                      </label>
                      <textarea
                        id="card_four_text_en"
                        name="card_four_text_en"
                        value={formData.card_four_text_en || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_four_text_es" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (ES)
                      </label>
                      <textarea
                        id="card_four_text_es"
                        name="card_four_text_es"
                        value={formData.card_four_text_es || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card_four_text_ru" className="block text-sm font-medium text-gray-700 mb-1">
                        Text (RU)
                      </label>
                      <textarea
                        id="card_four_text_ru"
                        name="card_four_text_ru"
                        value={formData.card_four_text_ru || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
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

      {/* Preview (only shown for certain sections) */}
      {(activeSection === 'main' || activeSection === 'subscriptions' || activeSection === 'textTwo') && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview ({activeTab.toUpperCase()})</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            {activeSection === 'main' && activeTab === 'en' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{formData.title_en || 'No title'}</h1>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_en || 'No content' }} />
              </div>
            )}
            {activeSection === 'main' && activeTab === 'es' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{formData.title_es || 'Sin título'}</h1>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_es || 'Sin contenido' }} />
              </div>
            )}
            {activeSection === 'main' && activeTab === 'ru' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{formData.title_ru || 'Нет заголовка'}</h1>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_ru || 'Нет содержимого' }} />
              </div>
            )}
            
            {activeSection === 'subscriptions' && activeTab === 'en' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{formData.subs_title_en || 'No subscriptions title'}</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.subs_text_en || 'No subscriptions content' }} />
              </div>
            )}
            {activeSection === 'subscriptions' && activeTab === 'es' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{formData.subs_title_es || 'Sin título de suscripciones'}</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.subs_text_es || 'Sin contenido de suscripciones' }} />
              </div>
            )}
            {activeSection === 'subscriptions' && activeTab === 'ru' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{formData.subs_title_ru || 'Нет заголовка подписок'}</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.subs_text_ru || 'Нет содержимого подписок' }} />
              </div>
            )}
            
            {activeSection === 'textTwo' && activeTab === 'en' && (
              <div>
                {formData.text_two_image && (
                  <img 
                    src={formData.text_two_image} 
                    alt="Secondary content" 
                    className="w-full h-64 object-cover mb-4 rounded-md"
                  />
                )}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_two_en || 'No secondary content' }} />
              </div>
            )}
            {activeSection === 'textTwo' && activeTab === 'es' && (
              <div>
                {formData.text_two_image && (
                  <img 
                    src={formData.text_two_image} 
                    alt="Contenido secundario" 
                    className="w-full h-64 object-cover mb-4 rounded-md"
                  />
                )}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_two_es || 'Sin contenido secundario' }} />
              </div>
            )}
            {activeSection === 'textTwo' && activeTab === 'ru' && (
              <div>
                {formData.text_two_image && (
                  <img 
                    src={formData.text_two_image} 
                    alt="Дополнительный контент" 
                    className="w-full h-64 object-cover mb-4 rounded-md"
                  />
                )}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.text_two_ru || 'Нет дополнительного содержимого' }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammesPageEditor;