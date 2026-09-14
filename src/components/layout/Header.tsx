import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo } from '../../data/locations';
import styles from './Header.module.css';

/** Minimum scroll distance before triggering hide (prevents jitter) */
const SCROLL_THRESHOLD = 8;
/** How long (ms) user must keep scrolling down before header hides */
const HIDE_DELAY = 600;

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHiddenByScroll, setIsHiddenByScroll] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingDown = useRef(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isMenuPage = location.pathname === '/menu';

  // Scroll-based hide/show (disabled on menu page)
  useEffect(() => {
    if (isMenuPage) {
      setIsHiddenByScroll(false);
      return;
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Near top of page: always show
      if (currentY < 80) {
        setIsHiddenByScroll(false);
        scrollingDown.current = false;
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        lastScrollY.current = currentY;
        return;
      }

      if (delta > SCROLL_THRESHOLD) {
        // Scrolling down
        if (!scrollingDown.current) {
          scrollingDown.current = true;
          // Start a timer: hide only if user keeps scrolling down
          if (hideTimer.current) clearTimeout(hideTimer.current);
          hideTimer.current = setTimeout(() => {
            if (scrollingDown.current) {
              setIsHiddenByScroll(true);
            }
          }, HIDE_DELAY);
        }
      } else if (delta < -SCROLL_THRESHOLD) {
        // Scrolling up: show immediately
        scrollingDown.current = false;
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        setIsHiddenByScroll(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isMenuPage]);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/daily', label: t('nav.daily') },
  ];

  const langUpper = lang.toUpperCase();

  return (
    <>
      <header
        className={`${styles.header} ${isVisible ? styles.visible : ''} ${isHiddenByScroll && !isMobileMenuOpen ? styles.scrollHidden : ''} ${isMobileMenuOpen ? styles.menuActive : ''}`}
      >
        {/* Thin accent line at top */}
        <div className={styles.accentLine} aria-hidden="true" />

        <div className={styles.container}>
          {/* Zone 1: Navigation (left) */}
          <nav className={styles.desktopNav}>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navText}>{label}</span>
                <span className={styles.navDot} aria-hidden="true" />
              </NavLink>
            ))}
            <a
              href={contactInfo.telegram}
              className={styles.navLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.navText}>{t('nav.vacancies')}</span>
              <span className={styles.navDot} aria-hidden="true" />
            </a>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navText}>{t('nav.feedback')}</span>
              <span className={styles.navDot} aria-hidden="true" />
            </NavLink>
          </nav>

          {/* Zone 2: Logo (center) */}
          <div className={styles.logoZone}>
            <Logo size="md" variant="default" />
          </div>

          {/* Zone 3: Actions (right) */}
          <div className={styles.actions}>
            <div className={`${styles.langSwitch} ${styles.desktopOnly}`} role="radiogroup" aria-label="Language">
              <button
                className={`${styles.langOption} ${langUpper === 'RU' ? styles.langActive : ''}`}
                onClick={() => setLang('ru')}
                role="radio"
                aria-checked={langUpper === 'RU'}
              >
                RU
              </button>
              <span className={styles.langDivider} aria-hidden="true" />
              <button
                className={`${styles.langOption} ${langUpper === 'EN' ? styles.langActive : ''}`}
                onClick={() => setLang('en')}
                role="radio"
                aria-checked={langUpper === 'EN'}
              >
                EN
              </button>
            </div>

            <button
              className={`${styles.menuButton} ${isMobileMenuOpen ? styles.open : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileInner}>
          {/* Mobile nav links */}
          <nav className={styles.mobileNav}>
            {navItems.map(({ to, label }, index) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                }
                onClick={closeMobileMenu}
                style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + index * 0.06}s` : '0s' }}
              >
                <span className={styles.mobileNavIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.mobileNavLabel}>{label}</span>
                <svg
                  className={styles.mobileNavArrow}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10H16M16 10L11 5M16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavLink>
            ))}
            <a
              href={contactInfo.telegram}
              className={styles.mobileNavLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + navItems.length * 0.06}s` : '0s' }}
            >
              <span className={styles.mobileNavIndex}>
                {String(navItems.length + 1).padStart(2, '0')}
              </span>
              <span className={styles.mobileNavLabel}>{t('nav.vacancies')}</span>
              <svg
                className={styles.mobileNavArrow}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
              }
              onClick={closeMobileMenu}
              style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + (navItems.length + 1) * 0.06}s` : '0s' }}
            >
              <span className={styles.mobileNavIndex}>
                {String(navItems.length + 2).padStart(2, '0')}
              </span>
              <span className={styles.mobileNavLabel}>{t('nav.feedback')}</span>
              <svg
                className={styles.mobileNavArrow}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          </nav>

          {/* Mobile footer area */}
          <div
            className={styles.mobileFooter}
            style={{ transitionDelay: isMobileMenuOpen ? '0.3s' : '0s' }}
          >
            <div className={styles.mobileFooterRow}>
              <div className={styles.langSwitch} role="radiogroup" aria-label="Language">
                <button
                  className={`${styles.langOption} ${langUpper === 'RU' ? styles.langActive : ''}`}
                  onClick={() => setLang('ru')}
                  role="radio"
                  aria-checked={langUpper === 'RU'}
                >
                  RU
                </button>
                <span className={styles.langDivider} aria-hidden="true" />
                <button
                  className={`${styles.langOption} ${langUpper === 'EN' ? styles.langActive : ''}`}
                  onClick={() => setLang('en')}
                  role="radio"
                  aria-checked={langUpper === 'EN'}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
