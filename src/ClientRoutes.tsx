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

{menuItems.map((item) => {
  if (item.component_key === 'news') {
    const base = item.url.startsWith('/') ? item.url.slice(1) : item.url;
    return (
      <Route
        key={`${item.id}-detail`}
        path={`${base}/:id`}
        element={<ArticlePageWithLoader />}
      />
    );
  }
  return null;
})}

{menuItems.map((item) => {
  const path = item.url.startsWith('/') ? item.url : `/${item.url}`;
  const key = item.component_key;
  const Component = routeComponentMap[key];

  if (!Component) {
    console.warn(`⚠️ No component for key: ${key}`);
    return null;
  }

  const Wrapped = withLoader(Component);

  return item.url === '/' || item.url === '' ? (
    <Route key={item.id} index element={<Wrapped />} />
  ) : (
    <Route key={item.id} path={path.slice(1)} element={<Wrapped />} />
  );
})}

        <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
      </Routes>
      <Footer />
    </LanguageProvider>
  );
};

export default ClientRoutes;
