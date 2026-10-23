import type { GuestQuote } from '../types';
import type { Lang } from '../context/LanguageContext';

/**
 * Excerpts from public guest reviews on the café's Yandex Maps page, quoted
 * as written apart from spacing and emoji. The English edition is a
 * translation and says so on the page.
 */
const ru: GuestQuote[] = [
  {
    id: 'stairs',
    text: 'Уютное место под лестницей. Кофе хороший.',
    author: 'Андрей',
    year: 2021,
  },
  {
    id: 'book',
    text: 'Хорошее, спокойное, уютное местечко. Можно и книжечку почитать за чашечкой кофе.',
    author: 'Эсет',
    year: 2024,
  },
  {
    id: 'sill',
    text: 'Вкусный раф, что для меня очень важно. И всегда вежливые бариста. Атмосфера уютная, можно попить кофе на комфортном подоконнике.',
    author: 'Sophie',
    year: 2024,
  },
  {
    id: 'tubes',
    text: 'Самый вкусный кофе в городе по самым нормальным ценам! Обожаю их трубочки!',
    author: 'Амина',
    year: 2023,
  },
  {
    id: 'warm',
    text: 'Замечательная кофейня, единственное место, где можно окунуться в себя, тёплую атмосферу и почитать книги.',
    author: 'Анжела',
    year: 2021,
  },
];

const en: GuestQuote[] = [
  {
    id: 'stairs',
    text: 'A cosy spot under the stairs. Good coffee.',
    author: 'Andrey',
    year: 2021,
  },
  {
    id: 'book',
    text: 'A good, quiet, cosy little place. You can even read a book over a cup of coffee.',
    author: 'Eset',
    year: 2024,
  },
  {
    id: 'sill',
    text: 'Delicious raf, which matters a lot to me. And the baristas are always polite. Cosy atmosphere; you can have your coffee on a comfortable window sill.',
    author: 'Sophie',
    year: 2024,
  },
  {
    id: 'tubes',
    text: 'The best coffee in town at the fairest prices! I love their waffle tubes!',
    author: 'Amina',
    year: 2023,
  },
  {
    id: 'warm',
    text: 'A wonderful café, the one place where you can sink into yourself and the warm atmosphere, and read books.',
    author: 'Anzhela',
    year: 2021,
  },
];

export const getGuestQuotes = (lang: Lang) => (lang === 'en' ? en : ru);
