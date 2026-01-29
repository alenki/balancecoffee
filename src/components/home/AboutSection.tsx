import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef } from 'react';
import { cities } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AboutSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  const manifestoInView = useInView(manifestoRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const manifestoParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  const totalLocations = cities.reduce((sum, c) => sum + c.locations.length, 0);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* ══════════════════════════════════════════
          PART 1 — THE MANIFESTO (Dark)
          ══════════════════════════════════════════ */}
      <div className={styles.manifesto} ref={manifestoRef}>
        {/* Grain overlay */}
        <div className={styles.grain} aria-hidden="true" />

        {/* Corner accents matching hero style */}
        <motion.span
          className={`${styles.cornerAccent} ${styles.cornerTL}`}
          initial={{ opacity: 0 }}
          animate={manifestoInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease }}
        >
          {t('about.label')}
        </motion.span>
        <motion.span
          className={`${styles.cornerAccent} ${styles.cornerTR}`}
          initial={{ opacity: 0 }}
          animate={manifestoInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7, ease }}
        >
          Est. 2019
        </motion.span>

        <motion.div
          className={styles.manifestoInner}
          style={{ y: manifestoParallax }}
        >
          {/* Manifesto text — each line staggered */}
          <div className={styles.manifestoText}>
            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0, ease }}
            >
              {t('about.manifesto1')}{' '}
              <em className={styles.manifestoEmphasis}>{t('about.manifesto1em')}</em>{' '}
              {t('about.manifesto1end')}
            </motion.p>

            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease }}
            >
              {t('about.manifesto2')}{' '}
              <em className={styles.manifestoEmphasis}>{t('about.manifesto2em')}</em>
            </motion.p>
          </div>

          {/* Stats as inline editorial typography */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 30 }}
            animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            <div className={styles.stat}>
              <span className={styles.statNumber}>{cities.length}</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>{t('about.statCities')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalLocations}</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>{t('about.statCafes')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>{t('about.statItems')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
