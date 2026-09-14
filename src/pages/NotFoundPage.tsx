import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './NotFoundPage.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.page} id="main">
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {t('notFound.eyebrow')}
          </motion.span>

          <motion.h1
            className={styles.code}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
          >
            404
          </motion.h1>

          <motion.p
            className={styles.italic}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
          >
            {t('notFound.title')}
          </motion.p>

          <motion.p
            className={styles.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28, ease }}
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
            <Link to="/daily" className={styles.secondaryLink}>
              {t('nav.daily')}
            </Link>
          </motion.nav>
        </div>
      </section>
    </main>
  );
}
