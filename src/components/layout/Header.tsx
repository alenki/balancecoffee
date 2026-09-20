import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo } from '../../data/contact';
import styles from './Header.module.css';

/** Minimum scroll distance before triggering hide (prevents jitter). */
const SCROLL_THRESHOLD = 8;
/** How long (ms) the user must keep scrolling down before the header hides. */
const HIDE_DELAY = 600;

const NAV = [
  { to: '/', key: 'nav.home' },
  { to: '/menu', key: 'nav.menu' },
  { to: '/branches', key: 'nav.branches' },
  { to: '/contact', key: 'nav.contact' },
] as const;

/** Points along the reading direction: mirrored in RTL by the stylesheet. */
function Arrow() {
  return (
    <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const [isHiddenByScroll, setIsHiddenByScroll] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingDown = useRef(false);

  const isMenuPage = location.pathname === '/menu';

  // Closing the menu on navigation is a reset, not a synchronisation, so it
  // adjusts state during render rather than in an effect. An effect would
  // paint the overlay once over the new route before closing it.
  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  // Scroll-based hide/show, disabled on the menu page where the category rail
  // needs the header to hold still. The menu page does not reset the flag: it
  // simply stops applying it, which keeps this effect free of setState.
  useEffect(() => {
    if (isMenuPage) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

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
        if (!scrollingDown.current) {
          scrollingDown.current = true;
          if (hideTimer.current) clearTimeout(hideTimer.current);
          hideTimer.current = setTimeout(() => {
            if (scrollingDown.current) setIsHiddenByScroll(true);
          }, HIDE_DELAY);
        }
      } else if (delta < -SCROLL_THRESHOLD) {
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

  // Publishes the measured header height as a custom property so anything
  // that has to sit directly beneath it, such as the menu page category rail,
  // can pin itself without repeating the padding arithmetic per breakpoint.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Measured from the border box, and rounded down: half a pixel of overlap
    // hides behind the header, where half a pixel of gap would show a sliver
    // of the page scrolling through.
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${Math.floor(header.getBoundingClientRect().height)}px`
      );
    });

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const langSwitch = (
    <div className={styles.langSwitch} role="radiogroup" aria-label={t('a11y.language')}>
      <button
        type="button"
        className={`${styles.langOption} ${lang === 'ar' ? styles.langActive : ''}`}
        onClick={() => setLang('ar')}
        role="radio"
        aria-checked={lang === 'ar'}
      >
        عربي
      </button>
      <span className={styles.langDivider} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.langOption} ${lang === 'en' ? styles.langActive : ''}`}
        onClick={() => setLang('en')}
        role="radio"
        aria-checked={lang === 'en'}
      >
        EN
      </button>
    </div>
  );

  return (
    <>
      <header
        ref={headerRef}
        className={[
          styles.header,
          isHiddenByScroll && !isMenuPage && !isMobileMenuOpen ? styles.scrollHidden : '',
          isMobileMenuOpen ? styles.menuActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.container}>
          <nav className={styles.desktopNav}>
            {NAV.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navText}>{t(key)}</span>
                <span className={styles.navRule} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <div className={styles.logoZone}>
            <Logo size="md" variant="default" />
          </div>

          <div className={styles.actions}>
            <a
              className={`${styles.shopLink} ${styles.desktopOnly}`}
              href={contactInfo.shop}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('nav.shop')}
            </a>
            <div className={styles.desktopOnly}>{langSwitch}</div>

            <button
              type="button"
              className={`${styles.menuButton} ${isMobileMenuOpen ? styles.open : ''}`}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileInner}>
          <nav className={styles.mobileNav}>
            {NAV.map(({ to, key }, index) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                }
                onClick={closeMobileMenu}
                style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + index * 0.06}s` : '0s' }}
              >
                <span className={styles.mobileNavIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.mobileNavLabel}>{t(key)}</span>
                <Arrow />
              </NavLink>
            ))}
            <a
              href={contactInfo.shop}
              className={styles.mobileNavLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + NAV.length * 0.06}s` : '0s' }}
            >
              <span className={styles.mobileNavIndex}>
                {String(NAV.length + 1).padStart(2, '0')}
              </span>
              <span className={styles.mobileNavLabel}>{t('nav.shop')}</span>
              <Arrow />
            </a>
          </nav>

          <div
            className={styles.mobileFooter}
            style={{ transitionDelay: isMobileMenuOpen ? '0.3s' : '0s' }}
          >
            {langSwitch}
          </div>
        </div>
      </div>
    </>
  );
}
