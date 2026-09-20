import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { Image } from '../common/Image';
import { HERO_SIZES } from '../common/imageSizes';
import styles from './HeroSection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { t, sign } = useLanguage();

  return (
    <section className={styles.hero}>
      <div className={styles.heroCard}>
        <div className={styles.heroBackground}>
          {/* The LCP element. index.html preloads it via the heroPreload
              plugin, because #root stays empty until the bundle has parsed. */}
          <Image
            name="brand/cover"
            alt=""
            className={styles.heroImage}
            frameClassName={styles.heroFrame}
            sizes={HERO_SIZES}
            priority
          />
          <div className={styles.heroScrim} />
          <div className={styles.grain} aria-hidden="true" />
        </div>

        {/* `sign` flips the offset in Arabic: translateX does not mirror on
            its own when the document direction changes. */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, x: -12 * sign }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
        >
          <span className={styles.eyebrowText}>{t('hero.eyebrow')}</span>
        </motion.div>

        <h1 className={styles.headline}>
          <span className={styles.lineReveal}>
            <motion.span
              className={styles.headlineMain}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            >
              {t('hero.line1')}
            </motion.span>
          </span>{' '}
          <span className={styles.lineReveal}>
            <motion.span
              className={styles.headlineMain}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.57, ease: EASE }}
            >
              {t('hero.line2')}
            </motion.span>
          </span>{' '}
          {/* The closing line: same face as the rest, chartreuse alone. */}
          <span className={styles.lineReveal}>
            <motion.span
              className={styles.headlineAccent}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.69, ease: EASE }}
            >
              {t('hero.line3')}
            </motion.span>
          </span>
        </h1>

        <motion.div
          className={styles.corner}
          aria-hidden="true"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
        >
          <span className={styles.cornerText}>Madinah</span>
        </motion.div>
      </div>
    </section>
  );
}
