import './App.css'

import Header from './components/header/header';
import { LanguageProvider } from './context/languageContext';
import Footer from './components/footer/footer';
import IndexPage from './pages';

function App() {

  return (
    <LanguageProvider>
    <Header />
    <IndexPage />
    <Footer />
    </LanguageProvider>
  )
}

export default App