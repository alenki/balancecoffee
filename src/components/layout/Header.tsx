import { useState, useEffect, useLayoutEffect, useCallback, useRef, type CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { Logo } from '../common/Logo';
import { OpenStatus } from '../common/OpenStatus';
import { useLanguage, type Lang } from '../../context/LanguageContext';
import { cafe } from '../../data/cafe';
import { toRoman } from '../../utils/format';
import styles from './Header.module.css';

/** Minimum scroll distance before triggering hide (prevents jitter) */
const SCROLL_THRESHOLD = 8;
/** How long (ms) user must keep scrolling down before header hides */
const HIDE_DELAY = 600;
/** How long the contents stay up once a chapter is chosen in them, for the
    ribbon to move to it (ms). Matches its move in Header.module.css. */
const RIBBON_MOVE = 560;
/** How far the ribbon's points fall below the chapter's baseline (px). */
const RIBBON_TAIL = 6;

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
  const { lang, t } = useLanguage();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  // The contents remember the page they were opened on, so navigating
  // anywhere (the back button too) closes them without an effect having to.
  // A chapter chosen in them is let in as well, for the beat the ribbon
  // takes to move to it before the sheet goes back up.
  const [menu, setMenu] = useState<{ on: string; to?: string } | null>(null);
  const isMobileMenuOpen = menu !== null && (menu.on === pathname || menu.to === pathname);
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingDown = useRef(false);

  // The menu page has its own sticky chapter bar under the header, so the
  // header stays put there.
  const isMenuPage = pathname === '/menu';
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

  const closeMobileMenu = useCallback(() => {
    clearTimeout(holdTimer.current);
    setMenu(null);
  }, []);

  const openMobileMenu = () => {
    clearTimeout(holdTimer.current);
    setMenu({ on: pathname });
  };

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  // Escape closes the contents, as it would any dialog, and hands focus
  // back to the button that opened them.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeMobileMenu();
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen, closeMobileMenu]);

  /** A chapter chosen in the contents: the ribbon moves to it while the
      page changes underneath, then the sheet goes back up. */
  const choose = (to: string) => {
    if (!menu || to === pathname || reduceMotion) {
      closeMobileMenu();
      return;
    }
    setMenu({ on: menu.on, to });
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setMenu(null), RIBBON_MOVE);
  };

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/reading-room', label: t('nav.readingRoom') },
    { to: '/reviews', label: t('nav.guestBook') },
    // A place on the home page rather than a page, so it never takes the
    // ribbon: that stays on the page you are on.
    { to: '/?game', label: t('nav.game'), section: true },
  ];
  const chapters = navItems.filter(({ section }) => !section);

  // The ribbon hangs from under the running head to just below the marked
  // chapter's baseline, measured from a zero-size point set on it, so it
  // holds through any wrap, font swap or edition.
  const leafRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLSpanElement>(null);
  const baselines = useRef<(HTMLSpanElement | null)[]>([]);
  const marked = chapters.findIndex(({ to }) => to === (menu?.to ?? pathname));

  useLayoutEffect(() => {
    const leaf = leafRef.current;
    const ribbon = ribbonRef.current;
    if (!leaf || !ribbon) return;

    const measure = () => {
      const baseline = baselines.current[marked];
      const reach = baseline
        ? Math.round(baseline.getBoundingClientRect().top - leaf.getBoundingClientRect().top) + RIBBON_TAIL
        : 0;
      ribbon.style.setProperty('--reach', `${reach}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(leaf);
    document.fonts.addEventListener('loadingdone', measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [marked, lang]);

  const external = (label: string) => `${label}, ${t('common.newTab')}`;

  const socials = [
    { href: cafe.instagram, label: 'Instagram' },
    { href: cafe.vk, label: 'VK' },
  ];

  return (
    <>
      <header
        className={`${styles.header} ${isHiddenByScroll && !isMobileMenuOpen ? styles.scrollHidden : ''}`}
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

          <div className={styles.logoZone} onClick={closeMobileMenu}>
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
              ref={toggleRef}
              type="button"
              className={`${styles.menuButton} ${isMobileMenuOpen ? styles.open : ''}`}
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
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

      {/* The contents, on a sheet drawn down from the running head's rule */}
      <div
        id="mobile-menu"
        className={[styles.sheet, isMobileMenuOpen && styles.open, menu?.to && styles.turning]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        data-lenis-prevent
      >
        <div className={styles.page}>
          <div className={styles.leaf} ref={leafRef}>
            <span className={styles.ribbon} ref={ribbonRef} aria-hidden="true" />

            <nav className={styles.contents} aria-label={t('nav.mainAria')}>
              <ol className={styles.toc}>
                {chapters.map(({ to, label }, i) => (
                  <li key={to} style={{ '--i': i } as CSSProperties}>
                    <NavLink to={to} end={to === '/'} className={styles.entry} onClick={() => choose(to)}>
                      <span className={styles.numeral} aria-hidden="true">{toRoman(i + 1)}</span>
                      <span className={styles.line}>
                        <span className={styles.title}>{label}</span>
                        <span
                          className={styles.baseline}
                          ref={(el) => {
                            baselines.current[i] = el;
                          }}
                        />
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ol>

              {/* A place in the first chapter rather than a chapter of its
                  own, so it follows unnumbered, as a book's back matter does */}
              <Link
                to="/?game"
                className={`${styles.entry} ${styles.extra}`}
                style={{ '--i': chapters.length } as CSSProperties}
                onClick={() => choose('/')}
              >
                <span className={styles.line}>
                  <span className={styles.title}>{t('nav.game')}</span>
                </span>
              </Link>
            </nav>

            <div className={styles.colophon}>
              <div className={styles.rows}>
                <div className={styles.row}>
                  <a
                    href={cafe.route}
                    className={styles.lead}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={external(`${t('brand.address')}, ${t('footer.route')}`)}
                  >
                    {t('brand.address')}
                    <Arrow />
                  </a>
                  <OpenStatus className={styles.aside} dot={false} />
                </div>
                <div className={styles.row}>
                  <a href={cafe.phoneHref} className={`${styles.lead} ${styles.phone}`}>
                    {cafe.phone}
                  </a>
                  <a
                    href={cafe.whatsapp}
                    className={styles.aside}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('nav.deliveryAria')}
                  >
                    {t('nav.delivery')}
                    <Arrow />
                  </a>
                </div>
              </div>

              <div className={styles.foot}>
                <LangSwitch />
                <div className={styles.socials}>
                  {socials.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className={styles.social}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={external(label)}
                    >
                      {label}
                      <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.seamTrack} aria-hidden="true">
          <span className={styles.seam} />
        </div>
      </div>
    </>
  );
}
