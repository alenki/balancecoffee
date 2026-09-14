import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { MenuCategory } from '../components/menu/MenuCategory';
import { getMenuData } from '../data/menu';
import { useLanguage } from '../context/LanguageContext';
import { contactInfo } from '../data/locations';
import styles from './MenuPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuPage() {
  const { lang, t } = useLanguage();
  const menuData = getMenuData(lang);
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const programmaticScrollRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const totalItems = menuData.reduce((sum, cat) => sum + cat.items.length, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (programmaticScrollRef.current) return;

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
  }, [menuData]);

  const lockScrollDetection = useCallback(() => {
    programmaticScrollRef.current = true;
    clearTimeout(lockTimeoutRef.current);
    // Safety fallback: unlock after Lenis duration (1.2s) + buffer,
    // in case onComplete doesn't fire (e.g. animation interrupted by user scroll)
    lockTimeoutRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 1500);
  }, []);

  const unlockScrollDetection = useCallback(() => {
    clearTimeout(lockTimeoutRef.current);
    programmaticScrollRef.current = false;
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <main className={styles.page} id="main">
      {/* Hero Section: Editorial */}
      <section className={styles.hero}>
        {/* Corner accents */}
        <motion.div
          className={`${styles.cornerAccent} ${styles.cornerTL}`}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          Specialty Coffee
        </motion.div>
        <motion.div
          className={`${styles.cornerAccent} ${styles.cornerTR}`}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          {totalItems} {t('menuPage.items')}
        </motion.div>

        <div className={styles.heroContainer}>
          <motion.div
            className={styles.headerBlock}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h1 className={styles.headerBold}>{t('menuPage.title')}</h1>
          </motion.div>

          <motion.div
            className={styles.deliveryRow}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          >
            <div className={styles.deliveryInfo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{t('menuPage.delivery')} {contactInfo.deliveryHours.start} {t('common.timeRange')} {contactInfo.deliveryHours.end}</span>
            </div>
            <span className={styles.deliveryDot} />
            <div className={styles.deliveryActions}>
              <a
                href={contactInfo.phoneHref}
                className={`${styles.deliveryLink} ${styles.deliveryLinkPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('menuPage.call')}
              </a>
              <a href={contactInfo.telegram} className={styles.deliveryLink} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onScrollStart={lockScrollDetection}
        onScrollComplete={unlockScrollDetection}
        menuData={menuData}
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

      {/* Bottom CTA: Editorial */}
      <section className={styles.bottomCta}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaDivider}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <div className={styles.ctaContent}>
            <motion.span
              className={styles.ctaItalic}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            >
              {t('menuPage.ctaItalic')}
            </motion.span>
            <motion.h2
              className={styles.ctaTitle}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            >
              {t('menuPage.ctaTitle')}
            </motion.h2>
            <motion.div
              className={styles.ctaActions}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            >
              <a href={contactInfo.phoneHref} className={styles.ctaButton} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {contactInfo.phone}
              </a>
              <a
                href={contactInfo.telegram}
                className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 5L10 14M21 5L14 21L10 14L3 10L21 5Z"/>
                </svg>
                Telegram
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
