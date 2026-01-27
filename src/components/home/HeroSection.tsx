import { motion } from 'motion/react';
import { CitySelection } from './CitySelection';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Full-bleed background image */}
      <div className={styles.background}>
        <img
          src="/cafe photos/image.png"
          alt=""
          className={styles.heroImage}
        />
        <div className={styles.overlay} />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Logo centered */}
        <motion.div
          className={styles.logoContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/logos/balance_3.png"
            alt="Balance Coffee"
            className={styles.heroLogo}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Кофе, который создаёт баланс
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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

      {/* City Selection */}
      <CitySelection />
    </section>
  );
}
