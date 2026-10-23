import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { cafe, formatHour } from '../../data/cafe';
import styles from './ForewordSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The foreword, set on the cover's cloth: two lines about the place, each
 * closing on a phrase in italic, then the three figures a visitor needs
 * (when the door opens, when it closes, the house number).
 */
export function ForewordSection() {
  const { t } = useLanguage();
  const { opensAt, closesAt } = useOpenStatus();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  const reveal = (delay: number, y = 50) => ({
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay, ease },
  });

  const stats = [
    { value: formatHour(opensAt), label: t('foreword.statOpen') },
    { value: formatHour(closesAt), label: t('foreword.statClose') },
    { value: cafe.house, label: t('foreword.statStreet') },
  ];

  return (
    <section className={styles.section} ref={ref} aria-labelledby="foreword-title">
      <span className={styles.cloth} aria-hidden="true" />
      <h2 id="foreword-title" className="sr-only">
        {t('foreword.title')}
      </h2>

      <motion.div className={styles.inner} style={{ y: reduce ? 0 : drift }}>
        <div className={styles.lines}>
          <motion.p className={styles.line} {...reveal(0)}>
            {t('foreword.line1')} <em className={styles.em}>{t('foreword.line1em')}</em>
          </motion.p>
          <motion.p className={styles.line} {...reveal(0.15)}>
            {t('foreword.line2')} <em className={styles.em}>{t('foreword.line2em')}</em>
          </motion.p>
        </div>

        <motion.dl className={styles.stats} {...reveal(0.7, 30)}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
