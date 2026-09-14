import type { MenuCategory } from '../types';
import type { Lang } from '../context/LanguageContext';
import { menuDataEn } from './menu.en';

export const menuData: MenuCategory[] = [
  {
    id: 'beverages',
    name: 'Напитки',
    slug: 'napitki',
    description: 'Авторские напитки и классика',
    items: [
      {
        id: 'espresso',
        name: 'Эспрессо',
        description: 'Плотный, насыщенный, с бархатной крема',
        price: 120,
        image: 'menu/espresso',
        isPopular: true,
      },
      {
        id: 'americano',
        name: 'Американо',
        priceVariants: [
          { size: '250 мл', price: 150 },
          { size: '350 мл', price: 180 },
        ],
        image: 'menu/drinks/image',
      },
      {
        id: 'cappuccino',
        name: 'Капучино',
        description: 'Мягкий, сливочный, идеальный баланс',
        priceVariants: [
          { size: '250 мл', price: 180 },
          { size: '350 мл', price: 220 },
        ],
        image: 'menu/cappuccino',
        isPopular: true,
      },
      {
        id: 'latte',
        name: 'Латте',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '400 мл', price: 250 },
        ],
        image: 'menu/drinks/image-copy',
      },
      {
        id: 'flat-white',
        name: 'Флэт Уайт',
        price: 220,
        image: 'menu/drinks/image-copy-2',
      },
      {
        id: 'raf',
        name: 'Раф',
        description: 'Сливочный, ванильный, с нежной пеной',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '400 мл', price: 300 },
        ],
        image: 'menu/raf',
        isPopular: true,
      },
      {
        id: 'matcha-latte',
        name: 'Матча Латте',
        priceVariants: [
          { size: '300 мл', price: 280 },
          { size: '400 мл', price: 340 },
        ],
        image: 'menu/drinks/image-copy-3',
        isNew: true,
      },
      {
        id: 'sencha',
        name: 'Сенча',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: 'menu/drinks/image-copy-4',
      },
      {
        id: 'puer',
        name: 'Пуэр',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: 'menu/drinks/image-copy-5',
      },
      {
        id: 'spicy-mango',
        name: 'Пряный Манго',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: 'menu/drinks/image-copy-6',
      },
      {
        id: 'geisha-kiss',
        name: 'Поцелуй Гейши',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: 'menu/drinks/image-copy-7',
      },
      {
        id: 'sea-buckthorn',
        name: 'Облепиховый',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: 'menu/drinks/image-copy-8',
      },
      {
        id: 'ginger-lemon',
        name: 'Имбирно-лимонный',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: 'menu/drinks/image-copy-9',
      },
      {
        id: 'golden-brows',
        name: 'Золотые Брови',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: 'menu/desserts/image',
      },
      {
        id: 'strawberry-rooibos',
        name: 'Земляничный Ройбуш',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: 'menu/desserts/image-copy',
      },
    ],
  },
  {
    id: 'breakfasts',
    name: 'Завтраки',
    slug: 'zavtraki',
    description: 'Идеальное начало дня',
    items: [
      {
        id: 'eggs-benedict',
        name: 'Яйца Бенедикт',
        description: 'Пашот, голландский соус, бекон, английский маффин',
        price: 380,
        image: 'menu/desserts/image-copy-2',
      },
      {
        id: 'scrambled-eggs',
        name: 'Скрэмбл с лососем',
        description: 'Нежный скрэмбл, слабосолёный лосось, тост',
        price: 420,
        image: 'menu/desserts/image-copy-3',
      },
      {
        id: 'avocado-toast',
        name: 'Авокадо тост',
        description: 'Авокадо, яйцо пашот, микрозелень, зерновой хлеб',
        price: 350,
        image: 'menu/desserts/image-copy-4',
      },
      {
        id: 'cheese-pancakes',
        name: 'Сырники',
        description: 'Со сметаной и домашним вареньем',
        price: 290,
        image: 'menu/lunches/image',
      },
      {
        id: 'granola',
        name: 'Гранола',
        description: 'Йогурт, мёд, сезонные ягоды',
        price: 280,
        image: 'menu/lunches/image-copy',
      },
      {
        id: 'oatmeal',
        name: 'Овсянка',
        description: 'На молоке с ягодами и орехами',
        price: 220,
        image: 'menu/drinks/image',
      },
      {
        id: 'omelette',
        name: 'Омлет с овощами',
        description: 'Томаты, перец, зелень, тост',
        price: 280,
        image: 'menu/drinks/image-copy',
      },
    ],
  },
  {
    id: 'lunches',
    name: 'Ланчи',
    slug: 'lanchi',
    description: 'Сытные обеды',
    items: [
      {
        id: 'chicken-bowl',
        name: 'Боул с курицей',
        description: 'Киноа, курица гриль, авокадо, овощи',
        price: 420,
        image: 'menu/chicken-bowl',
        isPopular: true,
      },
      {
        id: 'salmon-bowl',
        name: 'Боул с лососем',
        description: 'Рис, лосось, эдамаме, имбирь',
        price: 520,
        image: 'menu/drinks/image-copy-2',
      },
      {
        id: 'pasta-carbonara',
        name: 'Паста Карбонара',
        description: 'Спагетти, бекон, пармезан, желток',
        price: 380,
        image: 'menu/drinks/image-copy-3',
      },
      {
        id: 'tom-yum',
        name: 'Том Ям',
        description: 'С креветками и рисовой лапшой',
        price: 450,
        image: 'menu/drinks/image-copy-4',
        isNew: true,
      },
      {
        id: 'risotto',
        name: 'Ризотто с грибами',
        description: 'Арборио, белые грибы, пармезан',
        price: 420,
        image: 'menu/drinks/image-copy-5',
      },
    ],
  },
  {
    id: 'salads',
    name: 'Салаты',
    slug: 'salaty',
    description: 'Свежие и лёгкие',
    items: [
      {
        id: 'caesar',
        name: 'Цезарь с курицей',
        description: 'Романо, курица-гриль, пармезан, гренки',
        price: 380,
        image: 'menu/drinks/image-copy-6',
      },
      {
        id: 'greek',
        name: 'Греческий',
        description: 'Томаты, огурцы, фета, оливки, перец',
        price: 320,
        image: 'menu/drinks/image-copy-7',
      },
      {
        id: 'warm-salad',
        name: 'Тёплый салат с говядиной',
        description: 'Говядина, микс салатов, томаты черри',
        price: 450,
        image: 'menu/drinks/image-copy-8',
      },
      {
        id: 'tuna-salad',
        name: 'Салат с тунцом',
        description: 'Тунец, яйцо, стручковая фасоль, оливки',
        price: 420,
        image: 'menu/drinks/image-copy-9',
      },
    ],
  },
  {
    id: 'sandwiches',
    name: 'Сэндвичи',
    slug: 'sendvichi',
    description: 'На свежем хлебе',
    items: [
      {
        id: 'club-sandwich',
        name: 'Клаб сэндвич',
        description: 'Курица, бекон, томат, салат, яйцо',
        price: 380,
        image: 'menu/desserts/image',
      },
      {
        id: 'salmon-sandwich',
        name: 'Сэндвич с лососем',
        description: 'Слабосолёный лосось, сливочный сыр, огурец',
        price: 420,
        image: 'menu/desserts/image-copy',
      },
      {
        id: 'croissant-ham',
        name: 'Круассан с ветчиной',
        description: 'Ветчина, сыр, томат, руккола',
        price: 290,
        image: 'menu/desserts/image-copy-2',
      },
      {
        id: 'panini',
        name: 'Панини с моцареллой',
        description: 'Моцарелла, томаты, базилик, песто',
        price: 340,
        image: 'menu/desserts/image-copy-3',
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Десерты',
    slug: 'deserty',
    description: 'Сладкие удовольствия',
    items: [
      {
        id: 'cheesecake',
        name: 'Чизкейк',
        description: 'Классический нью-йоркский',
        price: 280,
        image: 'menu/cheesecake',
        isPopular: true,
      },
      {
        id: 'tiramisu',
        name: 'Тирамису',
        description: 'С маскарпоне и савоярди',
        price: 320,
        image: 'menu/desserts/image-copy-4',
      },
      {
        id: 'carrot-cake',
        name: 'Морковный торт',
        description: 'С кремом из сливочного сыра',
        price: 260,
        image: 'menu/lunches/image',
      },
      {
        id: 'brownie',
        name: 'Брауни',
        description: 'Шоколадный с орехами',
        price: 220,
        image: 'menu/lunches/image-copy',
      },
      {
        id: 'croissant',
        name: 'Круассан',
        description: 'Классический французский',
        price: 150,
        image: 'menu/drinks/image',
      },
      {
        id: 'pain-au-chocolat',
        name: 'Пэн о шоколя',
        description: 'С бельгийским шоколадом',
        price: 180,
        image: 'menu/drinks/image-copy',
        isNew: true,
      },
      {
        id: 'eclair',
        name: 'Эклер',
        description: 'С заварным кремом',
        price: 190,
        image: 'menu/drinks/image-copy-2',
      },
      {
        id: 'macarons',
        name: 'Макарон',
        description: 'Ассорти вкусов (3 шт)',
        price: 250,
        image: 'menu/macarons',
        isPopular: true,
      },
    ],
  },
  {
    id: 'snacks',
    name: 'Снеки',
    slug: 'sneki',
    description: 'Перекусить быстро',
    items: [
      {
        id: 'croissant-plain',
        name: 'Круассан',
        price: 150,
        image: 'menu/drinks/image-copy-3',
      },
      {
        id: 'cookie',
        name: 'Печенье',
        description: 'Шоколадное / овсяное',
        price: 120,
        image: 'menu/drinks/image-copy-4',
      },
      {
        id: 'muffin',
        name: 'Маффин',
        description: 'Черника / шоколад',
        price: 180,
        image: 'menu/drinks/image-copy-5',
      },
      {
        id: 'energy-bar',
        name: 'Энергетический батончик',
        description: 'Орехи, мёд, сухофрукты',
        price: 150,
        image: 'menu/drinks/image-copy-6',
      },
    ],
  },
  {
    id: 'additions',
    name: 'Добавки',
    slug: 'dobavki',
    description: 'Дополнительно к напиткам',
    items: [
      {
        id: 'milk-alt',
        name: 'Альтернативное молоко',
        description: 'Овсяное / миндальное / кокосовое',
        price: 50,
        image: 'menu/drinks/image-copy-7',
      },
      {
        id: 'syrup',
        name: 'Сироп',
        description: 'Карамель / ваниль / лесной орех',
        price: 40,
        image: 'menu/drinks/image-copy-8',
      },
      {
        id: 'extra-shot',
        name: 'Дополнительный шот',
        price: 50,
        image: 'menu/drinks/image-copy-9',
      },
      {
        id: 'whipped-cream',
        name: 'Взбитые сливки',
        price: 40,
        image: 'menu/desserts/image',
      },
    ],
  },
  {
    id: 'merch',
    name: 'Мерч',
    slug: 'merch',
    description: 'Стиль Balance',
    items: [
      {
        id: 'tshirt',
        name: 'Футболка Balance',
        description: 'Хлопок, унисекс',
        price: 1500,
        image: 'menu/desserts/image-copy',
      },
      {
        id: 'tote',
        name: 'Шоппер',
        description: 'Холщовая сумка с логотипом',
        price: 600,
        image: 'menu/desserts/image-copy-2',
      },
      {
        id: 'cup',
        name: 'Кружка Balance',
        description: 'Керамика, 350 мл',
        price: 800,
        image: 'menu/desserts/image-copy-3',
      },
      {
        id: 'tumbler',
        name: 'Термокружка',
        description: 'Нержавеющая сталь, 450 мл',
        price: 1200,
        image: 'menu/desserts/image-copy-4',
      },
      {
        id: 'coffee-beans',
        name: 'Кофе в зёрнах',
        description: 'Авторская смесь, 250 г',
        price: 900,
        image: 'menu/lunches/image',
      },
    ],
  },
];

export function getMenuData(lang: Lang): MenuCategory[] {
  return lang === 'en' ? menuDataEn : menuData;
}

export const getPopularItems = (lang: Lang = 'ru') =>
  getMenuData(lang).flatMap(category => category.items.filter(item => item.isPopular));

export const getNewItems = (lang: Lang = 'ru') =>
  getMenuData(lang).flatMap(category => category.items.filter(item => item.isNew));

export const getCategoryBySlug = (slug: string, lang: Lang = 'ru') =>
  getMenuData(lang).find(category => category.slug === slug);
