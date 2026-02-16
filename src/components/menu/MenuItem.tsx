import { motion } from 'motion/react';
import type { MenuItem as MenuItemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import styles from './MenuItem.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MenuItemProps {
  item: MenuItemType;
  index: number;
  isVisible: boolean;
}

export function MenuItem({ item, index, isVisible }: MenuItemProps) {
  const { t } = useLanguage();
  const hasVariants = item.priceVariants && item.priceVariants.length > 0;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + Math.min(index * 0.08, 0.4), ease: EASE }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.image}
          loading="lazy"
          decoding="async"
          width={400}
          height={500}
        />
        {item.isNew && (
          <span className={`${styles.badge} ${styles.badgeNew}`}>{t('badge.new')}</span>
        )}
        {item.isPopular && !item.isNew && (
          <span className={styles.badge}>{t('badge.hit')}</span>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.textCol}>
          <h3 className={styles.name}>{item.name}</h3>
          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}
        </div>

        {hasVariants ? (
          <div className={styles.variants}>
            {item.priceVariants!.map((variant, i) => (
              <span key={i} className={styles.variantItem}>
                {i > 0 && <span className={styles.variantDot} />}
                <span className={styles.variantSize}>{variant.size}</span>
                <span className={styles.variantPrice}>{variant.price} &#8381;</span>
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.price}>{item.price} &#8381;</span>
        )}
      </div>
    </motion.article>
  );
}
