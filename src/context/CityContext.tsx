import { useState, useEffect, type ReactNode } from 'react';
import type { City } from '../types';
import { cities, getDefaultCity } from '../data/locations';
import { CityContext } from './cityContextValue';

const CITY_STORAGE_KEY = 'balance-coffee-city';

export function CityProvider({ children }: { children: ReactNode }) {
  const [currentCity, setCurrentCity] = useState<City>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CITY_STORAGE_KEY);
      if (saved) {
        const found = cities.find(c => c.id === saved);
        if (found) return found;
      }
    }
    return getDefaultCity();
  });

  useEffect(() => {
    localStorage.setItem(CITY_STORAGE_KEY, currentCity.id);
  }, [currentCity]);

  return (
    <CityContext.Provider value={{ currentCity, setCurrentCity, cities }}>
      {children}
    </CityContext.Provider>
  );
}
