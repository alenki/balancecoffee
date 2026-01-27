import { createContext } from 'react';
import type { City } from '../types';

export interface CityContextType {
  currentCity: City;
  setCurrentCity: (city: City) => void;
  cities: City[];
}

export const CityContext = createContext<CityContextType | undefined>(undefined);
