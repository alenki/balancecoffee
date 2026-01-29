import { useState, useEffect, useRef, Fragment } from 'react';
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
      const offset = 140;
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
      </nav>
    </>
  );
}
