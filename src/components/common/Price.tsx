import { useLanguage } from '../../context/LanguageContext';
import styles from './Price.module.css';

interface PriceProps {
  /** Saudi riyals. */
  value: number;
  className?: string;
}

/**
 * A price in riyals.
 *
 * Two decisions here are load bearing.
 *
 * Digits are Western on both languages. That is what Saudi sites actually do:
 * a scan of the Arabic editions of the largest Saudi retailers turns up no
 * Arabic-Indic digits in their prices at all.
 *
 * The currency is the word, not the new riyal glyph. U+20C1 shipped in
 * Unicode 17.0, but Google's `latin-ext` subset range stops at U+20C0, one
 * codepoint short, so the character renders as .notdef in every Google
 * webfont this site loads. CLDR also still carries it as an alternate while
 * "SAR" and "ر.س" remain the primary symbols.
 *
 * `Intl.NumberFormat` is deliberately not used: the `ar-SA` locale defaults
 * to Arabic-Indic digits while plain `ar` does not, and its currency form
 * wraps the output in invisible right-to-left marks that fight the layout.
 */
export function Price({ value, className }: PriceProps) {
  const { t } = useLanguage();

  return (
    <span className={[styles.price, className].filter(Boolean).join(' ')}>
      <span className={styles.value}>{value}</span>
      <span className={styles.currency}>{t('common.currency')}</span>
    </span>
  );
}
