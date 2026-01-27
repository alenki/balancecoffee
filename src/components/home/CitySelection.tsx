import { motion } from 'motion/react';
import { useCity } from '../../hooks/useCity';
import type { City } from '../../types';
import styles from './CitySelection.module.css';

export function CitySelection() {
  const { cities, currentCity, setCurrentCity } = useCity();

  const handleCitySelect = (city: City) => {
    setCurrentCity(city);
  };

  return (
    <div className={styles.citySelection}>
      <div className={styles.container}>
        {/* Section header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <span className={styles.headerAccent}>Выберите город</span>
          <h2 className={styles.headerTitle}>Наши кофейни</h2>
        </motion.div>

        {/* City cards grid */}
        <div className={styles.citiesGrid}>
          {cities.map((city, index) => (
            <motion.button
              key={city.id}
              className={`${styles.cityCard} ${currentCity.id === city.id ? styles.active : ''}`}
              onClick={() => handleCitySelect(city)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.5 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Decorative map pin icon */}
              <div className={styles.pinIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* City name */}
              <span className={styles.cityName}>{city.name}</span>

              {/* Location count */}
              <span className={styles.locationCount}>
                {city.locations.length}{' '}
                {getLocationWord(city.locations.length)}
              </span>

              {/* Active indicator line */}
              <div className={styles.activeLine} />
            </motion.button>
          ))}
        </div>

        {/* Decorative geographic lines */}
        <div className={styles.geoLines} aria-hidden="true">
          <motion.div
            className={styles.geoLine1}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className={styles.geoLine2}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

// Russian pluralization for "локация/локации/локаций"
function getLocationWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'локаций';
  }
  if (lastDigit === 1) {
    return 'локация';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'локации';
  }
  return 'локаций';
}
