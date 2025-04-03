// NewsDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { News, PostStatus } from '../newsTypes';
import { newsApi } from '../api/newsApi';

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'ru' | 'es'>('en');
  
  useEffect(() => {
    const fetchNews = async () => {
      if (!id) {
        setError('News ID is not specified');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const newsData = await newsApi.getNewsById(parseInt(id, 10));
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error loading news information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [id]);
  
  // Publish news handler
  const handlePublish = async () => {
    if (!news) return;
    
    try {
      setLoading(true);
      const updatedNews = await newsApi.publishNews(news.id);
      setNews(updatedNews);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error publishing news');
    } finally {
      setLoading(false);
    }
  };
  
  // Archive news handler
  const handleArchive = async () => {
    if (!news) return;
    
    try {
      setLoading(true);
      const updatedNews = await newsApi.archiveNews(news.id);
      setNews(updatedNews);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error archiving news');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete news handler
  const handleDelete = async () => {
    if (!news) return;
    
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        setLoading(true);
        await newsApi.deleteNews(news.id);
        navigate('/admin/news');
      } catch (err) {
        console.error(err);
        setError('Error deleting news');
        setLoading(false);
      }
    }
  };
  
  // Function to format status
  const getStatusBadge = (status: PostStatus) => {
    const statusConfig = {
      'Draft': { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      'Published': { color: 'bg-green-100 text-green-800', label: 'Published' },
      'Archived': { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
        {statusConfig[status].label}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error || !news) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error || 'News not found'}
        </div>
        <button
          onClick={() => navigate('/admin/news')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Information</h1>
        <div className="flex space-x-2">
          <Link
            to={`/admin/news/${news.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => navigate('/admin/news')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Back to List
          </button>
        </div>
      </div>
      
      {/* Main Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{news.title_en}</h2>
              <p className="text-gray-500 text-sm mt-1">
                ID: {news.id} | 
                Last Updated: {new Date(news.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(news.status)}
              
              {news.publish_date && (
                <span className="text-sm text-gray-600">
                  Published: {new Date(news.publish_date).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Preview Image */}
          {news.preview_image_url && (
            <div className="mb-4">
              <img 
                src={news.preview_image_url} 
                alt="Preview" 
                className="max-w-full h-auto border rounded"
              />
            </div>
          )}
          
          {/* Language Tabs */}
          <div className="mb-4 border-b">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('en')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'en' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
              </li>
              {news.title_ru && (
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('ru')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'ru' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Russian
                  </button>
                </li>
              )}
              {news.title_es && (
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('es')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'es' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Spanish
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          {/* News Content by Tabs */}
          <div className="mb-6">
            {activeTab === 'en' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_en}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_en }}
                />
              </div>
            )}
            
            {activeTab === 'ru' && news.title_ru && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_ru}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_ru || '' }}
                />
              </div>
            )}
            
            {activeTab === 'es' && news.title_es && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">
                  {news.title_es}
                </h3>
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: news.text_es || '' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Metadata and Actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          
          <div className="flex space-x-2">
            <Link
              to={`/admin/news/${news.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            
            {news.status === 'Draft' && (
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Publish
              </button>
            )}
            
            {news.status === 'Published' && (
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Archive
              </button>
            )}
            
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
  );
};

export default NewsDetails;