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

function App() {

  return (
    <Router>
      <LanguageProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/news/:id" element={<ArticlePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/venues" element={<VenuesPage /> } />
      </Routes>
      <Footer />
      </LanguageProvider>
    </Router>      
  )
}

export default App