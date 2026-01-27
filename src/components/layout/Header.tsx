import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { CitySelector } from '../common/CitySelector';
import styles from './Header.module.css';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Logo size="md" />

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
        </nav>

        <div className={styles.actions}>
          <CitySelector />

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
        </nav>
      </div>
    </header>
  );
}
