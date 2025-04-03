// src/admin/components/siteSettingsEditor.tsx
import React, { useState, useEffect } from 'react';
import { SiteSettingsFormData } from '../siteSettingsTypes';
import { siteSettingsApi } from '../api/siteSettingsApi';
import QuillEditor from '../components/quillEditor';

const SiteSettingsEditor: React.FC = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'contacts' | 'social'>('general');
  const [activeLang, setActiveLang] = useState<'en' | 'es' | 'ru'>('en');
  const [formData, setFormData] = useState<SiteSettingsFormData>({
    address_en: '',
    address_es: null,
    address_ru: null,
    phone_number: '',
    whatsapp_link: '',
    email: '',
    logo_svg: '',
    site_name: '',
    instagram_url: null,
    youtube_url: null,
    tiktok_url: null,
    facebook_url: null,
    address_url: null
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<boolean>(false);

  // Load site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setLoading(true);
        const settings = await siteSettingsApi.getSiteSettings();
        
        if (settings) {
          setFormData({
            address_en: settings.address_en,
            address_es: settings.address_es,
            address_ru: settings.address_ru,
            phone_number: settings.phone_number,
            whatsapp_link: settings.whatsapp_link,
            email: settings.email,
            logo_svg: settings.logo_svg,
            site_name: settings.site_name,
            instagram_url: settings.instagram_url,
            youtube_url: settings.youtube_url,
            tiktok_url: settings.tiktok_url,
            facebook_url: settings.facebook_url,
            address_url: settings.address_url
          });
          
          // Format last saved date
          const saveDate = new Date(settings.updated_at);
          setLastSaved(saveDate.toLocaleString('en-US'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading site settings:', err);
        setError('Failed to load site settings. Server is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo SVG changes
  const handleLogoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, logo_svg: value }));
  };

  // Toggle logo preview
  const toggleLogoPreview = () => {
    setLogoPreview(!logoPreview);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validate required fields
      const requiredFields = [
        'address_en',
        'phone_number',
        'whatsapp_link',
        'email',
        'logo_svg',
        'site_name'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof SiteSettingsFormData]);
      
      if (missingFields.length > 0) {
        setError(`The following required fields are missing: ${missingFields.join(', ')}`);
        setSaving(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setSaving(false);
        return;
      }
      
      // Validate phone number (basic check)
      const phoneRegex = /^[+]?[\d\s()-]{7,}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        setError('Please enter a valid phone number');
        setSaving(false);
        return;
      }
      
      // Validate URLs
      const urlFields = ['whatsapp_link', 'address_url', 'instagram_url', 'youtube_url', 'tiktok_url', 'facebook_url'];
      const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)?([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      
      for (const field of urlFields) {
        const value = formData[field as keyof SiteSettingsFormData];
        if (value && !urlRegex.test(value)) {
          setError(`Please enter a valid URL for ${field}`);
          setSaving(false);
          return;
        }
      }
      
      // Submit the data
      await siteSettingsApi.updateSiteSettings(formData);
      
      // Update last saved time
      const now = new Date();
      setLastSaved(now.toLocaleString('en-US'));
      
      // Clear error
      setError(null);
      
      // Show success message
      alert('Site settings saved successfully');
    } catch (err) {
      console.error('Error saving site settings:', err);
      setError('Failed to save site settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Change tab
  const handleTabChange = (tab: 'general' | 'address' | 'contacts' | 'social') => {
    setActiveTab(tab);
  };

  // Change language
  const handleLangChange = (lang: 'en' | 'es' | 'ru') => {
    setActiveLang(lang);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading site settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
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
          {/* Section Tabs */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                type="button"
                onClick={() => handleTabChange('general')}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'general' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('address')}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'address' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Address
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('contacts')}
                className={`px-4 py-2 mr-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'contacts' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contacts
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('social')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'social' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Social Media
              </button>
            </div>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Site Name */}
                <div>
                  <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="site_name"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The name of your website that will appear in various places.
                  </p>
                </div>
                
                {/* Logo SVG */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="logo_svg" className="block text-sm font-medium text-gray-700">
                      Logo SVG <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={toggleLogoPreview}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {logoPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                  <textarea
                    id="logo_svg"
                    name="logo_svg"
                    value={formData.logo_svg}
                    onChange={handleLogoChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the SVG code for your logo. Ensure it's a valid SVG.
                  </p>
                  
                  {logoPreview && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                      <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <div 
                          className="max-w-xs mx-auto"
                          dangerouslySetInnerHTML={{ __html: formData.logo_svg }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Address Settings */}
          {activeTab === 'address' && (
            <div className="p-6">
              {/* Language Tabs for Address */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleLangChange('en')}
                    className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                      activeLang === 'en'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('es')}
                    className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
                      activeLang === 'es'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Spanish (ES)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('ru')}
                    className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
                      activeLang === 'ru'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Russian (RU)
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Address Content */}
                <div>
                  <label htmlFor={`address_${activeLang}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Address ({activeLang.toUpperCase()})
                    {activeLang === 'en' && <span className="text-red-500"> *</span>}
                  </label>
                  <textarea
                    id={`address_${activeLang}`}
                    name={`address_${activeLang}`}
                    value={formData[`address_${activeLang}` as keyof SiteSettingsFormData] || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={activeLang === 'en'}
                  />
                </div>
                
                {/* Address URL (Google Maps or similar) */}
                {activeLang === 'en' && (
                  <div>
                    <label htmlFor="address_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Address URL (Map Link)
                    </label>
                    <input
                      type="text"
                      id="address_url"
                      name="address_url"
                      value={formData.address_url || ''}
                      onChange={handleChange}
                      placeholder="https://goo.gl/maps/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL to your location on Google Maps or another mapping service.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contacts' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+1 (234) 567-8900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                {/* WhatsApp Link */}
                <div>
                  <label htmlFor="whatsapp_link" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="whatsapp_link"
                    name="whatsapp_link"
                    value={formData.whatsapp_link}
                    onChange={handleChange}
                    placeholder="https://wa.me/1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Create your WhatsApp link at <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://wa.me/</a> with your phone number.
                  </p>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {activeTab === 'social' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Instagram */}
                <div>
                  <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    id="instagram_url"
                    name="instagram_url"
                    value={formData.instagram_url || ''}
                    onChange={handleChange}
                    placeholder="https://instagram.com/youraccount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* YouTube */}
                <div>
                  <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    id="youtube_url"
                    name="youtube_url"
                    value={formData.youtube_url || ''}
                    onChange={handleChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* TikTok */}
                <div>
                  <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700 mb-1">
                    TikTok URL
                  </label>
                  <input
                    type="text"
                    id="tiktok_url"
                    name="tiktok_url"
                    value={formData.tiktok_url || ''}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@youraccount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Facebook */}
                <div>
                  <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    id="facebook_url"
                    name="facebook_url"
                    value={formData.facebook_url || ''}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourpage"
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
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Preview for Current Tab */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
{/* General Preview */}
{activeTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Site Name</h3>
                <p className="text-gray-700">{formData.site_name || 'Not set'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Logo</h3>
                {formData.logo_svg ? (
                  <div className="max-w-xs p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div 
                      dangerouslySetInnerHTML={{ __html: formData.logo_svg }} 
                    />
                  </div>
                ) : (
                  <p className="text-gray-700 italic">No logo set</p>
                )}
              </div>
            </div>
          )}
          
          {/* Address Preview */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Address ({activeLang.toUpperCase()})
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {formData[`address_${activeLang}` as keyof SiteSettingsFormData] || 'Not set'}
                </p>
              </div>
              
              {activeLang === 'en' && formData.address_url && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Map Link</h3>
                  <a 
                    href={formData.address_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formData.address_url}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Contacts Preview */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-700">{formData.phone_number || 'Not set'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1">WhatsApp</h3>
                  {formData.whatsapp_link ? (
                    <a 
                      href={formData.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      WhatsApp Link
                    </a>
                  ) : (
                    <p className="text-gray-700 italic">Not set</p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  {formData.email ? (
                    <a 
                      href={`mailto:${formData.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {formData.email}
                    </a>
                  ) : (
                    <p className="text-gray-700 italic">Not set</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Social Media Preview */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <h3 className="font-medium text-gray-900">Instagram</h3>
                  </div>
                  {formData.instagram_url ? (
                    <a 
                      href={formData.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      {formData.instagram_url}
                    </a>
                  ) : (
                    <p className="text-gray-700 italic mt-2">Not set</p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <h3 className="font-medium text-gray-900">YouTube</h3>
                  </div>
                  {formData.youtube_url ? (
                    <a 
                      href={formData.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      {formData.youtube_url}
                    </a>
                  ) : (
                    <p className="text-gray-700 italic mt-2">Not set</p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <h3 className="font-medium text-gray-900">TikTok</h3>
                  </div>
                  {formData.tiktok_url ? (
                    <a 
                      href={formData.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      {formData.tiktok_url}
                    </a>
                  ) : (
                    <p className="text-gray-700 italic mt-2">Not set</p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <h3 className="font-medium text-gray-900">Facebook</h3>
                  </div>
                  {formData.facebook_url ? (
                    <a 
                      href={formData.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      {formData.facebook_url}
                    </a>
                  ) : (
                    <p className="text-gray-700 italic mt-2">Not set</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsEditor;