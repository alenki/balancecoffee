/**
 * Everything the site states as fact about the café, in one place.
 *
 * Sources: the Yandex Maps listing (org 26863601865), the café's Yandex
 * Business page and the Instagram bio, checked October 2026. Copy that
 * depends on language lives in the translations; this file holds the values.
 */
export const cafe = {
  phone: '+7 928 916-88-77',
  phoneHref: 'tel:+79289168877',
  /** Orders, delivery and the guest book all arrive here. */
  whatsapp: 'https://wa.me/79289168877',
  instagram: 'https://www.instagram.com/bibliotekanalchik/',
  instagramHandle: '@bibliotekanalchik',
  vk: 'https://vk.com/bibliotekanalchik',

  /** The number on Pushkina Street; the street name is in the translations. */
  house: '35',

  yandexMaps: 'https://yandex.ru/maps/org/biblioteka/26863601865/',
  yandexReviews: 'https://yandex.ru/maps/org/biblioteka/26863601865/reviews/',
  /** Opens a route from wherever the visitor is to the door. */
  route: 'https://yandex.ru/maps/?rtext=~43.481350%2C43.604801&rtt=auto',
  coordinates: [43.48135, 43.604801] as const,

  /** Nalchik keeps Moscow time all year. */
  timeZone: 'Europe/Moscow',
  /** Daily, in whole hours. */
  hours: { open: 8, close: 22 },
  /** The Instagram bio switches to these during Ramadan. */
  ramadanHours: { open: 8, close: 20 },

  legal: {
    inn: '072500842211',
    ogrnip: '312072524300011',
  },
} as const;

/** 8 -> "8:00" */
export const formatHour = (hour: number) => `${hour}:00`;
