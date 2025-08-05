import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { LanguageProvider } from './context/languageContext';
import { useMenuItems } from './hooks/useMenuItems';
import { routeComponentMap } from './utils/routeComponentMap';
import withLoader from './hoc/withLoader';

import IndexPage from './pages/index'; 
const IndexPageWithLoader = withLoader(IndexPage);

import ArticlePage from './pages/article/article';
const ArticlePageWithLoader = withLoader(ArticlePage);

const ClientRoutes = () => {
  const { menuItems, loading } = useMenuItems();

  if (loading) return <div className="p-10 text-center">Loading menu...</div>;

  return (
    <LanguageProvider>
      <Header />
      <Routes>

  {!menuItems.some(item => item.url === '/' || item.url === '') && (
    <Route index element={<IndexPageWithLoader />} />
  )}

  <Route path="news/:id" element={<ArticlePageWithLoader />} />

        {menuItems.map((item) => {

          const key = item.url.startsWith('/') ? item.url : `/${item.url}`;
          const Component = routeComponentMap[key];
          if (!Component) {
            console.warn(`⚠️ No component mapped for: ${key}`);
            return null;
          }
          const Wrapped = withLoader(Component);
          return <Route key={item.id} path={key.slice(1)} element={<Wrapped />} />;
        })}
        <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
      </Routes>
      <Footer />
    </LanguageProvider>
  );
};

export default ClientRoutes;
