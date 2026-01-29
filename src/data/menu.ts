import type { MenuCategory } from '../types';

const placeholder = '/placeholder.png';

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
        image: '/menu/espresso.png',
        isPopular: true,
      },
      {
        id: 'americano',
        name: 'Американо',
        priceVariants: [
          { size: '250 мл', price: 150 },
          { size: '350 мл', price: 180 },
        ],
        image: placeholder,
      },
      {
        id: 'cappuccino',
        name: 'Капучино',
        description: 'Мягкий, сливочный, идеальный баланс',
        priceVariants: [
          { size: '250 мл', price: 180 },
          { size: '350 мл', price: 220 },
        ],
        image: '/menu/cappuccino.png',
        isPopular: true,
      },
      {
        id: 'latte',
        name: 'Латте',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '400 мл', price: 250 },
        ],
        image: placeholder,
      },
      {
        id: 'flat-white',
        name: 'Флэт Уайт',
        price: 220,
        image: placeholder,
      },
      {
        id: 'raf',
        name: 'Раф',
        description: 'Сливочный, ванильный, с нежной пеной',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '400 мл', price: 300 },
        ],
        image: '/menu/raf.png',
        isPopular: true,
      },
      {
        id: 'matcha-latte',
        name: 'Матча Латте',
        priceVariants: [
          { size: '300 мл', price: 280 },
          { size: '400 мл', price: 340 },
        ],
        image: placeholder,
        isNew: true,
      },
      {
        id: 'sencha',
        name: 'Сенча',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: placeholder,
      },
      {
        id: 'puer',
        name: 'Пуэр',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: placeholder,
      },
      {
        id: 'spicy-mango',
        name: 'Пряный Манго',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: placeholder,
      },
      {
        id: 'geisha-kiss',
        name: 'Поцелуй Гейши',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: placeholder,
      },
      {
        id: 'sea-buckthorn',
        name: 'Облепиховый',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: placeholder,
      },
      {
        id: 'ginger-lemon',
        name: 'Имбирно-лимонный',
        priceVariants: [
          { size: '300 мл', price: 250 },
          { size: '500 мл', price: 300 },
        ],
        image: placeholder,
      },
      {
        id: 'golden-brows',
        name: 'Золотые Брови',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: placeholder,
      },
      {
        id: 'strawberry-rooibos',
        name: 'Земляничный Ройбуш',
        priceVariants: [
          { size: '300 мл', price: 200 },
          { size: '500 мл', price: 240 },
        ],
        image: placeholder,
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
        image: placeholder,
      },
      {
        id: 'scrambled-eggs',
        name: 'Скрэмбл с лососем',
        description: 'Нежный скрэмбл, слабосолёный лосось, тост',
        price: 420,
        image: placeholder,
      },
      {
        id: 'avocado-toast',
        name: 'Авокадо тост',
        description: 'Авокадо, яйцо пашот, микрозелень, зерновой хлеб',
        price: 350,
        image: placeholder,
      },
      {
        id: 'cheese-pancakes',
        name: 'Сырники',
        description: 'Со сметаной и домашним вареньем',
        price: 290,
        image: placeholder,
      },
      {
        id: 'granola',
        name: 'Гранола',
        description: 'Йогурт, мёд, сезонные ягоды',
        price: 280,
        image: placeholder,
      },
      {
        id: 'oatmeal',
        name: 'Овсянка',
        description: 'На молоке с ягодами и орехами',
        price: 220,
        image: placeholder,
      },
      {
        id: 'omelette',
        name: 'Омлет с овощами',
        description: 'Томаты, перец, зелень, тост',
        price: 280,
        image: placeholder,
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
        image: '/menu/chicken-bowl.png',
        isPopular: true,
      },
      {
        id: 'salmon-bowl',
        name: 'Боул с лососем',
        description: 'Рис, лосось, эдамаме, имбирь',
        price: 520,
        image: placeholder,
      },
      {
        id: 'pasta-carbonara',
        name: 'Паста Карбонара',
        description: 'Спагетти, бекон, пармезан, желток',
        price: 380,
        image: placeholder,
      },
      {
        id: 'tom-yum',
        name: 'Том Ям',
        description: 'С креветками и рисовой лапшой',
        price: 450,
        image: placeholder,
        isNew: true,
      },
      {
        id: 'risotto',
        name: 'Ризотто с грибами',
        description: 'Арборио, белые грибы, пармезан',
        price: 420,
        image: placeholder,
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
        image: placeholder,
      },
      {
        id: 'greek',
        name: 'Греческий',
        description: 'Томаты, огурцы, фета, оливки, перец',
        price: 320,
        image: placeholder,
      },
      {
        id: 'warm-salad',
        name: 'Тёплый салат с говядиной',
        description: 'Говядина, микс салатов, томаты черри',
        price: 450,
        image: placeholder,
      },
      {
        id: 'tuna-salad',
        name: 'Салат с тунцом',
        description: 'Тунец, яйцо, стручковая фасоль, оливки',
        price: 420,
        image: placeholder,
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
        image: placeholder,
      },
      {
        id: 'salmon-sandwich',
        name: 'Сэндвич с лососем',
        description: 'Слабосолёный лосось, сливочный сыр, огурец',
        price: 420,
        image: placeholder,
      },
      {
        id: 'croissant-ham',
        name: 'Круассан с ветчиной',
        description: 'Ветчина, сыр, томат, руккола',
        price: 290,
        image: placeholder,
      },
      {
        id: 'panini',
        name: 'Панини с моцареллой',
        description: 'Моцарелла, томаты, базилик, песто',
        price: 340,
        image: placeholder,
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
        image: '/menu/cheesecake.png',
        isPopular: true,
      },
      {
        id: 'tiramisu',
        name: 'Тирамису',
        description: 'С маскарпоне и савоярди',
        price: 320,
        image: placeholder,
      },
      {
        id: 'carrot-cake',
        name: 'Морковный торт',
        description: 'С кремом из сливочного сыра',
        price: 260,
        image: placeholder,
      },
      {
        id: 'brownie',
        name: 'Брауни',
        description: 'Шоколадный с орехами',
        price: 220,
        image: placeholder,
      },
      {
        id: 'croissant',
        name: 'Круассан',
        description: 'Классический французский',
        price: 150,
        image: placeholder,
      },
      {
        id: 'pain-au-chocolat',
        name: 'Пэн о шоколя',
        description: 'С бельгийским шоколадом',
        price: 180,
        image: placeholder,
        isNew: true,
      },
      {
        id: 'eclair',
        name: 'Эклер',
        description: 'С заварным кремом',
        price: 190,
        image: placeholder,
      },
      {
        id: 'macarons',
        name: 'Макарон',
        description: 'Ассорти вкусов (3 шт)',
        price: 250,
        image: '/menu/macarons.png',
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
        image: placeholder,
      },
      {
        id: 'cookie',
        name: 'Печенье',
        description: 'Шоколадное / овсяное',
        price: 120,
        image: placeholder,
      },
      {
        id: 'muffin',
        name: 'Маффин',
        description: 'Черника / шоколад',
        price: 180,
        image: placeholder,
      },
      {
        id: 'energy-bar',
        name: 'Энергетический батончик',
        description: 'Орехи, мёд, сухофрукты',
        price: 150,
        image: placeholder,
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
        image: placeholder,
      },
      {
        id: 'syrup',
        name: 'Сироп',
        description: 'Карамель / ваниль / лесной орех',
        price: 40,
        image: placeholder,
      },
      {
        id: 'extra-shot',
        name: 'Дополнительный шот',
        price: 50,
        image: placeholder,
      },
      {
        id: 'whipped-cream',
        name: 'Взбитые сливки',
        price: 40,
        image: placeholder,
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
        image: placeholder,
      },
      {
        id: 'tote',
        name: 'Шоппер',
        description: 'Холщовая сумка с логотипом',
        price: 600,
        image: placeholder,
      },
      {
        id: 'cup',
        name: 'Кружка Balance',
        description: 'Керамика, 350 мл',
        price: 800,
        image: placeholder,
      },
      {
        id: 'tumbler',
        name: 'Термокружка',
        description: 'Нержавеющая сталь, 450 мл',
        price: 1200,
        image: placeholder,
      },
      {
        id: 'coffee-beans',
        name: 'Кофе в зёрнах',
        description: 'Авторская смесь, 250 г',
        price: 900,
        image: placeholder,
      },
    ],
  },
];

export const getPopularItems = () =>
  menuData.flatMap(category => category.items.filter(item => item.isPopular));

export const getNewItems = () =>
  menuData.flatMap(category => category.items.filter(item => item.isNew));

export const getCategoryBySlug = (slug: string) =>
  menuData.find(category => category.slug === slug);
