// App.tsx с добавленными маршрутами для программ подписки
import './App.css';
import './admin/adminStyles.css'; // Импортируем стили для админки
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';

// Основные компоненты
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { LanguageProvider } from './context/languageContext';

// HOC
import withLoader from './hoc/withLoader';

// Страницы основного сайта
import IndexPage from './pages';
import ArticlePage from './pages/article/article';
import AboutPage from './pages/about/about';
import CoachesPage from './pages/coaches/coaches';
import VenuesPage from './pages/venues/venues';
import ProgrammesPage from './pages/programmes/programmes';
import NewsPage from './pages/news/news';
import ContactsPage from './pages/contacts/contacts';
import CampsPage from './pages/camps/camps';
import CookiesPage from './pages/cookies/cookies';
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy';
import CoachesList from './admin/components/coachesList';
import CoachForm from './admin/components/coachForm';

// Ленивая загрузка компонентов административной панели
const AdminLayout = lazy(() => import('./admin/components/adminLayout'));
const AdminHome = lazy(() => import('./admin/components/adminHome'));

// Импорт компонентов для управления программами подписки
const SubscriptionsList = lazy(() => import('./admin/components/subscriptionsList'));
const SubscriptionForm = lazy(() => import('./admin/components/subscriptionForm'));

// Компоненты для управления пользователями
const UsersList = lazy(() => import('./admin/components/usersList'));
const UserDetails = lazy(() => import('./admin/components/userDetails'));

// Компоненты для управления новостями
const NewsList = lazy(() => import('./admin/components/newsList'));
const NewsDetails = lazy(() => import('./admin/components/newsDetails'));
const NewsForm = lazy(() => import('./admin/components/newsForm'));

// Импорт компонента редактора страницы лагерей
const CampsPageEditor = lazy(() => import('./admin/components/campsPageEditor'));

const CoachesPageEditor = lazy(() => import('./admin/components/coachesPageEditor'));


// Применяем HOC к страницам основного сайта
const IndexPageWithLoader = withLoader(IndexPage);
const NewsPageWithLoader = withLoader(NewsPage);
const ArticlePageWithLoader = withLoader(ArticlePage);
const AboutPageWithLoader = withLoader(AboutPage);
const CoachesPageWithLoader = withLoader(CoachesPage);
const VenuesPageWithLoader = withLoader(VenuesPage);
const ProgrammesPageWithLoader = withLoader(ProgrammesPage);
const CampsPageWithLoader = withLoader(CampsPage);
const ContactsPageWithLoader = withLoader(ContactsPage);
const CookiesPageWithLoader = withLoader(CookiesPage);
const PrivacyPolicyWithLoader = withLoader(PrivacyPolicy);

// Простой компонент для загрузки административной части
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-700">Загрузка административной панели...</p>
    </div>
  </div>
);

// Компонент защиты роута админки
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Здесь должна быть проверка авторизации и роли пользователя
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Для демонстрационных целей всегда создаем токен и считаем пользователя авторизованным
    localStorage.setItem('admin_token', 'demo_token');
    setIsAuthenticated(true);
    
    // В реальном приложении здесь будет проверка токена из localStorage и проверка роли
    // const token = localStorage.getItem('admin_token');
    // if (token) {
    //   // проверка валидности токена через API
    //   setIsAuthenticated(true);
    // }
  }, []);
  
  // Показываем индикатор загрузки, пока не определили состояние авторизации
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Проверка авторизации...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Маршруты административной панели */}
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
              </Suspense>
            </ProtectedAdminRoute>
          } 
        >
          {/* Вложенные маршруты админки, которые будут отображаться через Outlet */}
          <Route index element={<AdminHome />} />
          
          {/* Маршруты для управления пользователями */}
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetails />} />
          
          {/* Маршруты для управления новостями */}
          <Route path="news" element={<NewsList />} />
          <Route path="news/create" element={<NewsForm />} />
          <Route path="news/:id" element={<NewsDetails />} />
          <Route path="news/:id/edit" element={<NewsForm />} />

          {/* Маршруты для управления тренерами */}
          <Route path="coaches" element={<CoachesList />} />
          <Route path="coaches/new" element={<CoachForm />} />
          <Route path="coaches/edit/:id" element={<CoachForm />} />
          
          {/* Маршруты для управления программами подписки */}
          <Route path="subscriptions" element={<SubscriptionsList />} />
          <Route path="subscriptions/new" element={<SubscriptionForm />} />
          <Route path="subscriptions/edit/:id" element={<SubscriptionForm />} />

          {/* Маршрут для редактирования страницы лагерей */}
          <Route path="camps-page" element={<CampsPageEditor />} />

          <Route path="coaches-page" element={<CoachesPageEditor />} />
        </Route>
        
        {/* Маршруты основного сайта */}
        <Route 
          path="/*" 
          element={
            <LanguageProvider>
              <Header />
              <Routes>
                <Route path="/" element={<IndexPageWithLoader />} />
                <Route path="/news" element={<NewsPageWithLoader />} />
                <Route path="/news/:id" element={<ArticlePageWithLoader />} />
                <Route path="/about" element={<AboutPageWithLoader />} />
                <Route path="/coaches" element={<CoachesPageWithLoader />} />
                <Route path="/venues" element={<VenuesPageWithLoader />} />
                <Route path="/programmes" element={<ProgrammesPageWithLoader />} />
                <Route path="/camps" element={<CampsPageWithLoader />} />
                <Route path="/contacts" element={<ContactsPageWithLoader />} />
                <Route path="/cookies" element={<CookiesPageWithLoader />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyWithLoader />} />
              </Routes>
              <Footer />
            </LanguageProvider>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;