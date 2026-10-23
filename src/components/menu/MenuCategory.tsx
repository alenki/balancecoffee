import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { MenuCategory as MenuCategoryType } from '../../types';
import { toRoman } from '../../utils/format';
import { MenuItem } from './MenuItem';
import styles from './MenuCategory.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MenuCategoryProps {
  category: MenuCategoryType;
  /** Position in the menu, from 1: matches the numbering on the home page. */
  number: number;
}

/** A section: title and description over a rule, then a grid of cards. */
export function MenuCategory({ category, number }: MenuCategoryProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const headingId = `chapter-${category.id}-title`;

  return (
    <section
      id={`category-${category.id}`}
      className={styles.section}
      ref={ref}
      aria-labelledby={headingId}
    >
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <h2 id={headingId} className={styles.title}>
          <span className={styles.numeral} aria-hidden="true">
            {toRoman(number)}
          </span>
          {category.name}
        </h2>
        {category.description && <p className={styles.description}>{category.description}</p>}
      </motion.header>

      <ul className={styles.grid}>
        {category.items.map((item, index) => (
          <MenuItem key={item.id} item={item} index={index} isVisible={isVisible} />
        ))}
      </ul>
    </section>
  );
}
