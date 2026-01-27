import { useState, useRef, useEffect } from 'react';
import { useCity } from '../../hooks/useCity';
import styles from './CitySelector.module.css';

interface CitySelectorProps {
  variant?: 'default' | 'light';
}

export function CitySelector({ variant = 'default' }: CitySelectorProps) {
  const { currentCity, setCurrentCity, cities } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.wrapper} ${styles[variant]}`} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.cityName}>{currentCity.name}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {cities.map((city) => (
            <li key={city.id}>
              <button
                className={`${styles.option} ${city.id === currentCity.id ? styles.active : ''}`}
                onClick={() => {
                  setCurrentCity(city);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={city.id === currentCity.id}
              >
                <span>{city.name}</span>
                <span className={styles.locationCount}>
                  {city.locations.length} {getLocationWord(city.locations.length)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getLocationWord(count: number): string {
  if (count === 1) return 'кофейня';
  if (count >= 2 && count <= 4) return 'кофейни';
  return 'кофеен';
}
