import type { City, ContactInfo } from '../types';

export const cities: City[] = [
  {
    id: 'nalchik',
    name: 'Нальчик',
    locations: [
      { address: 'Кирова, 222', coordinates: [43.4846, 43.6072] },
      { address: 'Кирова, 1Д', coordinates: [43.4831, 43.6058] },
      { address: 'Кулиева, 2В / левое крыло здания', coordinates: [43.4915, 43.5982] },
      { address: 'Кулиева, 2В / правое крыло здания', coordinates: [43.4915, 43.5985] },
      { address: 'Ленина, 30', coordinates: [43.4858, 43.6045] },
      { address: 'Проспект Шогенцукова, 4', coordinates: [43.4872, 43.6012] },
    ],
  },
  {
    id: 'rostov',
    name: 'Ростов-на-Дону',
    locations: [
      { address: 'Большая Садовая, 111', coordinates: [47.2274, 39.7446] },
      { address: 'Большая Садовая, 81/31', coordinates: [47.2271, 39.7389] },
      { address: 'Большая Садовая, 84', coordinates: [47.2273, 39.7395] },
    ],
  },
  {
    id: 'sochi',
    name: 'Сочи',
    locations: [
      { address: 'Навагинская, 9', coordinates: [43.5855, 39.7231] },
      { address: 'Парковая, 11/10А', coordinates: [43.5842, 39.7198], isComingSoon: true },
    ],
  },
  {
    id: 'vladikavkaz',
    name: 'Владикавказ',
    locations: [
      { address: 'Куйбышева, 15', coordinates: [43.0248, 44.6819] },
      { address: 'Проспект Мира, 10', coordinates: [43.0233, 44.6802] },
      { address: 'Гаппо Баева, 22', coordinates: [43.0259, 44.6725] },
    ],
  },
  {
    id: 'stavropol',
    name: 'Ставрополь',
    locations: [
      { address: '50 лет ВЛКСМ, 11', coordinates: [45.0428, 41.9734] },
    ],
  },
  {
    id: 'samara',
    name: 'Самара',
    locations: [
      { address: 'Куйбышева, 70', coordinates: [53.1893, 50.0972] },
    ],
  },
];

export const contactInfo: ContactInfo = {
  phone: '+7 928 081 8632',
  phoneHref: 'tel:+79280818632',
  telegram: 'https://t.me/+79280818632',
  deliveryHours: {
    start: '8:00',
    end: '23:00',
  },
};

export const getDefaultCity = (): City => cities[0];

export const getCityById = (id: string): City | undefined =>
  cities.find(city => city.id === id);
