import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { contactInfo, origins } from '../data/contact';
import { pick } from '../types';
import { Image } from '../components/common/Image';
import { ROASTERY_SIZES } from '../components/common/imageSizes';
import styles from './RoasteryPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Their own brewing photography, standing in for the four lots. */
const ORIGIN_IMAGES = [
  'menu/hot/v60',
  'menu/hot/coffee-of-the-day',
  'menu/cold/cold-brew',
  'menu/hot/bloom-pot',
] as const;

export function RoasteryPage() {
  const { lang, t, sign } = useLanguage();

  return (
    <main className={styles.page} id="main">
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, x: -14 * sign }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            {t('roastery.label')}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {t('roastery.title1')}{' '}
            <span className={styles.titleAccent}>{t('roastery.title2')}</span>
          </motion.h1>

          <motion.p
            className={styles.lead}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          >
            {t('roastery.body')}
          </motion.p>
        </div>
      </section>

      {/* Story band */}
      <section className={styles.story}>
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.storyInner}>
            <motion.p
              className={styles.storyLead}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {t('story.lead')}
            </motion.p>
            <motion.p
              className={styles.storyBody}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              {t('story.body1')}
            </motion.p>
            <motion.p
              className={styles.storyBody}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
            >
              {t('story.body2')}
            </motion.p>

            <motion.div
              className={styles.machine}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            >
              <span className={styles.machineDiamond} aria-hidden="true" />
              <span className={styles.machineName}>{t('roastery.machine')}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Origins */}
      <section className={styles.origins}>
        <div className={styles.container}>
          <motion.div
            className={styles.originsHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className={styles.originsTitle}>{t('roastery.originsLabel')}</h2>
            <p className={styles.originsNote}>{t('roastery.originsNote')}</p>
          </motion.div>

          <div className={styles.originsGrid}>
            {origins.map((origin, index) => (
              <motion.article
                key={origin.id}
                className={styles.originCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
              >
                <div className={styles.originFrame}>
                  <Image
                    name={ORIGIN_IMAGES[index % ORIGIN_IMAGES.length]}
                    alt=""
                    className={styles.originImage}
                    sizes={ROASTERY_SIZES}
                  />
                  <span className={styles.originIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={styles.originCountry}>{pick(origin.country, lang)}</h3>
                <p className={styles.originLot}>{pick(origin.lot, lang)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className={styles.shop}>
        <div className={styles.container}>
          <motion.div
            className={styles.shopInner}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className={styles.shopLead}>{t('roastery.shopLead')}</p>
            <a
              href={contactInfo.shop}
              className={styles.shopCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('roastery.shopCta')}
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
