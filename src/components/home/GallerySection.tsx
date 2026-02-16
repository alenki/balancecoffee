import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useLanguage } from '../../context/LanguageContext';
import styles from './GallerySection.module.css';

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax for container depth
  const y1 = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const y2 = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const y4 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Image-level parallax (image shifts inside its cropped container)
  const imgY1 = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const imgY2 = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const imgY3 = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const imgY4 = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imgY5 = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

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

        {/* Editorial Grid Layout */}
        <div className={styles.editorialGrid}>
          {/* Mobile Daily Mosaic — replaces side columns on small screens */}
          <motion.div
            className={styles.dailyMosaic}
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.mosaicGrid}>
              <div className={`${styles.mosaicCell} ${styles.mosaicA}`}>
                <img src="/cafe photos/image_8.webp" alt="" className={styles.mosaicImg} loading="lazy" decoding="async" />
              </div>
              <div className={`${styles.mosaicCell} ${styles.mosaicB}`}>
                <img src="/cafe photos/image_9.webp" alt="" className={styles.mosaicImg} loading="lazy" decoding="async" />
              </div>
              <div className={`${styles.mosaicCell} ${styles.mosaicC}`}>
                <img src="/cafe photos/image_10.webp" alt="" className={styles.mosaicImg} loading="lazy" decoding="async" />
              </div>
            </div>
          </motion.div>

          {/* Left Column */}
          <div className={styles.columnLeft}>
            <motion.div
              className={styles.imgLeftTop}
              style={{ y: y1 }}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/cafe photos/image_3.webp"
                alt="Balance Coffee atmosphere"
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
                style={{ y: imgY1 }}
              />
            </motion.div>

            <motion.div
              className={styles.imgLeftBottom}
              style={{ y: y2 }}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/cafe photos/image_6.webp"
                alt="Balance Coffee counter"
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
                style={{ y: imgY2 }}
              />
            </motion.div>
          </div>

          {/* Center Column */}
          <div className={styles.columnCenter}>
            <motion.div
              className={styles.imgCenter}
              style={{ y: y3 }}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/cafe photos/image_4.webp"
                alt="Balance Coffee interior"
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
                style={{ y: imgY3 }}
              />
            </motion.div>

            <div className={styles.textContent}>
              <motion.h2
                className={styles.manifestoTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.manifestoLine}>{t('gallery.manifesto1')}</span>
                <span className={styles.manifestoLineAccent}>{t('gallery.manifesto2')}</span>
                <span className={styles.manifestoLine}>{t('gallery.manifesto3')}</span>
              </motion.h2>

              <motion.p
                className={styles.manifestoText}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {t('gallery.text').split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br/>}</span>
                ))}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/daily" className={styles.manifestoCta}>
                  Lifestyle
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.columnRight}>
            <motion.div
              className={styles.imgRightTop}
              style={{ y: y4 }}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/cafe photos/image_7.webp"
                alt="Balance Coffee exterior"
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
                style={{ y: imgY4 }}
              />
            </motion.div>

            <motion.div
              className={styles.imgRightBottom}
              style={{ y: y1 }}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/cafe photos/image_5.webp"
                alt="Balance Coffee community"
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
                style={{ y: imgY5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
