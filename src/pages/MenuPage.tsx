import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { MenuCategory } from '../components/menu/MenuCategory';
import { menuData, allItems } from '../data/menu';
import { contactInfo } from '../data/contact';
import { useLanguage } from '../context/LanguageContext';
import styles from './MenuPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuPage() {
  const { t, sign } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const programmaticScroll = useRef(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (programmaticScroll.current) return;
      const probe = window.scrollY + 220;

      for (const category of menuData) {
        const element = document.getElementById(`category-${category.id}`);
        if (!element) continue;
        const { offsetTop, offsetHeight } = element;
        if (probe >= offsetTop && probe < offsetTop + offsetHeight) {
          setActiveCategory(category.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lockScrollDetection = useCallback(() => {
    programmaticScroll.current = true;
    clearTimeout(lockTimeout.current);
    // Fallback in case onComplete never fires, for instance when the visitor
    // interrupts the tween by scrolling themselves.
    lockTimeout.current = setTimeout(() => {
      programmaticScroll.current = false;
    }, 1500);
  }, []);

  const unlockScrollDetection = useCallback(() => {
    clearTimeout(lockTimeout.current);
    programmaticScroll.current = false;
  }, []);

  useEffect(() => () => clearTimeout(lockTimeout.current), []);

  return (
    <main className={styles.page} id="main">
      <section className={styles.hero}>
        <div className={styles.container}>
          {/* The eyebrow and the total hold the two ends of one line, which
              leaves the whole measure for the title to centre in. */}
          <div className={styles.topRow}>
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0, x: -14 * sign }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              {t('hero.eyebrow')}
            </motion.span>

            <motion.span
              className={styles.count}
              initial={{ opacity: 0, x: 14 * sign }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <bdi>{allItems.length}</bdi> {t('menu.itemsLabel')}
            </motion.span>
          </div>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {t('menu.title')}
          </motion.h1>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            <span className={styles.hours}>
              <svg
                className={styles.clock}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v6l4 2" />
              </svg>
              {t('branches.daily')}{' '}
              <bdi>
                {contactInfo.hours.start} {t('common.timeRange')} {contactInfo.hours.end}
              </bdi>
            </span>

            <span className={styles.diamond} aria-hidden="true" />

            <span className={styles.buttons}>
              <a
                href={contactInfo.phoneHref}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {t('contact.callUs')}
              </a>
              <a
                href={contactInfo.whatsapp}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('contact.whatsapp')}
              </a>
            </span>
          </motion.div>
        </div>
      </section>

      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onScrollStart={lockScrollDetection}
        onScrollComplete={unlockScrollDetection}
        menuData={menuData}
      />

      <div className={styles.content}>
        <div className={styles.container}>
          {menuData.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}

          {/* Kept out of the header so the top of the page stays three lines.
              It reads as a footnote, which is where a menu puts it anyway. */}
          <p className={styles.note}>{t('menu.pricesNote')}</p>
        </div>
      </div>
    </main>
  );
}
