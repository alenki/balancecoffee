import type { ContactInfo, Origin } from '../types';

/**
 * Company contact and legal identity, taken from their own storefront.
 *
 * The one number, +966 55 313 1751, is both the published line and the
 * WhatsApp number, and covers every branch.
 */
export const contactInfo: ContactInfo = {
  phone: '+966 55 313 1751',
  phoneHref: 'tel:+966553131751',
  whatsapp: 'https://wa.me/966553131751',
  email: 'info@br.sa.com',
  instagram: 'https://www.instagram.com/bloomroastery/',
  snapchat: 'https://www.snapchat.com/add/bloomroastery/',
  tiktok: 'https://tiktok.com/@bloomroastery',
  x: 'https://x.com/bloomroastery',
  shop: 'https://br.sa.com',
  menu: 'https://bloom-roastery.yallaqrcodes.com',
  // Chain wide. Weekends run later at some branches, so the site states the
  // baseline rather than a per-branch table that would go stale.
  hours: { start: '6:00', end: '2:00' },
  legal: {
    company: {
      ar: 'شركة مقهى ازدهار القهوة لتقديم المشروبات القابضة',
      en: 'Izdihar Coffee Beverages Holding Company',
    },
    commercialRegister: '4650546708',
    vat: '311085354400003',
    trademark: '1439017731',
    address: {
      ar: 'شارع سلطانة، حي القبلتين، ص.ب ٤٨٥٥، المدينة المنورة ٤٢٣١٤',
      en: 'Sultana Street, Al Qiblatayn, PO Box 4855, Madinah 42314',
    },
  },
};

/**
 * The four lots Bloom has roasted, recovered from their store sitemap. No
 * tasting notes survive anywhere, so the site names the origin and stops
 * there rather than inventing cupping language.
 */
export const origins: Origin[] = [
  {
    id: 'ethiopia',
    country: { ar: 'إثيوبيا', en: 'Ethiopia' },
    lot: { ar: 'غوجي أوراجا', en: 'Guji Uraga' },
  },
  {
    id: 'colombia',
    country: { ar: 'كولومبيا', en: 'Colombia' },
    lot: { ar: 'كالداس', en: 'Caldas' },
  },
  {
    id: 'el-salvador',
    country: { ar: 'السلفادور', en: 'El Salvador' },
    lot: { ar: 'بوينا فيستا', en: 'Buena Vista' },
  },
  {
    id: 'papabisa',
    country: { ar: 'خلطة', en: 'Blend' },
    lot: { ar: 'بابابيسا', en: 'Papabisa' },
  },
];
