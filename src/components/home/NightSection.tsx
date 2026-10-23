import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { Image } from '../common/Image';
import { Emblem } from '../common/Emblem';
import {
  NIGHT_CENTER_SIZES,
  NIGHT_MOSAIC_SIZES,
  NIGHT_SIDE_SIZES,
} from '../common/imageSizes';
import styles from './NightSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * "Without a book the world is night": the logo's own motto, set on the
 * cloth, with the room's photographs held in it like plates in a book.
 */
export function NightSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-120px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Columns drift at different rates, so the plates read as layered
  const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const yRight = useTransform(scrollYProgress, [0, 1], [70, -50]);

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : {},
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="night-title">
      <span className={styles.cloth} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.p className={styles.eyebrow} {...fade(0)}>
          <Emblem className={styles.eyebrowMark} />
          {t('night.eyebrow')}
        </motion.p>

        {/* Phones: three plates in a mosaic replace the side columns */}
        <motion.div className={styles.mosaic} {...fade(0.1)}>
          <div className={`${styles.cell} ${styles.cellTall}`}>
            <Image name="hall/evening-cup" alt={t('night.altEvening')} className={styles.img} sizes={NIGHT_MOSAIC_SIZES} />
          </div>
          <div className={styles.cell}>
            <Image name="hall/reader-sofa" alt={t('night.altSofa')} className={styles.img} sizes={NIGHT_MOSAIC_SIZES} />
          </div>
          <div className={styles.cell}>
            <Image name="hall/bookshelf" alt={t('night.altShelf')} className={styles.img} sizes={NIGHT_MOSAIC_SIZES} />
          </div>
        </motion.div>

        <div className={styles.grid}>
          <motion.div className={styles.columnSide} style={{ y: yLeft }}>
            <motion.div className={`${styles.frame} ${styles.frameTall}`} {...fade(0.15)}>
              <Image name="hall/bookshelf" alt={t('night.altShelf')} className={styles.img} sizes={NIGHT_SIDE_SIZES} />
            </motion.div>
            <motion.div className={styles.frame} {...fade(0.3)}>
              <Image name="hall/reader-sofa" alt={t('night.altSofa')} className={styles.img} sizes={NIGHT_SIDE_SIZES} />
            </motion.div>
          </motion.div>

          <motion.div className={styles.columnCenter} style={{ y: yCenter }}>
            <motion.div className={`${styles.frame} ${styles.frameCenter}`} {...fade(0.05)}>
              <Image name="hall/evening-cup" alt={t('night.altEvening')} className={styles.img} sizes={NIGHT_CENTER_SIZES} />
            </motion.div>
            <div className={styles.text}>
              <motion.h2
                id="night-title"
                className={styles.motto}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease }}
              >
                <span className={styles.mottoLine}>{t('night.line1')}</span>
                <span className={styles.mottoLineItalic}>{t('night.line2')}</span>
              </motion.h2>

              <motion.p
                className={styles.body}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.45, ease }}
              >
                {t('night.text')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55, ease }}
              >
                <Link to="/reading-room" className={styles.cta}>
                  {t('night.cta')}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className={`${styles.columnSide} ${styles.columnRight}`} style={{ y: yRight }}>
            <motion.div className={styles.frame} {...fade(0.25)}>
              <Image name="hall/choosing-book" alt={t('night.altChoosing')} className={styles.img} sizes={NIGHT_SIDE_SIZES} />
            </motion.div>
            <motion.div className={`${styles.frame} ${styles.frameTall}`} {...fade(0.4)}>
              <Image name="hall/window-bench" alt={t('night.altWindow')} className={styles.img} sizes={NIGHT_SIDE_SIZES} />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
