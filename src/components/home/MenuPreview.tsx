import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import { useLanguage } from '../../context/LanguageContext';
import { signatureItems } from '../../data/menu';
import { MenuGrid, MenuCard } from '../menu/MenuCard';
import styles from './MenuPreview.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Six fills whole rows at every breakpoint: three rows 2 up, two rows 3 up. */
const PREVIEW_COUNT = 6;

export function MenuPreview() {
  const { ref, revealed } = useReveal<HTMLElement>({ amount: 0.15 });
  const { t, sign } = useLanguage();
  const items = signatureItems.slice(0, PREVIEW_COUNT);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -14 * sign }}
            animate={revealed ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            {t('menu.label')}
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {t('menu.headerLead')}{' '}
            <br />
            <span className={styles.titleAccent}>{t('menu.headerAccent')}</span>
          </motion.h2>

          <motion.span
            className={styles.count}
            initial={{ opacity: 0, x: 14 * sign }}
            animate={revealed ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            {t('menu.count')}
          </motion.span>
        </div>

        <MenuGrid>
          {items.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} isVisible={revealed} />
          ))}
        </MenuGrid>

        <motion.div
          className={styles.action}
          initial={{ opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          <Link to="/menu" className={styles.cta}>
            {t('menu.cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
