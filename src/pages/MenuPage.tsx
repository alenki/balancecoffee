import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { MenuCategory } from '../components/menu/MenuCategory';
import { getMenuData } from '../data/menu';
import { useLanguage } from '../context/LanguageContext';
import { useLenisInstance } from '../hooks/useLenis';
import { cafe, formatHour } from '../data/cafe';
import styles from './MenuPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3.5 20.5l1.3-3.9A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-3.6-.8L3.5 20.5z" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export function MenuPage() {
  const { lang, t } = useLanguage();
  const lenis = useLenisInstance();
  const [searchParams] = useSearchParams();
  const menuData = getMenuData(lang);
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const programmaticScrollRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  // A chapter named in the URL (from a card in the home page's preview) opens at
  // that chapter. It waits two frames so it lands after the route change's
  // own scroll to the top, which runs in a parent effect.
  const chapter = searchParams.get('chapter');
  useEffect(() => {
    if (!chapter) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const element = document.getElementById(`category-${chapter}`);
        if (!element) return;
        setActiveCategory(chapter);
        if (lenis) {
          // On a cold load this page mounts behind the loader, before Lenis
          // has measured it, and Lenis clamps targets to its cached limit.
          lenis.resize();
          lenis.scrollTo(element, { offset: -140, immediate: true, force: true });
        } else {
          window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 140);
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [chapter, lenis]);

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

  const hours = `${formatHour(cafe.hours.open)} ${t('common.timeRange')} ${formatHour(cafe.hours.close)}`;

  return (
    <main className={styles.page} id="main">
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {t('menuPage.title')}
          </motion.h1>

          <motion.div
            className={styles.deliveryRow}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          >
            <p className={styles.deliveryInfo}>
              <ClockIcon />
              <span>
                {t('menuPage.delivery')} {hours}
              </span>
            </p>
            <span className={styles.deliveryDot} aria-hidden="true" />
            <div className={styles.deliveryActions}>
              <a href={cafe.phoneHref} className={`${styles.deliveryLink} ${styles.deliveryLinkPrimary}`}>
                {t('menuPage.call')}
              </a>
              <a
                href={cafe.whatsapp}
                className={styles.deliveryLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp, ${t('common.newTab')}`}
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onScrollStart={lockScrollDetection}
        onScrollComplete={unlockScrollDetection}
        menuData={menuData}
        label={t('menuPage.chaptersAria')}
      />

      <div className={styles.content}>
        <div className={styles.container}>
          {menuData.map((category, index) => (
            <MenuCategory key={category.id} category={category} number={index + 1} />
          ))}
        </div>
      </div>

      {/* Bottom CTA: a rule, then a centred title and the two ways to order */}
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
              <a href={cafe.phoneHref} className={styles.ctaButton}>
                <PhoneIcon />
                {cafe.phone}
              </a>
              <a
                href={cafe.whatsapp}
                className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp, ${t('common.newTab')}`}
              >
                <ChatIcon />
                WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
