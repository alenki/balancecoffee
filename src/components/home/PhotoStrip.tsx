import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './PhotoStrip.module.css';

export function PhotoStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className={styles.strip} ref={ref}>
      <motion.div
        className={styles.imageWrapper}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/cafe photos/image_2.png"
          alt="Balance Coffee interior"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </motion.div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className={styles.accent}>Атмосфера</span>
        <p className={styles.text}>
          Уютное пространство для работы, встреч и отдыха
        </p>
      </motion.div>
    </section>
  );
}
