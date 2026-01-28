import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { CitySelector } from '../common/CitySelector';
import styles from './Header.module.css';

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the home page (hero visible)
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // On home page: show navbar after scrolling past hero threshold
        setIsVisible(window.scrollY > 100);
      } else {
        // On other pages: always show navbar
        setIsVisible(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.container}>
        <Logo size="md" variant="default" />

        <nav className={styles.desktopNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Меню
          </NavLink>
          <NavLink
            to="/daily"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Daily
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <CitySelector variant="default" />

          <button
            className={`${styles.menuButton} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Главная
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Меню
          </NavLink>
          <NavLink
            to="/daily"
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Daily
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
