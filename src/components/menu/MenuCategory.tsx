import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useLanguage } from '../../context/LanguageContext';
import { pick, type MenuCategory as MenuCategoryType } from '../../types';
import { MenuGrid, MenuCard } from './MenuCard';
import styles from './MenuCategory.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuCategory({ category }: { category: MenuCategoryType }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const { lang } = useLanguage();

  return (
    <section id={`category-${category.id}`} className={styles.section} ref={ref}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 16 }}
        animate={isVisible ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={styles.headerText}>
          <h2 className={styles.title}>{pick(category.name, lang)}</h2>
          {category.description && (
            <p className={styles.description}>{pick(category.description, lang)}</p>
          )}
        </div>
        <span className={styles.count}>
          <bdi>{category.items.length}</bdi>
        </span>
      </motion.header>

      <MenuGrid>
        {category.items.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} isVisible={isVisible} />
        ))}
      </MenuGrid>
    </section>
  );
}
