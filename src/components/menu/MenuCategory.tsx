import { motion } from 'motion/react';
import { useReveal } from '../../hooks/useReveal';
import { useLanguage } from '../../context/LanguageContext';
import { pick, type MenuCategory as MenuCategoryType } from '../../types';
import { MenuGrid, MenuCard } from './MenuCard';
import styles from './MenuCategory.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuCategory({ category }: { category: MenuCategoryType }) {
  const { ref, revealed } = useReveal<HTMLElement>({ amount: 0.05 });
  const { lang } = useLanguage();

  return (
    <section id={`category-${category.id}`} className={styles.section} ref={ref}>
      {/* A quiet label at one end and the accent line at the other, over a
          single rule. The photographs carry the page; this only marks it. */}
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 16 }}
        animate={revealed ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <h2 className={styles.title}>{pick(category.name, lang)}</h2>
        {category.description && (
          <p className={styles.description}>{pick(category.description, lang)}</p>
        )}
      </motion.header>

      <MenuGrid>
        {category.items.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} isVisible={revealed} />
        ))}
      </MenuGrid>
    </section>
  );
}
