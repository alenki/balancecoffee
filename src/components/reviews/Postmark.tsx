import { useEffect, useId, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Postmark.module.css';

const two = (n: number) => String(n).padStart(2, '0');

function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

/**
 * The round postmark a sent letter gets, dated the day it was written.
 *
 * Sending opens WhatsApp, which usually takes the guest away from the page,
 * so the mark waits until the page is in front of them again and lands
 * while they are looking rather than in a hidden tab.
 */
export function Postmark({ date }: { date: Date }) {
  const { lang, t } = useLanguage();
  const id = useId().replace(/[^\w-]/g, '');
  const visible = usePageVisible();
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (landed || !visible) return;
    // Long enough for the letter to close up first, and for WhatsApp to
    // have taken the tab away if it is going to.
    const timer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') setLanded(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [visible, landed]);

  const day = `${two(date.getDate())}.${two(date.getMonth() + 1)}.${two(date.getFullYear() % 100)}`;

  return (
    <motion.svg
      className={styles.postmark}
      viewBox="0 0 120 120"
      initial={{ opacity: 0, scale: 1.7, rotate: -28 }}
      animate={landed ? { opacity: 0.92, scale: 1, rotate: -12 } : undefined}
      transition={{ duration: 0.34, ease: [0.3, 0.6, 0.35, 1.25] }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Baselines inside the band between the rings: the top line reads
            over the crown, the bottom one reads upright along the foot. */}
        <path id={`${id}-top`} d="M16.75 60A43.25 43.25 0 0 1 103.25 60" />
        <path id={`${id}-foot`} d="M9.25 60A50.75 50.75 0 0 0 110.75 60" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text className={styles.ring} fill="currentColor">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          BIBLIOTEKA
        </textPath>
      </text>
      <text className={styles.ring} fill="currentColor">
        <textPath href={`#${id}-foot`} startOffset="50%" textAnchor="middle">
          {t('brand.city').toLocaleUpperCase(lang)}
        </textPath>
      </text>
      <circle cx="13" cy="60" r="1.8" fill="currentColor" />
      <circle cx="107" cy="60" r="1.8" fill="currentColor" />
      <path d="M23.3 50H96.7M23.3 70H96.7" stroke="currentColor" strokeWidth="1.2" />
      <text className={styles.date} x="60" y="65" textAnchor="middle" fill="currentColor">
        {day}
      </text>
    </motion.svg>
  );
}
