import type { ImageName } from '../generated/image-manifest';

export interface GalleryPhoto {
  image: ImageName;
  alt: { ru: string; en: string };
}

/**
 * The reading room wall, in hanging order. Guest quotes are slotted in by
 * the page between these, so the order here only has to read well as
 * pictures.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { image: 'hall/reader-sofa', alt: { ru: 'Гостья с телефоном на диване под книжными полками', en: 'A guest on the sofa beneath the bookshelves' } },
  { image: 'menu/iced-latte-garden', alt: { ru: 'Айс латте в руке на фоне листвы', en: 'An iced latte held up against the leaves' } },
  { image: 'hall/bookshelf', alt: { ru: 'Полка с собраниями сочинений и хлопком в вазе', en: 'A shelf of collected works and a vase of cotton' } },
  { image: 'hall/window-seat', alt: { ru: 'Столик у окна с круассаном и стаканом кофе', en: 'A window table with a croissant and a cup of coffee' } },
  { image: 'menu/tea-croissants', alt: { ru: 'Чайник домашнего чая и поднос круассанов на мраморной стойке', en: 'A pot of house tea and a tray of croissants on the marble counter' } },
  { image: 'hall/choosing-book', alt: { ru: 'Гостья выбирает книгу с полки', en: 'A guest choosing a book from the shelf' } },
  { image: 'hall/evening-cup', alt: { ru: 'Стакан кофе на фоне вечерней витрины Библиотеки', en: 'A coffee cup against the lit windows of Biblioteka at dusk' } },
  { image: 'menu/mochi', alt: { ru: 'Моти в ладонях и холодный кофе', en: 'Mochi in open palms and an iced coffee' } },
  { image: 'hall/laptop-window', alt: { ru: 'Ноутбук и кофе на столике у окна', en: 'A laptop and a coffee on a table by the window' } },
  { image: 'hall/reading', alt: { ru: 'Гостья читает книгу на диване', en: 'A guest reading a book on the sofa' } },
  { image: 'menu/latte-croissant', alt: { ru: 'Латте в стакане и круассан на пергаменте', en: 'A latte in a glass and a croissant on parchment' } },
  { image: 'hall/sign-cup', alt: { ru: 'Стакан кофе поднят к вывеске BIBΛIOTEKA', en: 'A coffee cup raised to the BIBΛIOTEKA sign' } },
  { image: 'menu/waffle-tube', alt: { ru: 'Вафельная трубочка в крафтовой бумаге', en: 'A waffle tube in kraft paper' } },
  { image: 'hall/bench-outside', alt: { ru: 'Гостья с кофе на скамейке у входа', en: 'A guest with a coffee on the bench outside' } },
  { image: 'menu/cocoa-cream', alt: { ru: 'Горячий напиток со взбитыми сливками в ладонях', en: 'A hot drink topped with whipped cream, held in both hands' } },
  { image: 'hall/book-and-cup', alt: { ru: 'Открытая книга и стакан кофе на коленях', en: 'An open book and a coffee cup on a lap' } },
  { image: 'hall/window-bench', alt: { ru: 'Подоконник с подушками у большого окна', en: 'The cushioned window sill by the tall window' } },
  { image: 'menu/donut', alt: { ru: 'Пончик с глазурью в крафтовой бумаге', en: 'A glazed doughnut in kraft paper' } },
  { image: 'hall/cup-marble', alt: { ru: 'Стакан с логотипом на мраморной стойке', en: 'A cup with the logo on the marble counter' } },
  { image: 'menu/croissants', alt: { ru: 'Два круассана в бумаге', en: 'Two croissants in paper' } },
  { image: 'hall/panorama', alt: { ru: 'Зал: стойка, витрина, лестница и зелёный диван', en: 'The room: counter, display case, staircase and the green sofa' } },
  { image: 'menu/cream-sill', alt: { ru: 'Напиток со сливками на подоконнике', en: 'A drink with whipped cream on the window sill' } },
  { image: 'hall/cups', alt: { ru: 'Стаканы с логотипом Библиотеки', en: 'Cups with the Biblioteka logo' } },
  { image: 'menu/latte-toast', alt: { ru: 'Десерт, обмакнутый в латте', en: 'A pastry dunked into a latte' } },
  { image: 'street/corner', alt: { ru: 'Вход в кофейню: бордовая вывеска и чёрные маркизы', en: 'The café entrance: maroon sign and black awnings' } },
  { image: 'menu/display-sweets', alt: { ru: 'Витрина: вафельные трубочки и пончики', en: 'The display case: waffle tubes and doughnuts' } },
  { image: 'hall/cup-window', alt: { ru: 'Стакан кофе в руке у окна', en: 'A coffee cup held by the window' } },
  { image: 'menu/latte-bar', alt: { ru: 'Латте и круассан на барной стойке под вывеской', en: 'A latte and a croissant on the bar beneath the sign' } },
  { image: 'menu/lemonades', alt: { ru: 'Три лимонада со льдом', en: 'Three lemonades over ice' } },
  { image: 'hall/cup-hand', alt: { ru: 'Стакан с логотипом в руке', en: 'A cup with the logo, in hand' } },
];
