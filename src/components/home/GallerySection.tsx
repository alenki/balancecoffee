import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './GallerySection.module.css';

const galleryImages = [
  {
    src: '/cafe photos/image_13.png',
    alt: 'Архитектурное окно с видом на террасу',
  },
  {
    src: '/cafe photos/image_3.png',
    alt: 'Гости обсуждают проекты за кофе',
  },
  {
    src: '/cafe photos/image_10.png',
    alt: 'Бариста готовит фильтр-кофе',
  },
  {
    src: '/cafe photos/image_9.png',
    alt: 'Уютные кабинки для работы',
  },
];

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Атмосфера</span>
          <h2 className={styles.title}>Пространство для вашей души</h2>
        </motion.header>

        <div className={styles.grid}>
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              className={styles.item}
              initial={{ opacity: 0, y: 32 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1 + index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className={styles.imageFrame}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
