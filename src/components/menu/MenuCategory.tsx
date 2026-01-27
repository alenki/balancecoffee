import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { MenuCategory as MenuCategoryType } from '../../types';
import { MenuItem } from './MenuItem';
import styles from './MenuCategory.module.css';

interface MenuCategoryProps {
  category: MenuCategoryType;
  onVisible?: () => void;
}

export function MenuCategory({ category, onVisible }: MenuCategoryProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  // Notify parent when this category becomes visible
  if (isVisible && onVisible) {
    onVisible();
  }

  return (
    <section
      id={`category-${category.id}`}
      className={styles.section}
      ref={ref}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
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
