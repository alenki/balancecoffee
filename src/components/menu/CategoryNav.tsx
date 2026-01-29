import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useLenisInstance } from '../../hooks/useLenis';
import type { MenuCategory } from '../../types';
import styles from './CategoryNav.module.css';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onScrollStart: () => void;
  onScrollComplete: () => void;
  menuData: MenuCategory[];
}

export function CategoryNav({ activeCategory, onCategoryChange, onScrollStart, onScrollComplete, menuData }: CategoryNavProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenisInstance();

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  const handleClick = (categoryId: string) => {
    onCategoryChange(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      onScrollStart();
      if (lenis) {
        lenis.scrollTo(element, {
          offset: -140,
          onComplete: onScrollComplete,
        });
      } else {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - 140, behavior: 'smooth' });
        setTimeout(onScrollComplete, 1200);
      }
    }
  };

  const wrapperClasses = [
    styles.scrollWrapper,
    canScrollLeft && styles.canScrollLeft,
    canScrollRight && styles.canScrollRight,
  ].filter(Boolean).join(' ');

  return (
    <>
      <div ref={navRef} className={styles.sentinel} />
      <nav className={`${styles.nav} ${isSticky ? styles.sticky : ''}`}>
        <div className={styles.container}>
          <div className={wrapperClasses}>
            <div ref={scrollRef} className={styles.scrollContainer}>
              {menuData.map((category, index) => (
                <Fragment key={category.id}>
                  {index > 0 && <span className={styles.divider} />}
                  <button
                    ref={activeCategory === category.id ? activeButtonRef : null}
                    className={`${styles.tab} ${activeCategory === category.id ? styles.active : ''}`}
                    onClick={() => handleClick(category.id)}
                  >
                    {category.name}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
