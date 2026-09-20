import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { branches } from '../data/branches';
import { contactInfo } from '../data/contact';
import { pick } from '../types';
import styles from './BranchesPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function BranchesPage() {
  const { lang, t, sign } = useLanguage();

  return (
    <main className={styles.page} id="main">
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, x: -14 * sign }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            {t('branches.label')}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {t('branches.title1')}{' '}
            <span className={styles.titleAccent}>{t('branches.title2')}</span>
          </motion.h1>

          <motion.p
            className={styles.hours}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            <bdi>
              {contactInfo.hours.start} {t('common.timeRange')} {contactInfo.hours.end}
            </bdi>{' '}
            {t('branches.daily')}
          </motion.p>
        </div>
      </section>

      <section className={styles.list}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {branches.map((branch, index) => (
              <motion.article
                key={branch.id}
                className={`${styles.card} ${branch.isComingSoon ? styles.cardSoon : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: EASE }}
              >
                <header className={styles.cardHeader}>
                  <span className={styles.cardIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {branch.isComingSoon ? (
                    <span className={styles.soonBadge}>{t('branches.comingSoon')}</span>
                  ) : (
                    branch.rating != null && (
                      <span className={styles.rating}>
                        <span className={styles.ratingDiamond} aria-hidden="true" />
                        <bdi>{branch.rating.toFixed(1)}</bdi>
                        {branch.reviewCount != null && (
                          <span className={styles.reviewCount}>
                            <bdi>{branch.reviewCount.toLocaleString('en-US')}</bdi>{' '}
                            {t('branches.reviews')}
                          </span>
                        )}
                      </span>
                    )
                  )}
                </header>

                <h2 className={styles.cardName}>{pick(branch.name, lang)}</h2>

                <address className={styles.address}>
                  <span>{pick(branch.street, lang)}</span>
                  {branch.district && <span>{pick(branch.district, lang)}</span>}
                  <span className={styles.city}>{pick(branch.city, lang)}</span>
                </address>

                <div className={styles.cardFooter}>
                  {branch.phone && branch.phoneHref && (
                    <a href={branch.phoneHref} className={styles.cardLink}>
                      <bdi>{branch.phone}</bdi>
                    </a>
                  )}
                  <a
                    href={branch.mapUrl}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('branches.viewMap')}
                  </a>
                  {branch.opened && !branch.isComingSoon && (
                    <span className={styles.opened}>
                      {t('branches.openedIn')} <bdi>{branch.opened}</bdi>
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          <motion.p
            className={styles.contactNote}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <a href={contactInfo.phoneHref} className={styles.contactLink}>
              <bdi>{contactInfo.phone}</bdi>
            </a>
          </motion.p>
        </div>
      </section>
    </main>
  );
}
