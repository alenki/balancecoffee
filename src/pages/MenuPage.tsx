import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { MenuCategory } from '../components/menu/MenuCategory';
import { menuData } from '../data/menu';
import { contactInfo } from '../data/locations';
import { Button } from '../components/common/Button';
import styles from './MenuPage.module.css';

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);

  // Update active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const category of menuData) {
        const element = document.getElementById(`category-${category.id}`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const totalItems = menuData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.heroTitle}>Меню</h1>
            <p className={styles.heroSubtitle}>
              {menuData.length} категорий, {totalItems} позиций
            </p>
          </motion.div>

          <motion.div
            className={styles.deliveryBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className={styles.deliveryInfo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>Доставка с {contactInfo.deliveryHours.start} до {contactInfo.deliveryHours.end}</span>
            </div>
            <div className={styles.deliveryActions}>
              <Button href={contactInfo.phoneHref} external size="sm">
                Позвонить
              </Button>
              <Button href={contactInfo.telegram} external variant="secondary" size="sm">
                Telegram
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Menu Content */}
      <div className={styles.content}>
        <div className={styles.container}>
          {menuData.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Готовы сделать заказ?</h2>
            <p className={styles.ctaText}>
              Свяжитесь с нами любым удобным способом
            </p>
            <div className={styles.ctaActions}>
              <Button href={contactInfo.phoneHref} external size="lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {contactInfo.phone}
              </Button>
              <Button href={contactInfo.telegram} external variant="outline" size="lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 5L10 14M21 5L14 21L10 14L3 10L21 5Z"/>
                </svg>
                Написать в Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
