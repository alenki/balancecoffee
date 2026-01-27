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
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={styles.title}>Выберите город</h2>
        </motion.div>

        {/* City buttons */}
        <motion.div
          className={styles.citiesGrid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {cities.map((city) => (
            <button
              key={city.id}
              className={`${styles.cityButton} ${currentCity.id === city.id ? styles.active : ''}`}
              onClick={() => handleCitySelect(city)}
            >
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.locationCount}>
                {city.locations.length}
              </span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
