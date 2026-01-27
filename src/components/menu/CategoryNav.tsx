import { useState, useEffect, useRef } from 'react';
import { menuData } from '../../data/menu';
import styles from './CategoryNav.module.css';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

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
    // Scroll active button into view
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
      const offset = 140; // Header + nav height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div ref={navRef} className={styles.sentinel} />
      <nav className={`${styles.nav} ${isSticky ? styles.sticky : ''}`}>
        <div className={styles.container}>
          <div className={styles.scrollContainer}>
            {menuData.map((category) => (
              <button
                key={category.id}
                ref={activeCategory === category.id ? activeButtonRef : null}
                className={`${styles.tab} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => handleClick(category.id)}
              >
                {category.name}
                <span className={styles.count}>{category.items.length}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
