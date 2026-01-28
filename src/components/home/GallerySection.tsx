import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './GallerySection.module.css';

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effects for images
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.card} ref={ref}>
        {/* Header Label */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.headerLabel}>Daily Journal</span>
        </motion.div>

        {/* Image Grid - Top Area */}
        <div className={styles.imageGrid}>
          <motion.div
            className={styles.gridImage1}
            style={{ y: y1 }}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/cafe photos/image_3.png"
              alt="Balance Coffee atmosphere"
              className={styles.gridImage}
            />
          </motion.div>

          <motion.div
            className={styles.gridImage2}
            style={{ y: y2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/cafe photos/image_4.png"
              alt="Balance Coffee interior"
              className={styles.gridImage}
            />
          </motion.div>

          <motion.div
            className={styles.gridImage3}
            style={{ y: y3 }}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/cafe photos/image_5.png"
              alt="Balance Coffee community"
              className={styles.gridImage}
            />
          </motion.div>
        </div>

        {/* Manifesto Content - Center */}
        <div className={styles.manifestoContent}>
          <motion.h2
            className={styles.manifestoTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.manifestoLine}>Мы за</span>
            <span className={styles.manifestoLineAccent}>уникальную</span>
            <span className={styles.manifestoLine}>эстетику</span>
          </motion.h2>

          <motion.p
            className={styles.manifestoText}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Мы за красивое и хорошее, творить и делиться.<br/>
            Мы за уникальную эстетику.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/daily" className={styles.manifestoCta}>
              Lifestyle
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
