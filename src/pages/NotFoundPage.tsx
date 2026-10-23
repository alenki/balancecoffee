import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './NotFoundPage.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

/** A catalogue card for a page the catalogue does not have. */
export function NotFoundPage() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <main className={styles.page} id="main">
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 24, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.9, ease }}
          >
            <div className={styles.cardHead}>
              <h1 className={styles.code}>404</h1>
              <span className={styles.cardLibrary}>Biblioteka</span>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>{t('notFound.title')}</p>
              <p className={styles.cardPath}>{pathname}</p>
            </div>
            <span className={styles.hole} aria-hidden="true" />
          </motion.div>

          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          >
            {t('notFound.eyebrow')}
          </motion.p>

          <motion.p
            className={styles.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            {t('notFound.text')}
          </motion.p>

          <motion.nav
            className={styles.links}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease }}
            aria-label={t('notFound.eyebrow')}
          >
            <Link to="/" className={styles.primaryLink}>
              {t('notFound.home')}
            </Link>
            <Link to="/menu" className={styles.secondaryLink}>
              {t('nav.menu')}
            </Link>
            <Link to="/reading-room" className={styles.secondaryLink}>
              {t('nav.readingRoom')}
            </Link>
          </motion.nav>
        </div>
      </section>
    </main>
  );
}
