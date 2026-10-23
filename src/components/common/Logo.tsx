import { Link } from 'react-router-dom';
import { useLenisInstance } from '../../hooks/useLenis';
import { useLanguage } from '../../context/LanguageContext';
import { WORDMARK, WORDMARK_VIEWBOX } from './brandMarks';
import styles from './Logo.module.css';

/** BIBΛIOTEKA in the logo's own capitals. Takes `currentColor`. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={[styles.wordmark, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <path d={WORDMARK} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
}

/** The wordmark as the home link. */
export function Logo({ className }: LogoProps) {
  const lenis = useLenisInstance();
  const { t } = useLanguage();

  return (
    <Link
      to="/"
      onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}
      className={[styles.logo, className].filter(Boolean).join(' ')}
      aria-label={t('nav.homeAria')}
    >
      <Wordmark />
    </Link>
  );
}
