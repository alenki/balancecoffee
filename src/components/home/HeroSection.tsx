import { motion } from 'motion/react';
import { CitySelection } from './CitySelection';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Full-bleed background image with overlay */}
      <div className={styles.background}>
        <div className={styles.imageContainer}>
          {/* Using a placeholder gradient that mimics a coffee shop interior */}
          <div className={styles.imagePlaceholder} />
          <div className={styles.imageOverlay} />
          <div className={styles.imageGrain} />
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className={styles.decorations} aria-hidden="true">
        <motion.div
          className={styles.floatingLine1}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className={styles.floatingLine2}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className={styles.cornerAccent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Logo/Brand centered */}
        <motion.div
          className={styles.brandContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.brandWrapper}>
            <motion.span
              className={styles.brandMain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              balance
            </motion.span>
            <motion.span
              className={styles.brandSub}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              COFFEE
            </motion.span>
          </div>

          {/* Decorative line under brand */}
          <motion.div
            className={styles.brandLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Tagline */}
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Кофе, который создаёт баланс
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.div
            className={styles.scrollIcon}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* City Selection Section */}
      <CitySelection />
    </section>
  );
}
