import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useLenisInstance } from '../../hooks/useLenis';
import { useLanguage } from '../../context/LanguageContext';
import { pick, type MenuCategory } from '../../types';
import styles from './CategoryNav.module.css';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onScrollStart: () => void;
  onScrollComplete: () => void;
  menuData: MenuCategory[];
}

/** Matches scroll-margin-block-start on the category sections. */
const JUMP_OFFSET = -150;

export function CategoryNav({
  activeCategory,
  onCategoryChange,
  onScrollStart,
  onScrollComplete,
  menuData,
}: CategoryNavProps) {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenisInstance();
  const { lang } = useLanguage();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 1, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // Keep the active tab in view as the page scrolls past categories.
  // `inline: 'center'` is direction-aware, so this needs no RTL branch.
  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeCategory]);

  const handleClick = useCallback(
    (categoryId: string) => {
      onCategoryChange(categoryId);
      const element = document.getElementById(`category-${categoryId}`);
      if (!element) return;

      onScrollStart();
      if (lenis) {
        lenis.scrollTo(element, { offset: JUMP_OFFSET, onComplete: onScrollComplete });
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY + JUMP_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(onScrollComplete, 1200);
      }
    },
    [lenis, onCategoryChange, onScrollStart, onScrollComplete]
  );

  return (
    <>
      <div ref={navRef} className={styles.sentinel} />
      <nav className={`${styles.nav} ${isSticky ? styles.sticky : ''}`}>
        <div className={styles.container}>
          <div className={styles.scroller}>
            {menuData.map((category, index) => {
              const isActive = activeCategory === category.id;
              return (
                <Fragment key={category.id}>
                  {index > 0 && <span className={styles.divider} aria-hidden="true" />}
                  <button
                    type="button"
                    ref={isActive ? activeButtonRef : null}
                    className={`${styles.tab} ${isActive ? styles.active : ''}`}
                    onClick={() => handleClick(category.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {pick(category.name, lang)}
                  </button>
                </Fragment>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
