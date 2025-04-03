// NewsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { News, PostStatus, NewsFilter } from '../newsTypes';
import newsApi from '../api/newsApi';

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for filters
  const [filter, setFilter] = useState<NewsFilter>({
    searchTerm: '',
    status: undefined
  });
  
  const pageSize = 10;
  
  // Load news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const { news, totalCount } = await newsApi.getNews(currentPage, pageSize, filter);
      setNews(news);
      setTotalPages(Math.ceil(totalCount / pageSize));
      setError(null);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Failed to load news list');
    } finally {
      setLoading(false);
    }
  };
  
  // Load news when component mounts
  // or when page or filters change
  useEffect(() => {
    fetchNews();
  }, [currentPage, filter]);
  
  // Search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    // Use debounce to prevent too frequent requests
    const timerId = setTimeout(() => {
      setFilter(prev => ({ ...prev, searchTerm }));
      setCurrentPage(1); // Reset to first page when searching
    }, 300);
    
    return () => clearTimeout(timerId);
  };
  
  // Status filter change handler
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as PostStatus | undefined;
    setFilter(prev => ({ 
      ...prev, 
      status: e.target.value === 'all' ? undefined : status as PostStatus 
    }));
    setCurrentPage(1); // Reset to first page when changing filter
  };
  
  // Publish news handler
  const handlePublishNews = async (id: number) => {
    try {
      await newsApi.publishNews(id);
      fetchNews(); // Update list after change
      
    } catch (err) {
      console.error('Error publishing news:', err);
      setError('Failed to publish news');
    }
  };
  
  // Archive news handler
  const handleArchiveNews = async (id: number) => {
    try {
      await newsApi.archiveNews(id);
      fetchNews(); // Update list after change
      
    } catch (err) {
      console.error('Error archiving news:', err);
      setError('Failed to archive news');
    }
  };
  
  // Delete news handler
  const handleDeleteNews = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsApi.deleteNews(id);
        fetchNews(); // Update list after deletion
        
      } catch (err) {
        console.error('Error deleting news:', err);
        setError('Failed to delete news');
      }
    }
  };
  
  // Function to render status
  const renderStatus = (status: PostStatus) => {
    const statusStyles = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Published': 'bg-green-100 text-green-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    
    const statusLabels = {
      'Draft': 'Draft',
      'Published': 'Published',
      'Archived': 'Archived'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Management</h1>
        <Link
          to="/admin/news/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create News
        </Link>
      </div>
      
      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title..."
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              onChange={handleStatusFilterChange}
              className="w-full p-2 border rounded"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="Draft">Drafts</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* News table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Publication Date</th>
              <th className="p-3 text-left">Last Updated</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  No news found
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">
                    <Link 
                      to={`/admin/news/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.title_en}
                    </Link>
                  </td>
                  <td className="p-3">{renderStatus(item.status)}</td>
                  <td className="p-3">
                    {item.publish_date 
                      ? new Date(item.publish_date).toLocaleDateString() 
                      : '—'}
                  </td>
                  <td className="p-3">
                    {new Date(item.updated_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/news/${item.id}/edit`}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </Link>
                      
                      {item.status === 'Draft' && (
                        <button
                          onClick={() => handlePublishNews(item.id)}
                          className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Publish
                        </button>
                      )}
                      
                      {item.status === 'Published' && (
                        <button
                          onClick={() => handleArchiveNews(item.id)}
                          className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Archive
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NewsList;