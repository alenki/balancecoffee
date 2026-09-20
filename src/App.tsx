import { useCallback, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { RoasteryPage } from './pages/RoasteryPage';
import { BranchesPage } from './pages/BranchesPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useLenis, LenisContext } from './hooks/useLenis';
import './index.css';

function AppContent() {
  const lenis = useLenis();
  const { t } = useLanguage();

  // The site mounts mid-resolve, while the loading field is still closed,
  // so the hero's own entrance choreography runs as the field parts.
  const [loading, setLoading] = useState(true);
  const reveal = useCallback(() => setLoading(false), []);

  // A plain href="#main" would rewrite the hash, and the hash is the route.
  const skipToContent = () => {
    const main = document.getElementById('main');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <LenisContext.Provider value={lenis}>
      <LoadingScreen onDone={reveal} />
      {!loading && (
        <>
          <button type="button" className="skipLink" onClick={skipToContent}>
            {t('a11y.skipToContent')}
          </button>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/roastery" element={<RoasteryPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </>
      )}
    </LenisContext.Provider>
  );
}

function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <MotionConfig reducedMotion="user">
          <AppContent />
        </MotionConfig>
      </LanguageProvider>
    </HashRouter>
  );
}

export default App;
