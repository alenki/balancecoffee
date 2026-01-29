/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'ru' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru');

  const t = useCallback((key: string): string => {
    const value = translations[lang]?.[key];
    if (!value) {
      console.warn(`Missing translation: ${key} [${lang}]`);
      return translations['ru']?.[key] ?? key;
    }
    return value;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// ─── Translations ───────────────────────────────────────────────

const translations: Record<Lang, Record<string, string>> = {
  ru: {
    // Nav
    'nav.home': 'Главная',
    'nav.menu': 'Меню',
    'nav.daily': 'Daily',
    'nav.vacancies': 'Вакансии',
    'nav.feedback': 'Обратная связь',
    'nav.openMenu': 'Открыть меню',
    'nav.closeMenu': 'Закрыть меню',

    // Hero
    'hero.line1': 'Кофе,',
    'hero.line2': 'созданный',
    'hero.line3': 'с намерением',

    // About
    'about.label': 'О нас',
    'about.manifesto1': '5 лет назад мы открыли Balance Coffee с одной простой идеей — создать пространство,',
    'about.manifesto1em': 'где современные, прогрессивные и деятельные люди',
    'about.manifesto1end': 'могли бы собираться вместе, обмениваться идеями и вдохновляться друг другом.',
    'about.manifesto2': 'Сегодня наши кофейни посещает более 6000 таких удивительных людей каждый день. Мы мечтаем объединить таких людей по всей территории',
    'about.manifesto2em': 'России и за её пределами.',
    'about.statCities': 'городов',
    'about.statCafes': 'кофеен',
    'about.statItems': 'позиций',

    // Menu Preview
    'menuPreview.label': 'Меню',
    'menuPreview.itemCount': '50+ позиций',
    'menuPreview.headerItalic': 'Каждая позиция в нашем меню —',
    'menuPreview.headerBold1': 'Продумана',
    'menuPreview.headerBold2': 'до деталей',
    'menuPreview.cta': 'Смотреть меню',
    'menuPreview.from': 'от',
    'badge.new': 'Новинка',
    'badge.hit': 'Хит',

    // Gallery
    'gallery.manifesto1': 'Мы за',
    'gallery.manifesto2': 'уникальную',
    'gallery.manifesto3': 'эстетику',
    'gallery.text': 'Мы за красивое и хорошее, творить и делиться.\nМы за уникальную эстетику.',

    // Cafes
    'cafes.label': 'Кофейни',
    'cafes.cityCount': 'городов',
    'cafes.headerItalic': 'Мы по всей России',
    'cafes.headerBold1': 'Наши',
    'cafes.headerBold2': 'кофейни',
    'cafes.cafe1': 'кофейня',
    'cafes.cafe2to4': 'кофейни',
    'cafes.cafe5plus': 'кофеен',
    'cafes.soonLabel': 'Скоро открытие',
    'cafes.soon': 'скоро',
    'cafes.statCities': 'городов',
    'cafes.statCafes': 'кофеен',
    'cafes.cta': 'Связаться с нами',

    // Footer
    'footer.tagline': 'Кофе, созданный с намерением',
    'footer.geography': 'География',
    'footer.ourCafes': 'Наши\nкофейни',
    'footer.navigation': 'Навигация',
    'footer.ourPages': 'Наши\nстраницы',
    'footer.contacts': 'Контакты',
    'footer.contactUs': 'Свяжитесь\nс нами',
    'footer.home': 'Главная',
    'footer.menu': 'Меню',
    'footer.daily': 'Daily',
    'footer.reviews': 'Отзывы',
    'footer.descriptor': 'Кофе, выпечка, свежевыжатые соки',

    // Menu Page
    'menuPage.title': 'Меню',
    'menuPage.items': 'позиций',
    'menuPage.delivery': 'Доставка',
    'menuPage.call': 'Позвонить',
    'menuPage.ctaItalic': 'Свяжитесь любым удобным способом —',
    'menuPage.ctaTitle': 'Готовы сделать заказ?',

    // Daily Page
    'daily.subtitle': 'Добро пожаловать в журнал Balance Coffee.\nЗдесь мы делимся вдохновением, моментами и атмосферой,\nкоторые делают каждый день особенным.',
    'daily.quote1': 'Каждая чашка кофе — маленькое путешествие. От Эфиопии до Бразилии, от зерна до аромата.',
    'daily.quote2': 'Кофе — это не просто напиток. Это момент паузы в бесконечном ритме жизни.',

    // Reviews Page
    'reviews.eyebrow': 'Ваше мнение важно',
    'reviews.title1': 'Оставить',
    'reviews.title2': 'отзыв',
    'reviews.subtitle': 'Расскажите о вашем опыте — каждый отзыв помогает нам становиться лучше и создавать для вас идеальный кофе',
    'reviews.cafeLabel': 'Кофейня',
    'reviews.cafePlaceholder': 'Выберите кофейню',
    'reviews.contactLabel': 'Контакт для связи',
    'reviews.contactPlaceholder': 'Телефон, email или Telegram',
    'reviews.reviewLabel': 'Ваш отзыв',
    'reviews.charCount': 'симв.',
    'reviews.reviewPlaceholder': 'Поделитесь впечатлениями о кофейне, напитках, атмосфере...',
    'reviews.submit': 'Отправить отзыв',
    'reviews.altContact': 'или свяжитесь напрямую',
    'reviews.phone': 'Телефон',
    'reviews.successTitle1': 'Спасибо за',
    'reviews.successTitle2': 'обратную связь',
    'reviews.successText': 'Мы обязательно прочитаем ваш отзыв и постараемся стать ещё лучше. Ваше мнение — наш ориентир.',
    'reviews.another': 'Оставить ещё один отзыв',
  },

  en: {
    // Nav
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.daily': 'Daily',
    'nav.vacancies': 'Careers',
    'nav.feedback': 'Feedback',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    // Hero
    'hero.line1': 'Coffee,',
    'hero.line2': 'crafted',
    'hero.line3': 'with intention',

    // About
    'about.label': 'About us',
    'about.manifesto1': '5 years ago we opened Balance Coffee with one simple idea — to create a space',
    'about.manifesto1em': 'where modern, progressive and driven people',
    'about.manifesto1end': 'could come together, exchange ideas and inspire each other.',
    'about.manifesto2': 'Today our cafés welcome over 6,000 such amazing people every day. We dream of uniting these people across',
    'about.manifesto2em': 'Russia and beyond.',
    'about.statCities': 'cities',
    'about.statCafes': 'cafés',
    'about.statItems': 'items',

    // Menu Preview
    'menuPreview.label': 'Menu',
    'menuPreview.itemCount': '50+ items',
    'menuPreview.headerItalic': 'Every item on our menu is —',
    'menuPreview.headerBold1': 'Crafted',
    'menuPreview.headerBold2': 'to perfection',
    'menuPreview.cta': 'View menu',
    'menuPreview.from': 'from',
    'badge.new': 'New',
    'badge.hit': 'Popular',

    // Gallery
    'gallery.manifesto1': 'We stand for',
    'gallery.manifesto2': 'unique',
    'gallery.manifesto3': 'aesthetics',
    'gallery.text': 'We believe in beauty and craft, in creating and sharing.\nWe stand for unique aesthetics.',

    // Cafes
    'cafes.label': 'Cafés',
    'cafes.cityCount': 'cities',
    'cafes.headerItalic': 'Across Russia',
    'cafes.headerBold1': 'Our',
    'cafes.headerBold2': 'cafés',
    'cafes.cafe1': 'café',
    'cafes.cafe2to4': 'cafés',
    'cafes.cafe5plus': 'cafés',
    'cafes.soonLabel': 'Coming soon',
    'cafes.soon': 'soon',
    'cafes.statCities': 'cities',
    'cafes.statCafes': 'cafés',
    'cafes.cta': 'Contact us',

    // Footer
    'footer.tagline': 'Coffee, crafted with intention',
    'footer.geography': 'Geography',
    'footer.ourCafes': 'Our\ncafés',
    'footer.navigation': 'Navigation',
    'footer.ourPages': 'Our\npages',
    'footer.contacts': 'Contacts',
    'footer.contactUs': 'Get in\ntouch',
    'footer.home': 'Home',
    'footer.menu': 'Menu',
    'footer.daily': 'Daily',
    'footer.reviews': 'Reviews',
    'footer.descriptor': 'Coffee, pastry, fresh juices',

    // Menu Page
    'menuPage.title': 'Menu',
    'menuPage.items': 'items',
    'menuPage.delivery': 'Delivery',
    'menuPage.call': 'Call us',
    'menuPage.ctaItalic': 'Reach out any way you prefer —',
    'menuPage.ctaTitle': 'Ready to order?',

    // Daily Page
    'daily.subtitle': 'Welcome to the Balance Coffee journal.\nHere we share inspiration, moments and the atmosphere\nthat make every day special.',
    'daily.quote1': 'Every cup of coffee is a small journey. From Ethiopia to Brazil, from bean to aroma.',
    'daily.quote2': 'Coffee is not just a drink. It is a moment of pause in the endless rhythm of life.',

    // Reviews Page
    'reviews.eyebrow': 'Your opinion matters',
    'reviews.title1': 'Leave',
    'reviews.title2': 'feedback',
    'reviews.subtitle': 'Tell us about your experience — every review helps us improve and craft the perfect coffee for you',
    'reviews.cafeLabel': 'Café',
    'reviews.cafePlaceholder': 'Select a café',
    'reviews.contactLabel': 'Contact info',
    'reviews.contactPlaceholder': 'Phone, email or Telegram',
    'reviews.reviewLabel': 'Your review',
    'reviews.charCount': 'chars',
    'reviews.reviewPlaceholder': 'Share your impressions about the café, drinks, atmosphere...',
    'reviews.submit': 'Submit review',
    'reviews.altContact': 'or contact us directly',
    'reviews.phone': 'Phone',
    'reviews.successTitle1': 'Thank you for',
    'reviews.successTitle2': 'your feedback',
    'reviews.successText': 'We will carefully read your review and strive to get even better. Your opinion is our compass.',
    'reviews.another': 'Leave another review',
  },
};
