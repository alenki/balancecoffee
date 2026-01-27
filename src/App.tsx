import { HashRouter, Routes, Route } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import './index.css';

function App() {
  return (
    <CityProvider>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
        <Footer />
      </HashRouter>
    </CityProvider>
  );
}

export default App;
