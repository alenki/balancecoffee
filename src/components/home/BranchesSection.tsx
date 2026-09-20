import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReveal } from '../../hooks/useReveal';
import { useLanguage } from '../../context/LanguageContext';
import { branches } from '../../data/branches';
import { contactInfo } from '../../data/contact';
import { pick } from '../../types';
import styles from './BranchesSection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function BranchesSection() {
  // No `sign` here: this band carries no horizontal Motion offset, and an
  // unused binding fails the build under `noUnusedLocals`.
  const { lang, t } = useLanguage();
  const { ref, revealed: inView } = useReveal<HTMLElement>({ margin: -60 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.masthead}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            {t('branches.label')}
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {t('branches.title1')}
            <br />
            <span className={styles.titleAccent}>{t('branches.title2')}</span>
          </motion.h2>
        </div>

        <div className={styles.list}>
          {branches.map((branch, index) => (
            <motion.a
              key={branch.id}
              href={branch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.row} ${branch.isComingSoon ? styles.rowSoon : ''}`}
              // Without this the link's name is the whole row read end to end,
              // index and street and rating included.
              aria-label={[
                pick(branch.name, lang),
                branch.isComingSoon ? t('branches.comingSoon') : null,
                t('branches.viewMap'),
              ]
                .filter(Boolean)
                .join(', ')}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: EASE }}
            >
              <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>

              <span className={styles.rowMain}>
                <span className={styles.rowHead}>
                  <span className={styles.rowName}>{pick(branch.name, lang)}</span>

                  {branch.isComingSoon ? (
                    <span className={styles.soonBadge}>{t('branches.comingSoon')}</span>
                  ) : (
                    <span className={styles.rowMeta}>
                      {branch.rating != null && (
                        <span className={styles.rating}>
                          <bdi>{branch.rating.toFixed(1)}</bdi>
                        </span>
                      )}
                      <span className={styles.rowCity}>{pick(branch.city, lang)}</span>
                    </span>
                  )}
                </span>

                <span className={styles.rowStreet}>
                  {pick(branch.street, lang)}
                  {branch.district ? `, ${pick(branch.district, lang)}` : ''}
                </span>
              </span>

              <span className={styles.rowGo}>
                <svg
                  className={styles.rowGoIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
        >
          <span className={styles.hours}>
            <bdi>
              {contactInfo.hours.start} {t('common.timeRange')} {contactInfo.hours.end}
            </bdi>{' '}
            {t('branches.daily')}
          </span>

          <Link to="/branches" className={styles.cta}>
            {t('branches.label')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
