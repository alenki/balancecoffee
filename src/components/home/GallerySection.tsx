import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './GallerySection.module.css';

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Left: Large Image */}
      <div className={styles.imagePanel}>
        <motion.div className={styles.imageWrapper} style={{ y: imageY }}>
          <img
            src="/cafe photos/image_16.png"
            alt="Balance Coffee"
            className={styles.image}
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Right: Editorial Content */}
      <div className={styles.contentPanel} ref={ref}>
        <div className={styles.content}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Журнал
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Daily
          </motion.h2>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Вдохновение, моменты и атмосфера,
            которые делают каждый день особенным.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/daily" className={styles.ctaLink}>
              Читать
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Bottom image strip */}
        <motion.div
          className={styles.imageStrip}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.stripImage}>
            <img src="/cafe photos/image_10.png" alt="" loading="lazy" />
          </div>
          <div className={styles.stripImage}>
            <img src="/cafe photos/image_3.png" alt="" loading="lazy" />
          </div>
          <div className={styles.stripImage}>
            <img src="/cafe photos/image_9.png" alt="" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
