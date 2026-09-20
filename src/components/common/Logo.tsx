import { Link } from 'react-router-dom';
import { useLenisInstance } from '../../hooks/useLenis';
import { useLanguage } from '../../context/LanguageContext';
import { Image } from './Image';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
  /** Drops the wordmark and shows the monogram alone. */
  markOnly?: boolean;
}

/**
 * The brand lockup: their B/R monogram beside the wordmark.
 *
 * The monogram is their own published mark, carried as an image. The wordmark
 * is live text rather than the rest of their logo file, because the file sets
 * it in black and the footer needs it in bone. Live text also means the
 * Arabic and English lockups can each use their own face instead of scaling
 * one bitmap of both.
 */
export function Logo({ variant = 'default', size = 'md', markOnly = false }: LogoProps) {
  const lenis = useLenisInstance();
  const { lang } = useLanguage();

  const handleClick = () => {
    lenis?.scrollTo(0, { duration: 1.2 });
  };

  return (
    <Link
      to="/"
      onClick={handleClick}
      className={`${styles.logo} ${styles[variant]} ${styles[size]}`}
      aria-label="Bloom Roastery"
    >
      <span className={styles.mark} aria-hidden="true">
        <Image name="logos/bloom-mark" alt="" fit="bare" sizes="72px" />
      </span>
      {!markOnly && (
        <span className={styles.wordmark} aria-hidden="true">
          {lang === 'ar' ? (
            // Kashida, the way their logo file draws it. Decorative only:
            // the span is aria-hidden and the link carries the real name.
            <span className={styles.wordArabic}>بلـــــوم روســـتري</span>
          ) : (
            <span className={styles.wordLatin}>Bloom Roastery</span>
          )}
        </span>
      )}
    </Link>
  );
}
