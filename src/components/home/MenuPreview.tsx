import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { getPopularItems } from '../../data/menu';
import type { MenuItem } from '../../types';
import styles from './MenuPreview.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuPreview() {
  const { ref, isVisible } = useScrollAnimation();
  const popularItems = getPopularItems().slice(0, 6);

  return (
    <section className={styles.section} ref={ref}>
      {/* Corner accents */}
      <motion.div
        className={`${styles.cornerAccent} ${styles.cornerTL}`}
        initial={{ opacity: 0, x: -15 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
      >
        Меню
      </motion.div>
      <motion.div
        className={`${styles.cornerAccent} ${styles.cornerTR}`}
        initial={{ opacity: 0, x: 15 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        50+ позиций
      </motion.div>

      <div className={styles.container}>
        {/* Editorial Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className={styles.headerItalic}>
            Каждая позиция в нашем меню —
          </span>
          <h2 className={styles.headerBold}>
            Продумана<br />
            <span className={styles.headerBoldAccent}>до деталей</span>
          </h2>
        </motion.div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {popularItems.map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        />

        {/* CTA */}
        <motion.div
          className={styles.action}
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        >
          <Link to="/menu" className={styles.ctaButton}>
            Смотреть меню
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  item: MenuItem;
  index: number;
  isVisible: boolean;
}

function ProductCard({ item, index, isVisible }: ProductCardProps) {
  const price = item.price || item.priceVariants?.[0]?.price;
  const priceLabel = item.priceVariants
    ? `от ${price} ₽`
    : `${price} ₽`;

  // Build description from item description or generate from category context
  const description = item.description || '';

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: EASE }}
    >
      <Link to="/menu" className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img
            src={item.image}
            alt={item.name}
            className={styles.image}
            loading="lazy"
          />
          {item.isNew && (
            <span className={`${styles.badge} ${styles.badgeNew}`}>
              Новинка
            </span>
          )}
          {item.isPopular && !item.isNew && (
            <span className={styles.badge}>Хит</span>
          )}
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardTextCol}>
            <h3 className={styles.cardTitle}>{item.name}</h3>
            {description && (
              <p className={styles.cardDescription}>{description}</p>
            )}
          </div>
          <span className={styles.cardPrice}>{priceLabel}</span>
        </div>
      </Link>
    </motion.div>
  );
}
