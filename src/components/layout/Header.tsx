import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { OpenStatus } from '../common/OpenStatus';
import { useLanguage, type Lang } from '../../context/LanguageContext';
import { cafe } from '../../data/cafe';
import styles from './Header.module.css';

/** Minimum scroll distance before triggering hide (prevents jitter) */
const SCROLL_THRESHOLD = 8;
/** How long (ms) user must keep scrolling down before header hides */
const HIDE_DELAY = 600;

function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  const options: Lang[] = ['ru', 'en'];

  return (
    <div className={[styles.langSwitch, className].filter(Boolean).join(' ')} role="radiogroup" aria-label={t('nav.language')}>
      {options.map((option, i) => (
        <span key={option} className={styles.langItem}>
          {i > 0 && <span className={styles.langDivider} aria-hidden="true" />}
          <button
            type="button"
            className={`${styles.langOption} ${lang === option ? styles.langActive : ''}`}
            onClick={() => setLang(option)}
            role="radio"
            aria-checked={lang === option}
          >
            {option.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

const Arrow = () => (
  <svg className={styles.arrow} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Header() {
  const [hiddenByScroll, setIsHiddenByScroll] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  // The overlay remembers which page it was opened on, so navigating
  // anywhere closes it without an effect having to.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const isMobileMenuOpen = menuOpenOn === location.pathname;
  const setIsMobileMenuOpen = useCallback(
    (open: boolean) => setMenuOpenOn(open ? location.pathname : null),
    [location.pathname]
  );

  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingDown = useRef(false);

  // The menu page has its own sticky chapter bar under the header, so the
  // header stays put there.
  const isMenuPage = location.pathname === '/menu';
  const isHiddenByScroll = hiddenByScroll && !isMenuPage;

  // Scroll-based hide/show (disabled on menu page)
  useEffect(() => {
    if (isMenuPage) return;

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
        // Scrolling down: hide only if the user keeps going
        if (!scrollingDown.current) {
          scrollingDown.current = true;
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
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Escape closes the overlay, as it would any dialog
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, [setIsMobileMenuOpen]);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/reading-room', label: t('nav.readingRoom') },
    { to: '/reviews', label: t('nav.guestBook') },
    // A place on the home page rather than a page, so it never takes the
    // ribbon: that stays on the page you are on.
    { to: '/?game', label: t('nav.game'), section: true },
  ];

  return (
    <>
      <header
        className={`${styles.header} ${isHiddenByScroll && !isMobileMenuOpen ? styles.scrollHidden : ''} ${isMobileMenuOpen ? styles.menuActive : ''}`}
      >
        <div className={styles.container}>
          <nav className={styles.desktopNav} aria-label={t('nav.mainAria')}>
            {navItems.map(({ to, label, section }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.navLink} ${isActive && !section ? styles.active : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.logoZone}>
            <Logo className={styles.logo} />
          </div>

          <div className={styles.actions}>
            <LangSwitch className={styles.desktopOnly} />
            <a
              href={cafe.whatsapp}
              className={`${styles.delivery} ${styles.desktopOnly}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('nav.deliveryAria')}
            >
              {t('nav.delivery')}
              <Arrow />
            </a>

            <button
              type="button"
              className={`${styles.menuButton} ${isMobileMenuOpen ? styles.open : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu, on the cloth */}
      <div
        id="mobile-menu"
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
      >
        <div className={styles.mobileInner}>
          <nav className={styles.mobileNav} aria-label={t('nav.mainAria')}>
            {navItems.map(({ to, label, section }, index) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.mobileNavLink} ${isActive && !section ? styles.active : ''}`}
                onClick={closeMobileMenu}
                style={{ transitionDelay: isMobileMenuOpen ? `${0.08 + index * 0.06}s` : '0s' }}
              >
                <span className={styles.mobileNavLabel}>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div
            className={styles.mobileFooter}
            style={{ transitionDelay: isMobileMenuOpen ? '0.32s' : '0s' }}
          >
            <OpenStatus tone="paper" />
            <div className={styles.mobileContacts}>
              <a href={cafe.phoneHref} className={styles.mobileContact}>
                {cafe.phone}
              </a>
              <a
                href={cafe.whatsapp}
                className={styles.mobileContact}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('nav.deliveryAria')}
              >
                {t('nav.delivery')} <Arrow />
              </a>
            </div>
            <LangSwitch />
          </div>
        </div>
      </div>
    </>
  );
}
