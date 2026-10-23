import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { cafe, formatHour } from '../../data/cafe';
import { StreetMap } from './StreetMap';
import styles from './VisitSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * How to find the door: the streets around it drawn as a plate, and one
 * line beneath it with the address, the way in, the hours and a route.
 */
export function VisitSection() {
  const { t } = useLanguage();
  const { ramadan } = useOpenStatus();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section className={styles.section} id="visit" ref={ref} aria-labelledby="visit-title">
      <StreetMap show={inView} />

      <div className={styles.caption}>
        <motion.h2 id="visit-title" className={styles.title} {...rise(0.3)}>
          {t('brand.address')}
        </motion.h2>

        <motion.p className={styles.text} {...rise(0.4)}>
          {t('visit.text')}
        </motion.p>

        <motion.div className={styles.hours} {...rise(0.5)}>
          <p className={styles.hoursValue}>
            {t('status.daily')}, {formatHour(cafe.hours.open)} {t('common.timeRange')} {formatHour(cafe.hours.close)}
          </p>
          <p className={`${styles.ramadan} ${ramadan ? styles.ramadanNow : ''}`}>
            {t('visit.ramadanNote')}
          </p>
        </motion.div>

        <motion.div {...rise(0.6)}>
          <a
            href={cafe.route}
            className={styles.route}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('visit.route')}, ${t('common.newTab')}`}
          >
            {t('visit.route')} <Arrow />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
