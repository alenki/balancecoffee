import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Button } from '../common/Button';
import { getPopularItems } from '../../data/menu';
import type { MenuItem } from '../../types';
import styles from './MenuPreview.module.css';

export function MenuPreview() {
  const { ref, isVisible } = useScrollAnimation();
  const popularItems = getPopularItems().slice(0, 6);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Меню</span>
          <h2 className={styles.title}>Популярное</h2>
          <p className={styles.subtitle}>
            Самые любимые позиции наших гостей
          </p>
        </motion.div>

        <div className={styles.grid}>
          {popularItems.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <motion.div
          className={styles.action}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button href="/menu" variant="outline" size="lg">
            Смотреть всё меню
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isVisible: boolean;
}

function MenuItemCard({ item, index, isVisible }: MenuItemCardProps) {
  const price = item.price || item.priceVariants?.[0]?.price;
  const priceLabel = item.priceVariants
    ? `от ${price} ₽`
    : `${price} ₽`;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
    >
      <Link to="/menu" className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img
            src={item.image}
            alt={item.name}
            className={styles.image}
            loading="lazy"
          />
          {item.isNew && <span className={styles.badge}>Новинка</span>}
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{item.name}</h3>
          {item.description && (
            <p className={styles.cardDescription}>{item.description}</p>
          )}
          <span className={styles.price}>{priceLabel}</span>
        </div>
      </Link>
    </motion.div>
  );
}
