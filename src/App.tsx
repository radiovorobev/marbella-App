import './App.css'

import Header from './components/header/header';
import { LanguageProvider } from './context/languageContext';
import Footer from './components/footer/footer';
import IndexPage from './pages';
import ArticlePage from './pages/article/article';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/about/about';
import CoachesPage from './pages/coaches/coaches';
import VenuesPage from './pages/venues/venues';
import ProgrammesPage from './pages/programmes/programmes';
import NewsPage from './pages/news/news';
import ContactsPage from './pages/contacts/contacts';
import CampsPage from './pages/camps/camps';
import withLoader from './hoc/withLoader';

const IndexPageWithLoader = withLoader(IndexPage);
const NewsPageWithLoader = withLoader(NewsPage);
const ArticlePageWithLoader = withLoader(ArticlePage);
const AboutPageWithLoader = withLoader(AboutPage);
const CoachesPageWithLoader = withLoader(CoachesPage);
const VenuesPageWithLoader = withLoader(VenuesPage);
const ProgrammesPageWithLoader = withLoader(ProgrammesPage);
const CampsPageWithLoader = withLoader(CampsPage);
const ContactsPageWithLoader = withLoader(ContactsPage);

function App() {

  return (
    <Router>
      <LanguageProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPageWithLoader />} />
        <Route path="/news" element={<NewsPageWithLoader />} />
        <Route path="/news/:id" element={<ArticlePageWithLoader />} />
        <Route path="/about" element={<AboutPageWithLoader />} />
        <Route path="/coaches" element={<CoachesPageWithLoader />} />
        <Route path="/venues" element={<VenuesPageWithLoader /> } />
        <Route path="/programmes" element={<ProgrammesPageWithLoader />} />
        <Route path="/camps" element={<CampsPageWithLoader />} />
        <Route path="/contacts" element={<ContactsPageWithLoader />} />
      </Routes>
      <Footer />
      </LanguageProvider>
    </Router>      
  )
}

export default App