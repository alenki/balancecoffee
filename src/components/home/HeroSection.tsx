import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './HeroSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className={styles.hero}>
      <div className={styles.videoCard}>
        {/* ── Video Background ── */}
        <div className={styles.videoBackground}>
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            poster="/cafe photos/image.webp"
          >
            <source src="/cafe photos/video.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />
          <div className={styles.grain} aria-hidden="true" />
        </div>

        {/* ── Corner: Top Left ── */}
        <motion.div
          className={styles.cornerTopLeft}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease }}
        >
          <span className={styles.cornerLabel}>Specialty Coffee</span>
        </motion.div>

        {/* ── Bottom Left: Massive Editorial Headline ── */}
        <div className={styles.headlineBlock}>
          {/* Line 1 */}
          <div className={styles.lineReveal}>
            <motion.span
              className={styles.headlineBold}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
            >
              {t('hero.line1')}
            </motion.span>
          </div>
          {/* Line 2 */}
          <div className={styles.lineReveal}>
            <motion.span
              className={styles.headlineBold}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.62, ease }}
            >
              {t('hero.line2')}
            </motion.span>
          </div>
          {/* Line 3 — Playfair italic for contrast */}
          <div className={styles.lineReveal}>
            <motion.span
              className={styles.headlineSerif}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.74, ease }}
            >
              {t('hero.line3')}
            </motion.span>
          </div>
        </div>

        {/* ── Bottom Right: Brand Logo ── */}
        <motion.div
          className={styles.bottomRightLogo}
          aria-hidden="true"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease }}
        >
          <span className={styles.brandName}>harmony</span>
          <span className={styles.brandSub}>Coffee</span>
        </motion.div>

      </div>
    </section>
  );
}
