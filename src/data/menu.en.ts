import type { MenuCategory } from '../types';

/** English edition of menu.ts. Ids, prices and photos must stay in step. */
export const menuDataEn: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Espresso classics',
    items: [
      { id: 'espresso', name: 'Espresso', size: '36 to 40 ml', price: 190, image: 'menu/espresso' },
      { id: 'americano', name: 'Americano', size: '250 ml', price: 190 },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        priceVariants: [
          { size: '250 ml', price: 230 },
          { size: '350 ml', price: 250 },
        ],
        isPopular: true,
        image: 'menu/cappuccino',
      },
      { id: 'latte', name: 'Latte', size: '350 ml', price: 260, image: 'menu/latte-croissant' },
      { id: 'flat-white', name: 'Flat white', size: '250 ml', price: 250 },
      {
        id: 'mocha',
        name: 'Mocha',
        description: 'Espresso, milk and chocolate',
        priceVariants: [
          { size: '250 ml', price: 250 },
          { size: '350 ml', price: 270 },
        ],
      },
      {
        id: 'raf',
        name: 'Raf',
        description: 'Espresso steamed with cream and vanilla sugar',
        priceVariants: [
          { size: '250 ml', price: 280 },
          { size: '350 ml', price: 310 },
        ],
        isPopular: true,
      },
      {
        id: 'raf-urbech',
        name: 'Urbech raf',
        description: 'Raf with urbech, a thick paste of ground nuts',
        size: '350 ml',
        price: 350,
      },
    ],
  },
  {
    id: 'iced',
    name: 'Iced coffee',
    description: 'Over ice, for hot days',
    items: [
      { id: 'iced-latte', name: 'Iced latte', price: 260, image: 'menu/iced-latte' },
      {
        id: 'bumble-orange',
        name: 'Orange bumble',
        description: 'Espresso and orange juice over ice',
        price: 250,
        image: 'menu/bumble-orange',
      },
      {
        id: 'bumble-pomegranate',
        name: 'Pomegranate bumble',
        description: 'Espresso and pomegranate juice over ice',
        price: 250,
      },
      {
        id: 'espresso-tonic',
        name: 'Espresso tonic with lime',
        description: 'Espresso, tonic and lime',
        price: 270,
      },
      {
        id: 'frappe',
        name: 'Frappé',
        description: 'Cold coffee blended with ice',
        price: 350,
        image: 'menu/frappe',
      },
    ],
  },
  {
    id: 'tea',
    name: 'House teas',
    description: 'Brewed on berries, fruit and herbs. The 900 ml pot is for sharing.',
    items: [
      {
        id: 'vitamin',
        name: 'Vitamin burst',
        priceVariants: [
          { size: '350 ml', price: 250 },
          { size: '900 ml pot', price: 450 },
        ],
      },
      {
        id: 'multifruit',
        name: 'Multifruit',
        priceVariants: [
          { size: '350 ml', price: 250 },
          { size: '900 ml pot', price: 450 },
        ],
      },
      {
        id: 'sea-buckthorn-mango',
        name: 'Sea buckthorn and mango',
        priceVariants: [
          { size: '350 ml', price: 250 },
          { size: '900 ml pot', price: 450 },
        ],
      },
      {
        id: 'northern-berries',
        name: 'Northern berries',
        priceVariants: [
          { size: '350 ml', price: 250 },
          { size: '900 ml pot', price: 450 },
        ],
      },
      {
        id: 'citrus-classic',
        name: 'Citrus classic',
        priceVariants: [
          { size: '350 ml', price: 250 },
          { size: '900 ml pot', price: 450 },
        ],
      },
      {
        id: 'cherry-grog',
        name: 'Cherry grog',
        description: 'A hot cherry drink, alcohol free',
        priceVariants: [
          { size: '350 ml', price: 300 },
          { size: '900 ml pot', price: 500 },
        ],
      },
      { id: 'mulled', name: 'Mulled drink', description: 'Alcohol free', size: '350 ml', price: 350 },
      { id: 'tea-classic', name: 'Black or green tea', price: 100 },
    ],
  },
  {
    id: 'not-coffee',
    name: 'Not coffee',
    description: 'For those who came for a book, not for caffeine',
    items: [
      {
        id: 'cocoa',
        image: 'menu/cocoa-cream',
        name: 'Cocoa',
        priceVariants: [
          { size: '250 ml', price: 200 },
          { size: '350 ml', price: 230 },
        ],
      },
      {
        id: 'hot-chocolate',
        name: 'Hot chocolate',
        priceVariants: [
          { size: '250 ml', price: 250 },
          { size: '350 ml', price: 280 },
        ],
      },
      {
        id: 'babyccino',
        name: 'Cocoa babyccino',
        description: 'For children: milk foam with cocoa, no coffee',
        size: '350 ml',
        price: 300,
      },
      { id: 'matcha', name: 'Matcha latte', size: '350 ml', price: 300 },
    ],
  },
  {
    id: 'lemonades',
    name: 'Lemonades',
    description: 'Cold, with ice and fruit',
    items: [
      { id: 'watermelon-mint', name: 'Watermelon and mint', price: 270 },
      { id: 'pomegranate-basil', name: 'Pomegranate and basil', price: 270 },
      { id: 'citrus-mix', name: 'Citrus mix', price: 270 },
      { id: 'berry', name: 'Berry', description: 'Raspberry and strawberry', price: 270 },
      {
        id: 'mojito',
        name: 'Mojito',
        description: 'Lime, lemon, mint and a light fizz',
        price: 280,
        image: 'menu/lemonades',
      },
      { id: 'mojito-passionfruit', name: 'Passion fruit mojito', price: 290 },
      { id: 'mojito-strawberry', name: 'Strawberry mojito', price: 290 },
    ],
  },
  {
    id: 'milkshakes',
    name: 'Milkshakes',
    items: [
      { id: 'shake-vanilla', name: 'Vanilla', price: 290 },
      { id: 'shake-chocolate', name: 'Chocolate', price: 290 },
      { id: 'shake-banana', name: 'Banana', price: 290 },
      { id: 'shake-strawberry', name: 'Strawberry', price: 290 },
    ],
  },
  {
    id: 'smoothies',
    name: 'Smoothies',
    items: [
      { id: 'pineapple-banana', name: 'Pineapple and banana', price: 320 },
      { id: 'kiwi-spinach', name: 'Kiwi and spinach', price: 320 },
      { id: 'mango-strawberry', name: 'Mango and strawberry', price: 320 },
      { id: 'berry-mix', name: 'Berry mix', price: 320 },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts and pastry',
    description: 'The display case changes every day; the barista will tell you the prices',
    items: [
      { id: 'croissants', name: 'Croissants', isPopular: true, image: 'menu/croissants' },
      { id: 'waffle-tubes', name: 'Waffle tubes', isPopular: true, image: 'menu/waffle-tube' },
      {
        id: 'frambini',
        name: 'Frambini',
        description: 'Fresh raspberries in white and dark chocolate',
        isNew: true,
        image: 'menu/frambini',
      },
      { id: 'macarons', name: 'Macarons' },
      { id: 'mochi', name: 'Mochi', size: '2 pcs', image: 'menu/mochi' },
      { id: 'syrniki', name: 'Syrniki with strawberries', size: '2 pcs' },
      {
        id: 'syrniki-gf',
        name: 'Gluten free syrniki',
        description: 'With blueberries and strawberries',
        size: '2 pcs',
      },
      { id: 'fitkit', name: 'FitKit protein cakes' },
      { id: 'snaq', name: 'Snaq Fabriq protein bars' },
      { id: 'nuts', name: 'Nut cookies with condensed milk', size: '150 g' },
      { id: 'marmalade', name: 'Fruit jellies', size: '180 g' },
      { id: 'sandwiches', name: 'Sandwiches', image: 'menu/sandwiches' },
    ],
  },
  {
    id: 'extras',
    name: 'Extras',
    description: 'For any drink',
    items: [
      { id: 'alt-milk', name: 'Plant milk', price: 70 },
      { id: 'honey', name: 'Honey', price: 30 },
      { id: 'marshmallow', name: 'Marshmallow', price: 30 },
      { id: 'citrus-slice', name: 'Lemon, lime or orange', price: 20 },
      { id: 'mint', name: 'Mint', price: 30 },
      { id: 'peanut', name: 'Peanut butter', price: 40 },
      { id: 'urbech', name: 'Urbech', price: 40 },
      { id: 'ginger', name: 'Ginger', price: 30 },
      { id: 'raspberry-jam', name: 'Raspberry jam', price: 30 },
      { id: 'juiceballs', name: 'Juice balls', description: 'Popping pearls filled with juice', price: 60 },
      { id: 'syrup', name: 'Syrup', price: 20 },
    ],
  },
];
