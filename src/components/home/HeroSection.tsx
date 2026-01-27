import { motion } from 'motion/react';
import { Button } from '../common/Button';
import { contactInfo } from '../../data/locations';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background decorative elements */}
      <div className={styles.bgPattern} aria-hidden="true">
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className={styles.badgeDot} />
            Доставка с {contactInfo.deliveryHours.start} до {contactInfo.deliveryHours.end}
          </motion.div>

          {/* Headline */}
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Кофе, который
            <span className={styles.accent}> создаёт баланс</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className={styles.subheadline}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Уютные кофейни с авторскими напитками, свежей выпечкой
            и атмосферой, где хочется остаться
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <Button href="/menu" size="lg">
              Смотреть меню
            </Button>
            <Button href={contactInfo.telegram} external variant="outline" size="lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 5L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 5L14 21L10 14L3 10L21 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Telegram
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative image/illustration area */}
        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className={styles.imageWrapper}>
            <div className={styles.imagePlaceholder}>
              <svg viewBox="0 0 200 200" className={styles.coffeeCup}>
                {/* Cup body */}
                <path
                  d="M40 80 L45 160 C45 175 65 180 100 180 C135 180 155 175 155 160 L160 80"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Cup top ellipse */}
                <ellipse
                  cx="100"
                  cy="80"
                  rx="60"
                  ry="15"
                  fill="var(--color-bg-warm)"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                />
                {/* Coffee surface */}
                <ellipse
                  cx="100"
                  cy="85"
                  rx="50"
                  ry="10"
                  fill="var(--color-primary-light)"
                />
                {/* Handle */}
                <path
                  d="M160 95 C185 95 185 140 160 140"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Steam */}
                <path
                  d="M75 55 Q70 40 80 30"
                  fill="none"
                  stroke="var(--color-accent-terracotta)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={styles.steam}
                />
                <path
                  d="M100 50 Q95 35 105 20"
                  fill="none"
                  stroke="var(--color-accent-terracotta)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={styles.steam}
                  style={{ animationDelay: '0.3s' }}
                />
                <path
                  d="M125 55 Q120 40 130 30"
                  fill="none"
                  stroke="var(--color-accent-terracotta)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={styles.steam}
                  style={{ animationDelay: '0.6s' }}
                />
              </svg>
            </div>

            {/* Floating elements */}
            <motion.div
              className={`${styles.floatingElement} ${styles.bean1}`}
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 30 50" fill="var(--color-primary)">
                <ellipse cx="15" cy="25" rx="12" ry="22" />
                <path d="M15 5 Q18 25 15 45" stroke="var(--color-bg-cream)" strokeWidth="2" fill="none"/>
              </svg>
            </motion.div>

            <motion.div
              className={`${styles.floatingElement} ${styles.bean2}`}
              animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <svg viewBox="0 0 30 50" fill="var(--color-accent-terracotta)">
                <ellipse cx="15" cy="25" rx="10" ry="18" />
                <path d="M15 8 Q17 25 15 42" stroke="var(--color-bg-cream)" strokeWidth="1.5" fill="none"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className={styles.scrollMouse}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" fill="currentColor" className={styles.scrollDot}/>
          </svg>
        </motion.div>
        <span className={styles.scrollText}>Листайте вниз</span>
      </motion.div>
    </section>
  );
}
