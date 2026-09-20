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

export type Lang = 'ar' | 'en';

const STORAGE_KEY = 'bloom-lang';

/** Arabic is the default: this is a Madinah roastery selling to Madinah. */
const DEFAULT_LANG: Lang = 'ar';

interface LanguageContextValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  /**
   * +1 in LTR, -1 in RTL.
   *
   * `transform` has no logical equivalent and the proposal for one is still
   * open at the W3C, so `translateX` keeps its sign when the document flips.
   * Motion's `x` prop is `translateX`, so every horizontal entrance offset
   * has to be multiplied by this or it will animate the wrong way in Arabic.
   */
  sign: 1 | -1;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    // Private mode or blocked storage: fall through to the default.
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  // Keep the choice across reloads, and keep <html lang> and <html dir>
  // honest: dir drives every logical property in the stylesheet, and lang
  // makes screen readers switch voices with the copy.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Nothing to do if storage is unavailable.
    }
  }, [lang, dir]);

  const t = useCallback(
    (key: string): string => {
      const value = translations[lang]?.[key];
      if (value === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`Missing translation: ${key} [${lang}]`);
        }
        return translations[DEFAULT_LANG]?.[key] ?? key;
      }
      return value;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, dir, sign: (dir === 'rtl' ? -1 : 1) as 1 | -1, setLang, t }),
    [lang, dir, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// Translations

const translations: Record<Lang, Record<string, string>> = {
  ar: {
    'common.timeRange': 'إلى',
    'common.currency': 'ر.س',
    'common.calories': 'سعرة',
    'common.and': 'و',

    'nav.home': 'الرئيسية',
    'nav.menu': 'المنيو',
    'nav.roastery': 'المحمصة',
    'nav.branches': 'الفروع',
    'nav.contact': 'تواصل',
    'nav.openMenu': 'فتح القائمة',
    'nav.closeMenu': 'إغلاق القائمة',
    'nav.shop': 'المتجر',

    'hero.eyebrow': 'قهوة مختصة',
    'hero.line1': 'وُلدت',
    'hero.line2': 'في المدينة',
    'hero.line3': 'ونواصل الازدهار',

    'story.label': 'عن بلوم',
    'story.since': 'منذ ٢٠١٨',
    'story.lead': 'اسمنا يأتي من الازدهار.',
    'story.body1': 'محمصة ومقهى في المدينة المنورة، نعمل على الارتقاء بمستوى القهوة في المنطقة.',
    'story.body2': 'نسعى أن نكون منصة لنشر المعرفة حول القهوة المختصة: أنواعها ومصادرها، وطرق طحنها وتحضيرها.',
    'story.statBranches': 'فروع',
    'story.statOrigins': 'محاصيل',
    'story.statItems': 'صنفًا',

    'menu.label': 'المنيو',
    'menu.headerLead': 'كل كوب وكل طبق',
    'menu.headerAccent': 'محسوب بدقة',
    'menu.cta': 'المنيو كاملًا',
    'menu.count': '٥٣ صنفًا',
    'menu.title': 'المنيو',
    'menu.itemsLabel': 'صنفًا',
    'menu.pricesNote': 'الأسعار بالريال السعودي وتشمل الضريبة.',

    'roastery.label': 'المحمصة',
    'roastery.title1': 'نحمّص',
    'roastery.title2': 'على لورينغ',
    'roastery.body': 'نحمّص على لورينغ S15 فالكون، وهي محمصة بهواء ساخن مغلق الدورة، تمنحنا تحكمًا دقيقًا في منحنى التحميص وتقلل الدخان إلى أدنى حد.',
    'roastery.machine': 'لورينغ S15 فالكون',
    'roastery.originsLabel': 'محاصيلنا',
    'roastery.originsNote': 'محاصيل مفردة وخلطة البيت.',
    'roastery.shopLead': 'الحبوب وأدوات التحضير في متجرنا.',
    'roastery.shopCta': 'زيارة المتجر',

    'branches.label': 'الفروع',
    'branches.title1': 'أين',
    'branches.title2': 'تجدنا',
    'branches.daily': 'يوميًا',
    'branches.comingSoon': 'قريبًا',
    'branches.viewMap': 'الموقع على الخريطة',
    'branches.reviews': 'تقييم',
    'branches.openedIn': 'افتتح',

    'contact.label': 'تواصل',
    'contact.title1': 'تحدث',
    'contact.title2': 'إلينا',
    'contact.subtitle': 'للاستفسارات والطلبات الخاصة والتوريد للشركات.',
    'contact.callUs': 'اتصل',
    'contact.whatsapp': 'واتساب',
    'contact.email': 'البريد',
    'contact.follow': 'تابعنا',
    'contact.visit': 'زورنا',
    'contact.formName': 'الاسم',
    'contact.formMessage': 'رسالتك',
    'contact.formSend': 'إرسال',
    'contact.formNote': 'أو تواصل معنا مباشرة عبر واتساب.',

    'footer.tagline': 'قهوة مختصة من المدينة المنورة',
    'footer.navigation': 'تصفح',
    'footer.contacts': 'تواصل',
    'footer.legal': 'بيانات نظامية',
    'footer.cr': 'السجل التجاري',
    'footer.vat': 'الرقم الضريبي',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.creditAria': 'صُمم الموقع بواسطة لوماكو، يفتح في تبويب جديد',

    'notFound.eyebrow': 'الصفحة غير موجودة',
    'notFound.title': 'يبدو أن هذا الكوب قد فرغ',
    'notFound.text': 'لا توجد صفحة على هذا العنوان. قد يكون الرابط قديمًا أو به خطأ.',
    'notFound.home': 'إلى الرئيسية',

    'a11y.skipToContent': 'تخطٍ إلى المحتوى',
    'a11y.language': 'اللغة',
  },

  en: {
    'common.timeRange': 'to',
    'common.currency': 'SAR',
    'common.calories': 'cal',
    'common.and': 'and',

    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.roastery': 'Roastery',
    'nav.branches': 'Branches',
    'nav.contact': 'Contact',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.shop': 'Shop',

    'hero.eyebrow': 'Specialty Coffee',
    'hero.line1': 'Born in',
    'hero.line2': 'Madinah',
    'hero.line3': 'growing beyond',

    'story.label': 'About Bloom',
    'story.since': 'Since 2018',
    'story.lead': 'Our name comes from izdihar: to bloom.',
    'story.body1': 'A roastery and cafe in Madinah, working to raise the level of coffee in the region.',
    'story.body2': 'We want to be a platform for specialty coffee knowledge: where it grows, how it is ground, and every way it can be brewed.',
    'story.statBranches': 'branches',
    'story.statOrigins': 'origins',
    'story.statItems': 'items',

    'menu.label': 'Menu',
    'menu.headerLead': 'Every cup and every plate',
    'menu.headerAccent': 'measured precisely',
    'menu.cta': 'See the full menu',
    'menu.count': '53 items',
    'menu.title': 'Menu',
    'menu.itemsLabel': 'items',
    'menu.pricesNote': 'Prices in Saudi riyals, tax included.',

    'roastery.label': 'The Roastery',
    'roastery.title1': 'Roasted',
    'roastery.title2': 'on a Loring',
    'roastery.body': 'We roast on a Loring S15 Falcon, a closed loop hot air roaster that gives us fine control over the curve and cuts smoke to a minimum.',
    'roastery.machine': 'Loring S15 Falcon',
    'roastery.originsLabel': 'Our lots',
    'roastery.originsNote': 'Single origins and the house blend.',
    'roastery.shopLead': 'Beans and brewing gear live in our shop.',
    'roastery.shopCta': 'Visit the shop',

    'branches.label': 'Branches',
    'branches.title1': 'Where',
    'branches.title2': 'to find us',
    'branches.daily': 'daily',
    'branches.comingSoon': 'Coming soon',
    'branches.viewMap': 'Open in maps',
    'branches.reviews': 'reviews',
    'branches.openedIn': 'Opened',

    'contact.label': 'Contact',
    'contact.title1': 'Talk',
    'contact.title2': 'to us',
    'contact.subtitle': 'For enquiries, special orders and wholesale.',
    'contact.callUs': 'Call',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.follow': 'Follow',
    'contact.visit': 'Visit',
    'contact.formName': 'Name',
    'contact.formMessage': 'Your message',
    'contact.formSend': 'Send',
    'contact.formNote': 'Or reach us directly on WhatsApp.',

    'footer.tagline': 'Specialty coffee from Madinah',
    'footer.navigation': 'Browse',
    'footer.contacts': 'Contact',
    'footer.legal': 'Legal',
    'footer.cr': 'Commercial register',
    'footer.vat': 'VAT number',
    'footer.rights': 'All rights reserved',
    'footer.creditAria': 'Site by Lumako, opens in a new tab',

    'notFound.eyebrow': 'Page not found',
    'notFound.title': 'Looks like this cup is already empty',
    'notFound.text': 'There is no page at this address. The link may be out of date or contain a typo.',
    'notFound.home': 'Back home',

    'a11y.skipToContent': 'Skip to content',
    'a11y.language': 'Language',
  },
};
