import './App.css'

import Header from './components/header/header';
import { LanguageProvider } from './context/languageContext';
import Footer from './components/footer/footer';
import IndexPage from './pages';
import ArticlePage from './pages/article/article';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/about/about';

function App() {

  return (
    <Router>
      <LanguageProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/news/:id" element={<ArticlePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
      </LanguageProvider>
    </Router>      
  )
}

export default App