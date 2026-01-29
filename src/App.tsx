import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DailyPage } from './pages/DailyPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LanguageProvider } from './context/LanguageContext';
import { useLenis, LenisContext } from './hooks/useLenis';
import './index.css';

function AppContent() {
  const lenis = useLenis();

  return (
    <LenisContext.Provider value={lenis}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
      <Footer />
    </LenisContext.Provider>
  );
}

function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HashRouter>
  );
}

export default App;
