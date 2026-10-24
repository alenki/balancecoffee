import type { MenuCategory, MenuItem } from '../types';
import type { Lang } from '../context/LanguageContext';
import { menuDataEn } from './menu.en';

/**
 * The menu as printed on the board at the counter (October 2026), plus the
 * display case as listed on Yandex Maps. Display case items carry no fixed
 * price: the case changes daily and the barista quotes it.
 */
export const menuData: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Кофе',
    description: 'Классика на эспрессо',
    items: [
      { id: 'espresso', name: 'Эспрессо', size: 'от 36 до 40 мл', price: 190, image: 'menu/espresso' },
      { id: 'americano', name: 'Американо', size: '250 мл', price: 190 },
      {
        id: 'cappuccino',
        name: 'Капучино',
        priceVariants: [
          { size: '250 мл', price: 230 },
          { size: '350 мл', price: 250 },
        ],
        isPopular: true,
        image: 'menu/cappuccino',
      },
      { id: 'latte', name: 'Латте', size: '350 мл', price: 260, image: 'menu/latte-croissant' },
      { id: 'flat-white', name: 'Флэт уайт', size: '250 мл', price: 250 },
      {
        id: 'mocha',
        name: 'Мокко',
        description: 'Эспрессо, молоко и шоколад',
        priceVariants: [
          { size: '250 мл', price: 250 },
          { size: '350 мл', price: 270 },
        ],
      },
      {
        id: 'raf',
        name: 'Раф',
        description: 'Эспрессо, взбитый со сливками и ванильным сахаром',
        priceVariants: [
          { size: '250 мл', price: 280 },
          { size: '350 мл', price: 310 },
        ],
        isPopular: true,
      },
      {
        id: 'raf-urbech',
        name: 'Раф урбеч',
        description: 'Раф с урбечем, густой пастой из перетёртых орехов',
        size: '350 мл',
        price: 350,
      },
    ],
  },
  {
    id: 'iced',
    name: 'Холодный кофе',
    description: 'Со льдом, для жарких дней',
    items: [
      { id: 'iced-latte', name: 'Айс латте', price: 260, image: 'menu/iced-latte' },
      {
        id: 'bumble-orange',
        name: 'Бамбл апельсин',
        description: 'Эспрессо и апельсиновый сок со льдом',
        price: 250,
        image: 'menu/bumble-orange',
      },
      {
        id: 'bumble-pomegranate',
        name: 'Бамбл гранат',
        description: 'Эспрессо и гранатовый сок со льдом',
        price: 250,
      },
      {
        id: 'espresso-tonic',
        name: 'Эспрессо тоник лайм',
        description: 'Эспрессо, тоник и лайм',
        price: 270,
      },
      {
        id: 'frappe',
        name: 'Фраппе',
        description: 'Холодный кофе, взбитый со льдом',
        price: 350,
        image: 'menu/frappe',
      },
    ],
  },
  {
    id: 'tea',
    name: 'Домашние чаи',
    description: 'На ягодах, фруктах и травах. Чайник на 900 мл берут на компанию.',
    items: [
      {
        id: 'vitamin',
        name: 'Витаминный взрыв',
        priceVariants: [
          { size: '350 мл', price: 250 },
          { size: 'чайник 900 мл', price: 450 },
        ],
      },
      {
        id: 'multifruit',
        name: 'Мультифрукт',
        priceVariants: [
          { size: '350 мл', price: 250 },
          { size: 'чайник 900 мл', price: 450 },
        ],
      },
      {
        id: 'sea-buckthorn-mango',
        name: 'Облепиха и манго',
        priceVariants: [
          { size: '350 мл', price: 250 },
          { size: 'чайник 900 мл', price: 450 },
        ],
      },
      {
        id: 'northern-berries',
        name: 'Северные ягоды',
        priceVariants: [
          { size: '350 мл', price: 250 },
          { size: 'чайник 900 мл', price: 450 },
        ],
      },
      {
        id: 'citrus-classic',
        name: 'Цитрусовый классик',
        priceVariants: [
          { size: '350 мл', price: 250 },
          { size: 'чайник 900 мл', price: 450 },
        ],
      },
      {
        id: 'cherry-grog',
        name: 'Вишнёвый грог',
        description: 'Горячий вишнёвый напиток без алкоголя',
        priceVariants: [
          { size: '350 мл', price: 300 },
          { size: 'чайник 900 мл', price: 500 },
        ],
      },
      { id: 'mulled', name: 'Глинтвейн', description: 'Без алкоголя', size: '350 мл', price: 350 },
      { id: 'tea-classic', name: 'Чай чёрный или зелёный', price: 100 },
    ],
  },
  {
    id: 'not-coffee',
    name: 'Не кофе',
    description: 'Для тех, кто пришёл за книгой, а не за кофеином',
    items: [
      {
        id: 'cocoa',
        image: 'menu/cocoa-cream',
        name: 'Какао',
        priceVariants: [
          { size: '250 мл', price: 200 },
          { size: '350 мл', price: 230 },
        ],
      },
      {
        id: 'hot-chocolate',
        name: 'Горячий шоколад',
        priceVariants: [
          { size: '250 мл', price: 250 },
          { size: '350 мл', price: 280 },
        ],
      },
      {
        id: 'babyccino',
        name: 'Какао бэйбичино',
        description: 'Для детей: молочная пена с какао, без кофе',
        size: '350 мл',
        price: 300,
      },
      { id: 'matcha', name: 'Матча латте', size: '350 мл', price: 300 },
    ],
  },
  {
    id: 'lemonades',
    name: 'Лимонады',
    description: 'Холодные, со льдом и фруктами',
    items: [
      { id: 'watermelon-mint', name: 'Арбуз и мята', price: 270 },
      { id: 'pomegranate-basil', name: 'Гранат и базилик', price: 270 },
      { id: 'citrus-mix', name: 'Цитрусовый микс', price: 270 },
      { id: 'berry', name: 'Ягодный', description: 'Малина и клубника', price: 270 },
      {
        id: 'mojito',
        name: 'Мохито',
        description: 'Лайм, лимон, мята и лёгкий газ',
        price: 280,
        image: 'menu/lemonades',
      },
      { id: 'mojito-passionfruit', name: 'Мохито с маракуйей', price: 290 },
      { id: 'mojito-strawberry', name: 'Мохито клубничный', price: 290 },
    ],
  },
  {
    id: 'milkshakes',
    name: 'Милкшейки',
    items: [
      { id: 'shake-vanilla', name: 'Ванильный', price: 290 },
      { id: 'shake-chocolate', name: 'Шоколадный', price: 290 },
      { id: 'shake-banana', name: 'Банановый', price: 290 },
      { id: 'shake-strawberry', name: 'Клубничный', price: 290 },
    ],
  },
  {
    id: 'smoothies',
    name: 'Смузи',
    items: [
      { id: 'pineapple-banana', name: 'Ананас и банан', price: 320 },
      { id: 'kiwi-spinach', name: 'Киви и шпинат', price: 320 },
      { id: 'mango-strawberry', name: 'Манго и клубника', price: 320 },
      { id: 'berry-mix', name: 'Ягодный микс', price: 320 },
    ],
  },
  {
    id: 'desserts',
    name: 'Десерты и выпечка',
    description: 'Витрина обновляется каждый день, цены подскажет бариста',
    items: [
      { id: 'croissants', name: 'Круассаны', isPopular: true, image: 'menu/croissants' },
      { id: 'waffle-tubes', name: 'Вафельные трубочки', isPopular: true, image: 'menu/waffle-tube' },
      {
        id: 'frambini',
        name: 'Фрамбини',
        description: 'Свежая малина в белом и тёмном шоколаде',
        isNew: true,
        image: 'menu/frambini',
      },
      { id: 'macarons', name: 'Макаруны' },
      { id: 'mochi', name: 'Моти', size: '2 шт.', image: 'menu/mochi' },
      { id: 'syrniki', name: 'Сырники с клубникой', size: '2 шт.' },
      {
        id: 'syrniki-gf',
        name: 'Сырники без глютена',
        description: 'С черникой и клубникой',
        size: '2 шт.',
      },
      { id: 'fitkit', name: 'Протеиновые пирожные FitKit' },
      { id: 'snaq', name: 'Протеиновые батончики Snaq Fabriq' },
      { id: 'nuts', name: 'Орешки со сгущёнкой', size: '150 г' },
      { id: 'marmalade', name: 'Мармеладки', size: '180 г' },
      { id: 'sandwiches', name: 'Сэндвичи', image: 'menu/sandwiches' },
    ],
  },
  {
    id: 'extras',
    name: 'Дополнения',
    description: 'К любому напитку',
    items: [
      { id: 'alt-milk', name: 'Альтернативное молоко', price: 70 },
      { id: 'honey', name: 'Мёд', price: 30 },
      { id: 'marshmallow', name: 'Маршмеллоу', price: 30 },
      { id: 'citrus-slice', name: 'Лимон, лайм или апельсин', price: 20 },
      { id: 'mint', name: 'Мята', price: 30 },
      { id: 'peanut', name: 'Арахисовая паста', price: 40 },
      { id: 'urbech', name: 'Урбеч', price: 40 },
      { id: 'ginger', name: 'Имбирь', price: 30 },
      { id: 'raspberry-jam', name: 'Малиновое варенье', price: 30 },
      { id: 'juiceballs', name: 'Джусболы', description: 'Шарики с соком', price: 60 },
      { id: 'syrup', name: 'Сироп', price: 20 },
    ],
  },
];

export function getMenuData(lang: Lang): MenuCategory[] {
  return lang === 'en' ? menuDataEn : menuData;
}

/**
 * The six the home page shows: photographed items from across the menu.
 * Chosen by id, so both editions show the same six.
 */
const FEATURED_IDS = ['latte', 'iced-latte', 'cocoa', 'mojito', 'croissants', 'waffle-tubes'];

/** The featured items in menu order, each with the chapter it opens. */
export function getFeaturedItems(lang: Lang): { item: MenuItem; chapter: string }[] {
  return getMenuData(lang).flatMap((category) =>
    category.items
      .filter((item) => FEATURED_IDS.includes(item.id))
      .map((item) => ({ item, chapter: category.id })),
  );
}

export const countItems = (menu: MenuCategory[]) =>
  menu.reduce((sum, category) => sum + category.items.length, 0);
