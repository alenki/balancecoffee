import type { ImageName } from '../generated/image-manifest';
import type { Lang } from '../context/LanguageContext';

/**
 * A string that exists in both site languages.
 *
 * The outgoing site kept Russian and English in two parallel data files that
 * had to be edited in lockstep, and they drifted. Pairing the two values at
 * the field means a translator cannot add one without seeing the other.
 */
export interface Localized {
  ar: string;
  en: string;
}

/** Reads the active language out of a Localized value. */
export const pick = (value: Localized, lang: Lang): string => value[lang];

// Menu

export interface MenuItem {
  id: string;
  name: Localized;
  /** Present only on signature items: the grid stays calm without it. */
  description?: Localized;
  /** Saudi riyals. Always a whole number on their menu. */
  price: number;
  /** As printed on their own menu. Omitted where they omit it. */
  calories?: number;
  /** Key into the generated image manifest, not a URL. */
  image: ImageName;
  isSignature?: boolean;
}

export interface MenuCategory {
  id: string;
  name: Localized;
  /** Used for the in-page anchor and the category rail. */
  slug: string;
  description?: Localized;
  items: MenuItem[];
}

// Branches

export interface Branch {
  id: string;
  name: Localized;
  /** Street as the mapping services record it, not the branch nickname. */
  street: Localized;
  district?: Localized;
  city: Localized;
  coordinates: [number, number];
  /** Branch line. Absent where sources disagree or none is published. */
  phone?: string;
  phoneHref?: string;
  mapUrl: string;
  /** Gregorian year the branch opened, for the timeline. */
  opened?: string;
  rating?: number;
  reviewCount?: number;
  isComingSoon?: boolean;
}

// Roastery

export interface Origin {
  id: string;
  country: Localized;
  /** Farm, washing station or region, as the roastery names it. */
  lot: Localized;
}

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  instagram: string;
  snapchat: string;
  tiktok: string;
  x: string;
  shop: string;
  menu: string;
  hours: { start: string; end: string };
  legal: {
    company: Localized;
    commercialRegister: string;
    vat: string;
    trademark: string;
    address: Localized;
  };
}
