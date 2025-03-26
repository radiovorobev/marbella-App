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

function App() {

  return (
    <Router>
      <LanguageProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<ArticlePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/venues" element={<VenuesPage /> } />
        <Route path="/programmes" element={<ProgrammesPage />} />
        <Route path="/camps" element={<CampsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
      <Footer />
      </LanguageProvider>
    </Router>      
  )
}

export default App