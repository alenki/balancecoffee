import { motion } from 'motion/react';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.videoCard}>
        {/* Video background */}
        <div className={styles.videoBackground}>
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            poster="/cafe photos/image.png"
          >
            <source src="/cafe photos/video.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />
        </div>

        {/* Corner accents */}
        <motion.div
          className={styles.cornerTopLeft}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.cornerLabel}>Specialty Coffee</span>
        </motion.div>

        <motion.div
          className={styles.cornerTopRight}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.cornerStat}>6 городов</span>
          <span className={styles.cornerDivider} />
          <span className={styles.cornerStat}>16 кофеен</span>
        </motion.div>

        {/* Centered content */}
        <div className={styles.content}>
          <motion.div
            className={styles.brandSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/logos/balance_3.png"
              alt="Balance Coffee"
              className={styles.brandLogo}
            />
          </motion.div>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Кофе, созданный с намерением
          </motion.p>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div
            className={styles.scrollIcon}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
