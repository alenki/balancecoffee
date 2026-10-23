import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { getFeaturedItems } from '../../data/menu';
import { useLanguage } from '../../context/LanguageContext';
import { MenuItem } from '../menu/MenuItem';
import styles from './MenuPreview.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Six cards from the menu, set exactly as the menu page sets them, under a
 * centred title. Each card opens the menu at its own chapter.
 */
export function MenuPreview() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { lang, t } = useLanguage();
  const featured = getFeaturedItems(lang);

  return (
    <section className={styles.section} ref={ref} aria-labelledby="menu-preview-title">
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <p className={styles.lead}>{t('menuPreview.lead')}</p>
        <h2 id="menu-preview-title" className={styles.title}>
          {t('menuPreview.title')}
          <br />
          <span className={styles.titleAccent}>{t('menuPreview.titleAccent')}</span>
        </h2>
      </motion.header>

      <ul className={styles.grid}>
        {featured.map(({ item, chapter }, index) => (
          <MenuItem
            key={item.id}
            item={item}
            index={index}
            isVisible={isVisible}
            to={`/menu?chapter=${chapter}`}
          />
        ))}
      </ul>

      <motion.div
        className={styles.divider}
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      />

      <motion.div
        className={styles.action}
        initial={{ opacity: 0, y: 15 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
      >
        <Link to="/menu" className={styles.cta}>
          {t('menuPreview.cta')}
        </Link>
      </motion.div>
    </section>
  );
}
