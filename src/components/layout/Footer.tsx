import { useRef, type CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { WORDMARK, WORDMARK_GAPS, WORDMARK_VIEWBOX } from '../common/brandMarks';
import { useLanguage } from '../../context/LanguageContext';
import { useLenisInstance } from '../../hooks/useLenis';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { cafe, formatHour } from '../../data/cafe';
import { toRoman } from '../../utils/format';
import styles from './Footer.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

const [, , MARK_W, MARK_H] = WORDMARK_VIEWBOX.split(' ').map(Number);

/**
 * The wordmark cut into its ten letters, so each can rise on its own. Each
 * letter keeps the wordmark's full height and its own slice of the width, so
 * set side by side they rebuild the mark exactly.
 */
const LETTERS = (() => {
  const edges = [0, ...WORDMARK_GAPS, MARK_W];
  const paths = WORDMARK_GAPS.map(() => '').concat('');
  for (const subpath of WORDMARK.split(/(?=M)/)) {
    const x = parseFloat(subpath.slice(1));
    paths[WORDMARK_GAPS.filter((gap) => gap < x).length] += subpath;
  }
  return paths.map((d, i) => ({
    d,
    x: edges[i],
    w: edges[i + 1] - edges[i],
    // The middle letters first, then outward to both ends.
    order: Math.floor(Math.abs(i - (paths.length - 1) / 2)),
  }));
})();

const ExternalArrow = () => (
  <svg className={styles.arrow} width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Lumako's mark, signing the page at the foot of the address. Its period
 * catches the gold once, the first time it comes fully into view.
 */
function Credit() {
  const { t } = useLanguage();
  const ref = useRef<HTMLAnchorElement>(null);
  const seen = useInView(ref, { once: true, amount: 1 });

  return (
    <a
      ref={ref}
      href="https://lumako.ru"
      className={styles.credit}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('footer.creditAria')}
      data-signed={seen || undefined}
    >
      <span className={styles.creditMark}>
        Lumako<span className={styles.creditDot}>.</span>
      </span>
    </a>
  );
}

/**
 * The wordmark drawn as wide as the page, and the last thing on it: nothing
 * stands beneath it. As it comes into view the letters rise up out of the
 * page's bottom edge, middle first.
 */
function TitleLine() {
  const { t } = useLanguage();
  const lenis = useLenisInstance();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div className={styles.title} ref={ref}>
      <Link
        to="/"
        onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}
        className={styles.titleLink}
        aria-label={t('nav.homeAria')}
      >
        <span className={styles.letters}>
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className={styles.letter}
              style={{ width: `${(letter.w / MARK_W) * 100}%` }}
              // Far enough down to clear the margin under the mark as well.
              initial={reduce ? false : { y: '180%' }}
              animate={inView ? { y: '0%' } : undefined}
              transition={{ duration: 1.2, ease, delay: 0.1 + letter.order * 0.07 }}
            >
              <svg viewBox={`${letter.x} 0 ${letter.w} ${MARK_H}`} aria-hidden="true" focusable="false">
                <path d={letter.d} fill="currentColor" fillRule="evenodd" />
              </svg>
            </motion.span>
          ))}
        </span>
      </Link>
    </div>
  );
}

/**
 * The book's last page. Russian books keep their contents at the back, so the
 * navigation is set as one, chapter numerals and all.
 */
export function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { opensAt, closesAt } = useOpenStatus();
  const currentYear = new Date().getFullYear();

  const external = (label: string) => `${label}, ${t('common.newTab')}`;

  const chapters = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/reading-room', label: t('nav.readingRoom') },
    { to: '/reviews', label: t('nav.guestBook') },
  ];
  const current = chapters.findIndex(({ to }) => to === pathname);

  const socials = [
    { href: cafe.whatsapp, label: 'WhatsApp' },
    { href: cafe.instagram, label: 'Instagram' },
    { href: cafe.vk, label: 'VK' },
  ];

  return (
    <footer className={styles.footer}>
      <span className={styles.cloth} aria-hidden="true" />

      <div className={styles.page}>
        <div className={styles.top}>
          <nav className={styles.contents} aria-label={t('footer.contents')}>
            {/* Hangs from the head of the page down to the chapter you are
                in, as the header's ribbon hangs over the current page */}
            {current >= 0 && (
              <span
                className={styles.ribbon}
                style={{ '--chapter': current } as CSSProperties}
                aria-hidden="true"
              />
            )}
            <ol className={styles.toc}>
              {chapters.map(({ to, label }, i) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className={styles.chapter}>
                    <span className={styles.numeral} aria-hidden="true">{toRoman(i + 1)}</span>
                    <span className={styles.chapterTitle}>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            <address className={styles.block}>
              <span className={styles.lead}>
                {t('brand.city')}, {t('brand.address')}
              </span>
              <span className={styles.note}>{t('brand.addressNote')}</span>
              <span className={styles.note}>
                {t('status.daily')}, {formatHour(opensAt)} {t('common.timeRange')} {formatHour(closesAt)}
              </span>
              <a
                href={cafe.route}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={external(t('footer.route'))}
              >
                {t('footer.route')}
                <ExternalArrow />
              </a>
            </address>
            <div className={styles.maker}>
              <Credit />
            </div>
          </div>

          <div className={styles.block}>
            <a href={cafe.phoneHref} className={`${styles.lead} ${styles.phone}`}>
              {cafe.phone}
            </a>
            <div className={styles.socials}>
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={external(label)}
                >
                  {label}
                  <ExternalArrow />
                </a>
              ))}
            </div>

            {/* The imprint, in small type under the numbers */}
            <div className={styles.imprint}>
              <p>{t('footer.entrepreneur')}</p>
              <p className={styles.legal}>
                <span>{t('footer.inn')} {cafe.legal.inn}</span>
                <span>{t('footer.ogrnip')} {cafe.legal.ogrnip}</span>
              </p>
              <p className={styles.copyright}>&copy; {currentYear} Biblioteka</p>
            </div>
          </div>
        </div>

        {/* Once per page: the footer stays mounted across routes */}
        <TitleLine key={pathname} />
      </div>
    </footer>
  );
}
