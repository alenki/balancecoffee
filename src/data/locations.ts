import type { City, ContactInfo } from '../types';

export const cities: City[] = [
  {
    id: 'moscow',
    name: 'Москва',
    locations: [
      { address: 'Ореховая, 15', coordinates: [55.7602, 37.6215] },
      { address: 'Лесной переулок, 3', coordinates: [55.7514, 37.6098] },
      { address: 'Набережная, 42', coordinates: [55.7448, 37.6304] },
    ],
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    locations: [
      { address: 'Речная, 8', coordinates: [59.9386, 30.3141] },
      { address: 'Солнечный бульвар, 21', coordinates: [59.9271, 30.3382] },
      { address: 'Янтарная, 5А', coordinates: [59.9425, 30.3529] },
    ],
  },
  {
    id: 'kazan',
    name: 'Казань',
    locations: [
      { address: 'Центральная, 12', coordinates: [55.7942, 49.112] },
      { address: 'Цветочная, 7', coordinates: [55.7889, 49.1225] },
    ],
  },
  {
    id: 'ekaterinburg',
    name: 'Екатеринбург',
    locations: [
      { address: 'Весенняя, 30', coordinates: [56.8354, 60.6101] },
      { address: 'Проспект Мечты, 4', coordinates: [56.8412, 60.5978] },
      { address: 'Озёрная, 18', coordinates: [56.8301, 60.6203], isComingSoon: true },
    ],
  },
  {
    id: 'nizhny-novgorod',
    name: 'Нижний Новгород',
    locations: [
      { address: 'Ясная, 25', coordinates: [56.324, 43.9946] },
      { address: 'Кленовый бульвар, 9', coordinates: [56.3186, 44.0125] },
    ],
  },
  {
    id: 'krasnodar',
    name: 'Краснодар',
    locations: [
      { address: 'Южная, 60', coordinates: [45.0393, 38.977] },
      { address: 'Виноградная, 14', coordinates: [45.0311, 38.9668] },
      { address: 'Тихая, 2Б', coordinates: [45.026, 38.9855] },
    ],
  },
];

export const contactInfo: ContactInfo = {
  phone: '+7 928 999 66 40',
  phoneHref: 'tel:+79289996640',
  telegram: 'https://t.me/lumakostudio',
  deliveryHours: {
    start: '8:00',
    end: '23:00',
  },
};
