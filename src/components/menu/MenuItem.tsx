import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { MenuItem as MenuItemType, PriceVariant } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { rub } from '../../utils/format';
import { Image } from '../common/Image';
import { MENU_CARD_SIZES } from '../common/imageSizes';
import styles from './MenuItem.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MenuItemProps {
  item: MenuItemType;
  index: number;
  isVisible: boolean;
  /** Makes the whole card a link, as on the home page's menu preview. */
  to?: string;
}

/**
 * A card: the item's photograph when the café has published one, otherwise
 * a red tile with the name stamped on it in cream, like the café's own
 * posts. Name, description and price sit underneath either way.
 */
export function MenuItem({ item, index, isVisible, to }: MenuItemProps) {
  const { t } = useLanguage();

  // A single price with a serving size reads the same as one variant
  const variants: PriceVariant[] =
    item.priceVariants ?? (item.price !== undefined && item.size ? [{ size: item.size, price: item.price }] : []);
  const sizes = item.priceVariants ? item.priceVariants.map((v) => v.size) : item.size ? [item.size] : [];

  const card = (
    <>
      <div className={`${styles.media} ${item.image ? styles.photo : styles.tile}`}>
        {item.image ? (
          // Inside a link the heading already names it; the alt would say it twice
          <Image
            name={item.image}
            alt={to ? '' : item.name}
            className={styles.image}
            frameClassName={styles.frame}
            sizes={MENU_CARD_SIZES}
          />
        ) : (
          <div className={styles.label} aria-hidden="true">
            <span className={styles.labelName}>{item.name}</span>
            {sizes.length > 0 && (
              // Each size holds together; a narrow tile breaks only between them
              <span className={styles.labelMeta}>{sizes.map((size) => size.replace(/ /g, '\u00a0')).join(' · ')}</span>
            )}
          </div>
        )}
        {item.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>{t('menu.new')}</span>}
        {item.isPopular && !item.isNew && <span className={styles.badge}>{t('menu.popular')}</span>}
      </div>

      <div className={styles.info}>
        <div className={styles.textCol}>
          <h3 className={styles.name}>{item.name}</h3>
          {item.description && <p className={styles.description}>{item.description}</p>}
        </div>

        {variants.length > 0 ? (
          <p className={styles.variants}>
            {variants.map((variant, i) => (
              <span key={variant.size} className={styles.variantItem}>
                {i > 0 && <span className={styles.variantDot} aria-hidden="true" />}
                <span className={styles.variantSize}>{variant.size}</span>
                <span className={styles.variantPrice}>{rub(variant.price)}</span>
              </span>
            ))}
          </p>
        ) : item.price !== undefined ? (
          <p className={styles.price}>{rub(item.price)}</p>
        ) : (
          <p className={styles.unpriced}>
            {item.size && <span className={styles.variantSize}>{item.size} · </span>}
            {t('menu.inDisplay')}
          </p>
        )}
      </div>
    </>
  );

  return (
    <motion.li
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + Math.min(index * 0.08, 0.4), ease: EASE }}
    >
      {to ? (
        <Link to={to} className={styles.link}>
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.li>
  );
}
