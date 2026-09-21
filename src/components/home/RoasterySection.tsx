import { motion } from 'motion/react';
import { useReveal } from '../../hooks/useReveal';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo, origins } from '../../data/contact';
import { pick } from '../../types';
import { Image } from '../common/Image';
import { ROASTERY_PLATE_SIZES } from '../common/imageSizes';
import styles from './RoasterySection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function RoasterySection() {
  const { lang, t, sign } = useLanguage();
  const { ref, revealed: inView } = useReveal<HTMLElement>({ margin: -80 });

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
              {t('roastery.title1')}
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
                <a
                  href={contactInfo.shop}
                  className={styles.ctaPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('roastery.shopCta')}
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className={styles.plate}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          >
            <Image
              name="menu/hot/v60"
              alt=""
              className={styles.plateImage}
              sizes={ROASTERY_PLATE_SIZES}
            />
          </motion.div>
        </div>

        {/* The lots close the band across its full width, so they read as a
            ledger under a spread and not as a second numbered list stacked
            above the one in the branches section below. */}
        <motion.div
          className={styles.lotsBand}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
        >
          <div className={styles.lotsHead}>
            <span className={styles.lotsLabel}>{t('roastery.originsLabel')}</span>
            <p className={styles.lotsNote}>{t('roastery.originsNote')}</p>
          </div>

          <ul className={styles.lots}>
            {origins.map((origin, index) => (
              <li key={origin.id} className={styles.lot}>
                <span className={styles.lotIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.lotCountry}>{pick(origin.country, lang)}</span>
                <span className={styles.lotName}>{pick(origin.lot, lang)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
