import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coachesApi } from '../api/coachesApi';
import { newsApi } from '../api/newsApi';
import { userApi } from '../api/userApi';

// Define module type for metrics
type MetricItem = {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
};

// Define module type for action items
type ActionItem = {
  id: string;
  title: string;
  timestamp: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

const AdminHome: React.FC = () => {
  // State management
  const [coachesCount, setCoachesCount] = useState<number>(0);
  const [newsCount, setNewsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel for better performance
        // Get coaches data
        const coaches = await coachesApi.getAllCoaches();
        setCoachesCount(coaches.length);
        
        // Get news data - using correct method from the API
        const newsResponse = await newsApi.getNews();
        setNewsCount(newsResponse.totalCount || newsResponse.news.length);
        
        // Get users data
        const usersResponse = await userApi.getUsers();
        setUsersCount(usersResponse.totalCount || usersResponse.users.length);
        } catch (err) {
          console.error('Error loading statistics:', err);
          setError('Failed to load statistics data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
    };

    fetchCounts();
  }, []);

  // Icons components
  const UserIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  
  const NewsIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
  
  const ProgramIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
  
  const CoachIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  
  const CampIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  );
  
  const LocationIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const GalleryIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  
  const ContactIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  
  const SettingsIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const InfoIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  
  const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );

  // Admin modules data
  const adminModules = [
    {
      id: 'users',
      title: 'Users',
      description: 'Manage system users, their roles, and permissions.',
      icon: <UserIcon />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHoverBg: 'hover:bg-blue-700',
      link: '/admin/users',
      isAvailable: true
    },
    {
      id: 'news',
      title: 'News',
      description: 'Create, edit, and delete news and articles on the website.',
      icon: <NewsIcon />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600',
      buttonHoverBg: 'hover:bg-green-700',
      link: '/admin/news',
      isAvailable: true
    },
    {
      id: 'programs',
      title: 'Programs',
      description: 'Manage academy programs and courses.',
      icon: <ProgramIcon />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonBg: 'bg-purple-600',
      buttonHoverBg: 'hover:bg-purple-700',
      link: '/admin/subscriptions',
      isAvailable: true
    },
    {
      id: 'programmes-page',
      title: 'Programs Page',
      description: 'Edit the main content of the programs page and card sections.',
      icon: <ProgramIcon />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonBg: 'bg-purple-600',
      buttonHoverBg: 'hover:bg-purple-700',
      link: '/admin/programmes-page',
      isAvailable: true
    },
    {
      id: 'coaches',
      title: 'Coaches',
      description: 'Manage information about academy coaches.',
      icon: <CoachIcon />,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600',
      buttonHoverBg: 'hover:bg-yellow-700',
      link: '/admin/coaches',
      isAvailable: true
    },
    {
      id: 'coaches-page',
      title: 'Coaches Page',
      description: 'Edit the main content of the coaches page.',
      icon: <DocumentIcon />, // Use an appropriate icon
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonBg: 'bg-purple-600',
      buttonHoverBg: 'hover:bg-purple-700',
      link: '/admin/coaches-page',
      isAvailable: true
    },
    {
      id: 'camps',
      title: 'Camps',
      description: 'Manage information about camps and training sessions.',
      icon: <CampIcon />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600',
      buttonHoverBg: 'hover:bg-red-700',
      link: '/admin/camps-page',
      isAvailable: true
    },
    {
      id: 'locations',
      title: 'Locations',
      description: 'Manage information about training locations and venues.',
      icon: <LocationIcon />,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      buttonBg: 'bg-indigo-600',
      buttonHoverBg: 'hover:bg-indigo-700',
      link: '/admin/locations',
      isAvailable: false
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Manage photos and videos in the website gallery.',
      icon: <GalleryIcon />,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      buttonBg: 'bg-pink-600',
      buttonHoverBg: 'hover:bg-pink-700',
      link: '/admin/gallery',
      isAvailable: false
    },
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'Manage contact information and the feedback form.',
      icon: <ContactIcon />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-600',
      buttonHoverBg: 'hover:bg-orange-700',
      link: '/admin/contacts',
      isAvailable: false
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'General website settings, SEO, and configuration management.',
      icon: <SettingsIcon />,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      buttonBg: 'bg-gray-600',
      buttonHoverBg: 'hover:bg-gray-700',
      link: '/admin/settings',
      isAvailable: false
    },
    {
      id: 'menu',
      title: 'Menu',
      description: 'Manage website navigation menu items for header and footer.',
      icon: <MenuIcon />,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      buttonBg: 'bg-cyan-600',
      buttonHoverBg: 'hover:bg-cyan-700',
      link: '/admin/menu',
      isAvailable: true
    }
  ];

  // Build metrics data
  const metricsData: MetricItem[] = [
    {
      id: 'users-metric',
      title: 'Users',
      count: usersCount,
      icon: <UserIcon />,
      color: 'text-blue-600',
      link: '/admin/users'
    },
    {
      id: 'news-metric',
      title: 'News',
      count: newsCount,
      icon: <NewsIcon />,
      color: 'text-green-600',
      link: '/admin/news'
    },
    {
      id: 'coaches-metric',
      title: 'Coaches',
      count: coachesCount,
      icon: <CoachIcon />,
      color: 'text-yellow-600',
      link: '/admin/coaches'
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage content and settings of the Marbella International Football Academy website
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create
            </button>
          </div>
        </div>
      </header>
      
      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome info card */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-blue-50 p-2">
                <InfoIcon />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Welcome to the Admin Panel</h3>
              <p className="mt-1 text-sm text-gray-600">
                Here you can manage all content of the Marbella International Football Academy website.
                Use the cards below to navigate through sections. Current statistics are available in the section below.
              </p>
              <div className="mt-3">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View Guide <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {metricsData.map(metric => (
          <div 
            key={metric.id} 
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${metric.id.includes('users') ? 'bg-blue-100' : metric.id.includes('news') ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <div className={metric.color}>{metric.icon}</div>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">{metric.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metric.count}</div>
                    {metric.link && (
                      <div className="ml-2">
                        <Link 
                          to={metric.link}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          More details
                        </Link>
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* Admin modules */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {adminModules.map(module => (
          <div 
            key={module.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`${module.iconBg} p-3 rounded-full`}>
                  <div className={module.iconColor}>{module.icon}</div>
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">{module.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 h-12">
                {module.description}
              </p>
              {module.isAvailable ? (
                <Link
                  to={module.link}
                  className={`inline-flex items-center px-4 py-2 ${module.buttonBg} text-white rounded ${module.buttonHoverBg} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Manage
                </Link>
              ) : (
                <span 
                  className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
                  title="This section is under development"
                >
                  Under Development
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
  
      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; 2025 Marbella International Football Academy
          </div>
          <div className="text-sm text-gray-500">
            Version 1.0.2
          </div>
        </div>
      </footer>
    </div>
  );
  
};

export default AdminHome; 