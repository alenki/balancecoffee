import { motion } from 'motion/react';
import type { MenuItem as MenuItemType } from '../../types';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  item: MenuItemType;
  index: number;
  isVisible: boolean;
}

export function MenuItem({ item, index, isVisible }: MenuItemProps) {
  const hasVariants = item.priceVariants && item.priceVariants.length > 0;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.image}
          loading="lazy"
        />
        {item.isNew && <span className={styles.badgeNew}>Новинка</span>}
        {item.isPopular && !item.isNew && (
          <span className={styles.badgePopular}>Хит</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{item.name}</h3>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}

        <div className={styles.priceSection}>
          {hasVariants ? (
            <div className={styles.variants}>
              {item.priceVariants!.map((variant, i) => (
                <div key={i} className={styles.variant}>
                  <span className={styles.variantSize}>{variant.size}</span>
                  <span className={styles.variantPrice}>{variant.price} ₽</span>
                </div>
              ))}
            </div>
          ) : (
            <span className={styles.price}>{item.price} ₽</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
