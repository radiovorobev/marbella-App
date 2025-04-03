import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NewsFormData, News, PostStatus } from '../newsTypes';
import { newsApi } from '../api/newsApi';
import QuillEditor from '../components/quillEditor';

const NewsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState<NewsFormData>({
    author_id: 1, // In a real application, this will be the current user's ID
    title_en: '',
    text_en: '',
    title_es: null,
    text_es: null,
    title_ru: null,
    text_ru: null,
    preview_image_url: null,
    status: 'Draft'
  });
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRussian, setShowRussian] = useState(false);
  const [showSpanish, setShowSpanish] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  
  // Load news data if in edit mode
  useEffect(() => {
    const fetchNewsData = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const newsData = await newsApi.getNewsById(parseInt(id, 10));
          
          // Set received data in form
          setFormData({
            author_id: newsData.author_id,
            title_en: newsData.title_en,
            text_en: newsData.text_en,
            title_es: newsData.title_es,
            text_es: newsData.text_es,
            title_ru: newsData.title_ru,
            text_ru: newsData.text_ru,
            preview_image_url: newsData.preview_image_url,
            status: newsData.status,
            publish_date: newsData.publish_date
          });
          
          // Show additional languages if they are filled
          if (newsData.title_ru || newsData.text_ru) {
            setShowRussian(true);
          }
          
          if (newsData.title_es || newsData.text_es) {
            setShowSpanish(true);
          }
          
          setError(null);
        } catch (err) {
          console.error('Error loading news data:', err);
          setError('Failed to load news data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchNewsData();
  }, [id, isEditMode]);
  
  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Text editor change handler
  const handleEditorChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Image selection handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreviewImage(files[0]);
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload image if selected
      let imageUrl = formData.preview_image_url;
      if (previewImage) {
        imageUrl = await newsApi.uploadPreviewImage(previewImage);
      }
      
      // Prepare data for saving
      const newsData: NewsFormData = {
        ...formData,
        preview_image_url: imageUrl,
        // Set empty values for unused languages
        title_ru: showRussian ? formData.title_ru : null,
        text_ru: showRussian ? formData.text_ru : null,
        title_es: showSpanish ? formData.title_es : null,
        text_es: showSpanish ? formData.text_es : null,
      };
      
      // Save data
      if (isEditMode && id) {
        await newsApi.updateNews(parseInt(id, 10), newsData);
      } else {
        await newsApi.createNews(newsData);
      }
      
      // Redirect to news list
      navigate('/admin/news');
      
    } catch (err) {
      console.error('Error saving news:', err);
      setError('Failed to save news. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Publish news
  const handlePublish = async () => {
    if (isEditMode && id) {
      try {
        setLoading(true);
        await newsApi.publishNews(parseInt(id, 10));
        navigate('/admin/news');
      } catch (err) {
        console.error('Error publishing news:', err);
        setError('Failed to publish news');
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (loading && !formData.title_en) {
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
          {isEditMode ? 'Edit News' : 'Create News'}
        </h1>
        <button
          onClick={() => navigate('/admin/news')}
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">English Version</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <QuillEditor
            label="News Text"
            value={formData.text_en}
            onChange={(value) => handleEditorChange('text_en', value)}
            required
          />
        </div>
        
        {/* Russian Version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Russian Version</h2>
            <button 
              type="button"
              onClick={() => setShowRussian(!showRussian)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showRussian ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showRussian && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (RU)
                </label>
                <input
                  type="text"
                  name="title_ru"
                  value={formData.title_ru || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="News Text (RU)"
                value={formData.text_ru || ''}
                onChange={(value) => handleEditorChange('text_ru', value)}
              />
            </>
          )}
        </div>
        
        {/* Spanish Version */}
        <div className="mb-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Spanish Version</h2>
            <button 
              type="button"
              onClick={() => setShowSpanish(!showSpanish)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showSpanish ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSpanish && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (ES)
                </label>
                <input
                  type="text"
                  name="title_es"
                  value={formData.title_es || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <QuillEditor
                label="News Text (ES)"
                value={formData.text_es || ''}
                onChange={(value) => handleEditorChange('text_es', value)}
              />
            </>
          )}
        </div>
        
        {/* Preview Image */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Preview Image</h2>
          
          {formData.preview_image_url && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <img 
                src={formData.preview_image_url} 
                alt="Preview" 
                className="max-w-full h-auto max-h-48 border"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: 1200x630 pixels
            </p>
          </div>
        </div>
        
        {/* Publication Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Publication Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
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
            {loading ? 'Saving...' : 'Save'}
          </button>
          
          {isEditMode && formData.status === 'Draft' && (
            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              Publish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewsForm;