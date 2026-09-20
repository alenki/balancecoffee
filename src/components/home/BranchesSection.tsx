import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { branches } from '../../data/branches';
import { contactInfo } from '../../data/contact';
import { pick } from '../../types';
import styles from './BranchesSection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function BranchesSection() {
  const { lang, t, sign } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -14 * sign }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
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
            {t('branches.title1')}{' '}
            <span className={styles.titleAccent}>{t('branches.title2')}</span>
          </motion.h2>

          <motion.span
            className={styles.hours}
            initial={{ opacity: 0, x: 14 * sign }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <bdi>
              {contactInfo.hours.start} {t('common.timeRange')} {contactInfo.hours.end}
            </bdi>{' '}
            {t('branches.daily')}
          </motion.span>
        </div>

        <div className={styles.list}>
          {branches.map((branch, index) => (
            <motion.a
              key={branch.id}
              href={branch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.row} ${branch.isComingSoon ? styles.rowSoon : ''}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: EASE }}
            >
              <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>

              <span className={styles.rowMain}>
                <span className={styles.rowName}>{pick(branch.name, lang)}</span>
                <span className={styles.rowStreet}>
                  {pick(branch.street, lang)}
                  {branch.district ? `, ${pick(branch.district, lang)}` : ''}
                </span>
              </span>

              <span className={styles.rowMeta}>
                {branch.isComingSoon ? (
                  <span className={styles.soonBadge}>{t('branches.comingSoon')}</span>
                ) : (
                  <>
                    {branch.rating != null && (
                      <span className={styles.rating}>
                        <span className={styles.ratingDiamond} aria-hidden="true" />
                        <bdi>{branch.rating.toFixed(1)}</bdi>
                      </span>
                    )}
                    <span className={styles.rowCity}>{pick(branch.city, lang)}</span>
                  </>
                )}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className={styles.action}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
        >
          <Link to="/branches" className={styles.cta}>
            {t('branches.label')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
