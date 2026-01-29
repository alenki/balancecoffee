import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { MenuCategory as MenuCategoryType } from '../../types';
import { MenuItem } from './MenuItem';
import styles from './MenuCategory.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MenuCategoryProps {
  category: MenuCategoryType;
}

export function MenuCategory({ category }: MenuCategoryProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id={`category-${category.id}`}
      className={styles.section}
      ref={ref}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <h2 className={styles.title}>{category.name}</h2>
        {category.description && (
          <p className={styles.description}>{category.description}</p>
        )}
      </motion.div>

      <div className={styles.grid}>
        {category.items.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
