import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo, origins } from '../../data/contact';
import { pick } from '../../types';
import { Image } from '../common/Image';
import { ROASTERY_SIZES } from '../common/imageSizes';
import styles from './RoasterySection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function RoasterySection() {
  const { lang, t, sign } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Copy */}
          <div className={styles.copy}>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, x: -14 * sign }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              {t('roastery.label')}
            </motion.span>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              {t('roastery.title1')}{' '}
              <br />
              <span className={styles.titleAccent}>{t('roastery.title2')}</span>
            </motion.h2>

            <motion.p
              className={styles.body}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            >
              {t('roastery.body')}
            </motion.p>

            <motion.div
              className={styles.shop}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            >
              <p className={styles.shopLead}>{t('roastery.shopLead')}</p>
              <div className={styles.shopActions}>
                <Link to="/roastery" className={styles.ctaPrimary}>
                  {t('roastery.label')}
                </Link>
                <a
                  href={contactInfo.shop}
                  className={styles.ctaSecondary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('roastery.shopCta')}
                </a>
              </div>
            </motion.div>
          </div>

          {/* Origins */}
          <motion.div
            className={styles.origins}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          >
            <div className={styles.originsFrame}>
              <Image
                name="menu/hot/v60"
                alt=""
                className={styles.originsImage}
                sizes={ROASTERY_SIZES}
              />
            </div>

            <span className={styles.originsLabel}>{t('roastery.originsLabel')}</span>
            <ul className={styles.originsList}>
              {origins.map((origin, index) => (
                <li key={origin.id} className={styles.origin}>
                  <span className={styles.originIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.originCountry}>{pick(origin.country, lang)}</span>
                  <span className={styles.originLot}>{pick(origin.lot, lang)}</span>
                </li>
              ))}
            </ul>
            <p className={styles.originsNote}>{t('roastery.originsNote')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
