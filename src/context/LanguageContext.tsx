/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

export type Lang = 'ru' | 'en';

const STORAGE_KEY = 'biblioteka-lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  /** A count with its noun in the right plural form: "63 позиции". */
  tn: (key: string, n: number) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') return stored;
  } catch {
    // Private mode / blocked storage: fall through to the default.
  }
  return 'ru';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);

  // Keep the choice across reloads, and keep <html lang> honest so screen
  // readers switch voices with the copy.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Nothing to do if storage is unavailable.
    }
  }, [lang]);

  const t = useCallback((key: string): string => {
    const value = translations[lang]?.[key];
    if (!value) {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation: ${key} [${lang}]`);
      }
      return translations['ru']?.[key] ?? key;
    }
    return value;
  }, [lang]);

  const plurals = useMemo(() => new Intl.PluralRules(lang), [lang]);
  const tn = useCallback(
    (key: string, n: number) => `${n} ${t(`${key}.${plurals.select(n)}`)}`,
    [t, plurals]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// Translations

const translations: Record<Lang, Record<string, string>> = {
  ru: {
    // Shared
    'common.timeRange': 'до',
    'common.from': 'от',
    'common.newTab': 'откроется в новой вкладке',

    // Plural forms (Intl.PluralRules categories)
    'unit.items.one': 'позиция',
    'unit.items.few': 'позиции',
    'unit.items.many': 'позиций',
    'unit.items.other': 'позиции',

    // Brand
    'brand.motto': 'Без книги в мире ночь, без книги мрак кругом',
    'brand.descriptor': 'Кофе и книги',
    'brand.city': 'Нальчик',
    'brand.address': 'Пушкина, 35',
    'brand.addressNote': 'Первый этаж бизнес-центра',

    // Nav
    'nav.home': 'Главная',
    'nav.menu': 'Меню',
    'nav.readingRoom': 'Читальный зал',
    'nav.guestBook': 'Книга отзывов',
    'nav.game': 'Игра',
    'nav.delivery': 'Доставка',
    'nav.deliveryAria': 'Заказать доставку в WhatsApp, откроется в новой вкладке',
    'nav.openMenu': 'Открыть меню',
    'nav.closeMenu': 'Закрыть меню',
    'nav.homeAria': 'Biblioteka, на главную',
    'nav.language': 'Язык',
    'nav.mainAria': 'Основная навигация',

    // Opening hours, live
    'status.openUntil': 'Открыто до',
    'status.opensAt': 'Закрыто, откроемся в',
    'status.opensTomorrow': 'Закрыто, откроемся завтра в',
    'status.ramadan': 'часы на Рамадан',
    'status.daily': 'Ежедневно',

    // Loader
    'loader.status': 'Загрузка',

    // Hero
    'hero.coffee': 'Кофе',
    'hero.and': 'и',
    'hero.books': 'книги',
    'hero.ctaMenu': 'Открыть меню',
    'hero.openBook': 'Открыть книгу',
    'hero.readOn': 'Читать дальше',
    'hero.plateAlt': 'Зал Библиотеки: мраморная стойка, вывеска BIBΛIOTEKA и лестница с книжными полками',

    // Foreword
    'foreword.title': 'Предисловие',
    'foreword.line1': 'Библиотека живёт на первом этаже бизнес-центра: под лестницей полки с книгами, у окна широкий подоконник с подушками, а за мраморной стойкой',
    'foreword.line1em': 'варят кофе.',
    'foreword.line2': 'Книгу можно снять с полки и читать здесь же,',
    'foreword.line2em': 'пока остывает раф.',
    'foreword.statOpen': 'открываемся',
    'foreword.statClose': 'закрываемся',
    'foreword.statStreet': 'Пушкина',

    // Menu preview
    'menuPreview.lead': 'Каждая позиция в нашем меню',
    'menuPreview.title': 'Продумана',
    'menuPreview.titleAccent': 'до деталей',
    'menuPreview.cta': 'Открыть всё меню',

    // Menu, shared
    'menu.inDisplay': 'в витрине',
    'menu.popular': 'любимое',
    'menu.new': 'новинка',

    // Night band
    'night.eyebrow': 'Читальный зал',
    'night.line1': 'Без книги в мире ночь,',
    'night.line2': 'без книги мрак кругом.',
    'night.text': 'Это девиз с нашего логотипа. Поэтому под лестницей стоят полки: берите любую книгу и читайте за чашкой кофе.',
    'night.cta': 'Заглянуть в читальный зал',
    'night.altShelf': 'Книжная полка в Библиотеке',
    'night.altSofa': 'Гостья читает на диване под лестницей',
    'night.altEvening': 'Стакан кофе с логотипом на фоне вечерней витрины',
    'night.altChoosing': 'Гостья выбирает книгу с полки',
    'night.altWindow': 'Подоконник с подушками у большого окна',

    // Visit
    'visit.text': 'Угол здания с бордовыми вывесками и чёрными маркизами, в 50 метрах от остановки «Городская администрация».',
    'visit.ramadanNote': 'В Рамадан работаем с 8:00 до 20:00',
    'visit.route': 'Маршрут в Яндекс Картах',
    'visit.mapAlt': 'Схема улиц вокруг кофейни: Библиотека на улице Пушкина у перекрёстка с улицей Чехова, рядом с остановкой «Городская администрация», между проспектами Ленина и Шогенцукова',
    'visit.mapCredit': '© участники OpenStreetMap',
    'visit.stop': 'ост. «Городская администрация»',
    'visit.north': 'С',
    'visit.street.pushkina': 'ул. Пушкина',
    'visit.street.chekhova': 'ул. Чехова',
    'visit.street.keshokova': 'ул. Кешокова',
    'visit.street.lenina': 'пр. Ленина',
    'visit.street.shogentsukova': 'пр. Шогенцукова',
    'visit.street.nogmova': 'ул. Ногмова',

    // Footer
    'footer.contents': 'Содержание',
    'footer.route': 'Маршрут в Яндекс Картах',
    'footer.entrepreneur': 'ИП Курданова Алена Альбертовна',
    'footer.inn': 'ИНН',
    'footer.ogrnip': 'ОГРНИП',
    'footer.creditAria': 'Сайт сделали Lumako, откроется в новой вкладке',

    // Footer game: first lines
    'game.eyebrow': 'Игра для читателей',
    'game.title1': 'Угадайте книгу',
    'game.title2': 'по первой строке',
    'game.lede': 'Строка печатается на глазах. Узнали раньше, получили больше: до трёх очков за ответ и ещё пять за каждые пять верных подряд.',
    'game.teaser': 'Первая строка уже заправлена в машинку.',
    'game.start': 'Начать',
    'game.next': 'Следующая строка',
    'game.round': 'Строка',
    'game.stageLabel': 'Первая строка и варианты ответа',
    'game.options': 'Из какой это книги',
    'game.score': 'Очки',
    'game.streak': 'Подряд',
    'game.best': 'Рекорд',
    'game.shelf': 'Книг на полке',
    'game.shelfEmpty': 'Каждый верный ответ ставит сюда книгу',
    'game.right': 'Зачтено',
    'game.wrong': 'Мимо',
    'game.bonus': 'за серию',
    'game.answerWas': 'Правильный ответ',
    'game.points.one': 'очко',
    'game.points.few': 'очка',
    'game.points.many': 'очков',
    'game.points.other': 'очка',

    // Menu page
    'menuPage.title': 'Меню',
    'menuPage.delivery': 'Доставка',
    'menuPage.call': 'Позвонить',
    'menuPage.chaptersAria': 'Разделы меню',
    'menuPage.ctaTitle': 'Заказать с доставкой',

    // Reading room
    'reading.title': 'Читальный зал',
    'reading.subtitle': 'Полки под лестницей, подоконник с подушками и кофе, который успевает остыть, пока дочитываешь главу. Так выглядит обычный день в Библиотеке.',
    'reading.quoteSource': 'отзыв на Яндекс Картах',
    'reading.moreTitle': 'Новые кадры каждый день',
    'reading.moreText': 'Новинки витрины, гости и книги с полки: всё это мы показываем в Instagram.',
    'reading.moreCta': 'Открыть Instagram',

    // Guest book
    'reviews.eyebrow': 'Обратная связь',
    'reviews.title1': 'Книга',
    'reviews.title2': 'отзывов',
    'reviews.subtitle': 'Расскажите, как прошёл ваш визит. Запись придёт нам в WhatsApp, и её прочитает команда кофейни.',
    'reviews.formLabel': 'Письмо в Библиотеку',
    'reviews.salutation': 'Дорогая Библиотека!',
    'reviews.ratingLabel': 'Оценка',
    'reviews.markLead': 'Ставлю вам',
    'reviews.ratingOf': 'из 5',
    'reviews.grade1': 'ужасно',
    'reviews.grade2': 'плохо',
    'reviews.grade3': 'нормально',
    'reviews.grade4': 'хорошо',
    'reviews.grade5': 'отлично',
    'reviews.reviewLabel': 'Ваш отзыв',
    'reviews.reviewPlaceholder': 'Что понравилось, что стоит исправить, какой книги не хватает на полке',
    'reviews.prompt1': 'Что случилось?',
    'reviews.prompt2': 'Что пошло не так?',
    'reviews.prompt3': 'Что стоит исправить в первую очередь?',
    'reviews.prompt4': 'Чего не хватило до пятёрки?',
    'reviews.prompt5': 'Что понравилось больше всего?',
    'reviews.signOff': 'С уважением,',
    'reviews.nameLabel': 'Имя',
    'reviews.namePlaceholder': 'ваше имя',
    'reviews.postscript': 'P.S. Для ответа:',
    'reviews.contactLabel': 'Контакт для ответа',
    'reviews.contactPlaceholder': 'телефон или Telegram',
    'reviews.optional': 'по желанию',
    'reviews.submit': 'Отправить в WhatsApp',
    'reviews.hint': 'Поставьте оценку и напишите отзыв',
    'reviews.needMark': 'Поставьте оценку',
    'reviews.needText': 'Напишите хотя бы пару слов',
    'reviews.successTitle': 'Спасибо за письмо',
    'reviews.successText': 'Мы открыли WhatsApp с вашим отзывом. Осталось нажать «Отправить» в чате.',
    'reviews.successRetryLead': 'WhatsApp не открылся?',
    'reviews.successRetry': 'Открыть ещё раз',
    'reviews.successPublic': 'Хотите, чтобы отзыв увидели другие гости?',
    'reviews.successPublicCta': 'Оставьте его и на Яндекс Картах',
    'reviews.another': 'Написать ещё один отзыв',
    'reviews.messageHeader': 'Отзыв с сайта Biblioteka',
    'reviews.messageRating': 'Оценка',
    'reviews.messageName': 'Имя',
    'reviews.messageContact': 'Контакт',

    // 404
    'notFound.eyebrow': 'Ошибка 404',
    'notFound.title': 'Этой страницы нет в каталоге',
    'notFound.text': 'Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную или загляните в меню.',
    'notFound.home': 'На главную',

    // Accessibility
    'a11y.skipToContent': 'К содержимому',
  },

  en: {
    // Shared
    'common.timeRange': 'to',
    'common.from': 'from',
    'common.newTab': 'opens in a new tab',

    // Plural forms
    'unit.items.one': 'item',
    'unit.items.other': 'items',

    // Brand
    'brand.motto': 'Without a book the world is night, without a book all is dark',
    'brand.descriptor': 'Coffee and books',
    'brand.city': 'Nalchik',
    'brand.address': '35 Pushkina Street',
    'brand.addressNote': 'Ground floor of the business centre',

    // Nav
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.readingRoom': 'Reading room',
    'nav.guestBook': 'Guest book',
    'nav.game': 'Game',
    'nav.delivery': 'Delivery',
    'nav.deliveryAria': 'Order delivery on WhatsApp, opens in a new tab',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.homeAria': 'Biblioteka, home',
    'nav.language': 'Language',
    'nav.mainAria': 'Main navigation',

    // Opening hours, live
    'status.openUntil': 'Open until',
    'status.opensAt': 'Closed, opens at',
    'status.opensTomorrow': 'Closed, opens tomorrow at',
    'status.ramadan': 'Ramadan hours',
    'status.daily': 'Daily',

    // Loader
    'loader.status': 'Loading',

    // Hero
    'hero.coffee': 'Coffee',
    'hero.and': 'and',
    'hero.books': 'books',
    'hero.ctaMenu': 'Open the menu',
    'hero.openBook': 'Open the book',
    'hero.readOn': 'Read on',
    'hero.plateAlt': 'Inside Biblioteka: the marble counter, the BIBΛIOTEKA sign and the staircase lined with bookshelves',

    // Foreword
    'foreword.title': 'Foreword',
    'foreword.line1': 'Biblioteka lives on the ground floor of a business centre: bookshelves under the stairs, a wide window sill with cushions, and',
    'foreword.line1em': 'coffee brewed at the marble counter.',
    'foreword.line2': 'Take a book off the shelf and read it right here',
    'foreword.line2em': 'while your raf cools.',
    'foreword.statOpen': 'we open',
    'foreword.statClose': 'we close',
    'foreword.statStreet': 'Pushkina St',

    // Menu preview
    'menuPreview.lead': 'Every item on our menu is',
    'menuPreview.title': 'Crafted',
    'menuPreview.titleAccent': 'to perfection',
    'menuPreview.cta': 'Open the full menu',

    // Menu, shared
    'menu.inDisplay': 'in the case',
    'menu.popular': 'favourite',
    'menu.new': 'new',

    // Night band
    'night.eyebrow': 'Reading room',
    'night.line1': 'Without a book the world is night,',
    'night.line2': 'without a book all is dark.',
    'night.text': 'That is the motto on our logo, and the reason for the shelves under the stairs: take any book and read it over a cup of coffee.',
    'night.cta': 'Step into the reading room',
    'night.altShelf': 'A bookshelf at Biblioteka',
    'night.altSofa': 'A guest reading on the sofa under the stairs',
    'night.altEvening': 'A coffee cup with the logo against the lit windows at dusk',
    'night.altChoosing': 'A guest choosing a book from the shelf',
    'night.altWindow': 'The cushioned window sill by the tall window',

    // Visit
    'visit.text': 'The corner of the building with the maroon signs and black awnings, 50 metres from the Gorodskaya Administratsiya stop.',
    'visit.ramadanNote': 'During Ramadan we are open 8:00 to 20:00',
    'visit.route': 'Directions in Yandex Maps',
    'visit.mapAlt': 'Map of the streets around the café: Biblioteka on Pushkina Street by its junction with Chekhova Street, near the Gorodskaya Administratsiya stop, between Lenina and Shogentsukova avenues',
    'visit.mapCredit': '© OpenStreetMap contributors',
    'visit.stop': 'Gorodskaya Administratsiya stop',
    'visit.north': 'N',
    'visit.street.pushkina': 'Pushkina St',
    'visit.street.chekhova': 'Chekhova St',
    'visit.street.keshokova': 'Keshokova St',
    'visit.street.lenina': 'Lenina Ave',
    'visit.street.shogentsukova': 'Shogentsukova Ave',
    'visit.street.nogmova': 'Nogmova St',

    // Footer
    'footer.contents': 'Contents',
    'footer.route': 'Directions in Yandex Maps',
    'footer.entrepreneur': 'Sole proprietor Alena A. Kurdanova',
    'footer.inn': 'INN',
    'footer.ogrnip': 'OGRNIP',
    'footer.creditAria': 'Site by Lumako, opens in a new tab',

    // Footer game: first lines
    'game.eyebrow': 'A game for readers',
    'game.title1': 'Name the book',
    'game.title2': 'from its first line',
    'game.lede': 'The line types itself out as you watch. Know it sooner, score more: up to three points an answer, and five more for every five in a row.',
    'game.teaser': 'The first line is already in the typewriter.',
    'game.start': 'Start',
    'game.next': 'Next line',
    'game.round': 'Line',
    'game.stageLabel': 'The first line and the answers',
    'game.options': 'Which book is it from',
    'game.score': 'Score',
    'game.streak': 'In a row',
    'game.best': 'Best',
    'game.shelf': 'Books on the shelf',
    'game.shelfEmpty': 'Every right answer puts a book here',
    'game.right': 'Well read',
    'game.wrong': 'Missed',
    'game.bonus': 'streak bonus',
    'game.answerWas': 'The answer was',
    'game.points.one': 'point',
    'game.points.other': 'points',

    // Menu page
    'menuPage.title': 'Menu',
    'menuPage.delivery': 'Delivery',
    'menuPage.call': 'Call',
    'menuPage.chaptersAria': 'Menu sections',
    'menuPage.ctaTitle': 'Order for delivery',

    // Reading room
    'reading.title': 'Reading room',
    'reading.subtitle': 'Shelves under the stairs, a cushioned window sill and coffee that has time to cool while you finish the chapter. An ordinary day at Biblioteka.',
    'reading.quoteSource': 'review on Yandex Maps, translated from Russian',
    'reading.moreTitle': 'New pictures every day',
    'reading.moreText': 'New things in the display case, our guests and books from the shelf: we post them all on Instagram.',
    'reading.moreCta': 'Open Instagram',

    // Guest book
    'reviews.eyebrow': 'Feedback',
    'reviews.title1': 'Guest',
    'reviews.title2': 'book',
    'reviews.subtitle': 'Tell us how your visit went. Your note comes to us on WhatsApp, and the café team reads every one.',
    'reviews.formLabel': 'Letter to Biblioteka',
    'reviews.salutation': 'Dear Biblioteka,',
    'reviews.ratingLabel': 'Rating',
    'reviews.markLead': 'I give you',
    'reviews.ratingOf': 'out of 5',
    'reviews.grade1': 'terrible',
    'reviews.grade2': 'poor',
    'reviews.grade3': 'okay',
    'reviews.grade4': 'good',
    'reviews.grade5': 'excellent',
    'reviews.reviewLabel': 'Your review',
    'reviews.reviewPlaceholder': 'What you liked, what we should fix, which book is missing from the shelf',
    'reviews.prompt1': 'What happened?',
    'reviews.prompt2': 'What went wrong?',
    'reviews.prompt3': 'What should we fix first?',
    'reviews.prompt4': 'What kept it from a five?',
    'reviews.prompt5': 'What did you like most?',
    'reviews.signOff': 'Yours,',
    'reviews.nameLabel': 'Name',
    'reviews.namePlaceholder': 'your name',
    'reviews.postscript': 'P.S. Reply to me at',
    'reviews.contactLabel': 'Where to reply',
    'reviews.contactPlaceholder': 'phone or Telegram',
    'reviews.optional': 'optional',
    'reviews.submit': 'Send on WhatsApp',
    'reviews.hint': 'Choose a rating and write your review',
    'reviews.needMark': 'Choose a rating',
    'reviews.needText': 'Write a few words',
    'reviews.successTitle': 'Thank you for writing',
    'reviews.successText': 'We opened WhatsApp with your review. All that is left is to press Send in the chat.',
    'reviews.successRetryLead': 'WhatsApp did not open?',
    'reviews.successRetry': 'Open it again',
    'reviews.successPublic': 'Want other guests to see it?',
    'reviews.successPublicCta': 'Leave it on Yandex Maps too',
    'reviews.another': 'Write another review',
    'reviews.messageHeader': 'Review from the Biblioteka website',
    'reviews.messageRating': 'Rating',
    'reviews.messageName': 'Name',
    'reviews.messageContact': 'Contact',

    // 404
    'notFound.eyebrow': 'Error 404',
    'notFound.title': 'This page is not in the catalogue',
    'notFound.text': 'The link may be out of date or the address may contain a typo. Head back home or take a look at the menu.',
    'notFound.home': 'Back home',

    // Accessibility
    'a11y.skipToContent': 'Skip to content',
  },
};
