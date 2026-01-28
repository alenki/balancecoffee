import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contactInfo } from '../../data/locations';
import { useCity } from '../../hooks/useCity';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentCity } = useCity();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.03, 0.08, 0.08, 0.03]);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Decorative background text */}
      <motion.div
        className={styles.backgroundText}
        style={{ y: backgroundY, opacity: textOpacity }}
      >
        <span className={styles.bgTextLine}>BALANCE</span>
        <span className={styles.bgTextLine}>COFFEE</span>
      </motion.div>

      <div className={styles.container} ref={ref}>
        {/* Main content area with asymmetric layout */}
        <div className={styles.mainContent}>
          {/* Left column - floating images */}
          <div className={styles.imageColumn}>
            <motion.div
              className={styles.imageWrapper1}
              style={{ y: floatingY1 }}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={isVisible ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.imageBlob1}>
                <img
                  src="/cafe photos/image_3.png"
                  alt="Гости Balance Coffee"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              className={styles.imageWrapper2}
              style={{ y: floatingY2 }}
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={isVisible ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.imageBlob2}>
                <img
                  src="/cafe photos/image_5.png"
                  alt="Атмосфера Balance Coffee"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>

          {/* Center/Right column - text content */}
          <div className={styles.textColumn}>
            <motion.span
              className={styles.tagline}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              // Не просто кофе
            </motion.span>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Наши<br />
              <span className={styles.titleAccent}>правила,</span><br />
              Наш кофе.
            </motion.h2>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              Мы не гонимся за трендами. Мы обжариваем, перемалываем и завариваем
              для тех, кто ценит настоящий кофе — не модный аксессуар. Зёрна от
              локальных фермеров, обжарка каждую неделю, приготовление с душой.
            </motion.p>

            <motion.div
              className={styles.ctaWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#menu" className={styles.ctaLink}>
                Открыть меню
                <svg className={styles.ctaArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Right floating image */}
          <motion.div
            className={styles.imageWrapper3}
            style={{ y: floatingY1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageBlob3}>
              <img
                src="/cafe photos/image_4.png"
                alt="Интерьер Balance Coffee"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom corner tagline */}
        <motion.div
          className={styles.bottomTagline}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span>Крепко. Честно. Кофе на первом месте.</span>
        </motion.div>

        {/* Stats section - redesigned as floating cards */}
        <div className={styles.statsSection}>
          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 60 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <span className={styles.statNumber}>6</span>
            <span className={styles.statLabel}>городов</span>
            <div className={styles.statDecor}></div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 60 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <span className={styles.statNumber}>{currentCity.locations.length}</span>
            <span className={styles.statLabel}>
              {currentCity.locations.length === 1 ? 'кофейня' :
               currentCity.locations.length < 5 ? 'кофейни' : 'кофеен'} в {currentCity.name}
            </span>
            <div className={styles.statDecor}></div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 60 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>позиций в меню</span>
            <div className={styles.statDecor}></div>
          </motion.div>
        </div>

        {/* Features as minimal pills */}
        <motion.div
          className={styles.featurePills}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.pill}>
            <span className={styles.pillIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z"/>
                <path d="M12 13V21M12 21H8M12 21H16"/>
              </svg>
            </span>
            <span className={styles.pillText}>Свежая обжарка</span>
          </div>

          <div className={styles.pill}>
            <span className={styles.pillIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 6V12L16 14"/>
              </svg>
            </span>
            <span className={styles.pillText}>{contactInfo.deliveryHours.start}—{contactInfo.deliveryHours.end}</span>
          </div>

          <div className={styles.pill}>
            <span className={styles.pillIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </span>
            <span className={styles.pillText}>С любовью</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
