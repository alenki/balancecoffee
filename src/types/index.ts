import type { ImageName } from '../generated/image-manifest';

// Menu Types
export interface PriceVariant {
  size: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** Serving size, shown beside a single price. */
  size?: string;
  price?: number;
  priceVariants?: PriceVariant[];
  /**
   * A photograph of this item, when the café has published one. Items
   * without one are set as a type tile instead. Key into the generated
   * image manifest, not a URL.
   */
  image?: ImageName;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

// Guest quotes, excerpted from public reviews on Yandex Maps
export interface GuestQuote {
  id: string;
  text: string;
  author: string;
  year: number;
}

// The home page's catchphrase game
export interface Catchphrase {
  id: string;
  /** Which shelf it sits on; wrong answers are drawn from the same one. */
  shelf: 'russian' | 'world';
  /**
   * The phrase, quoted without its surrounding quote marks. Verse breaks its
   * lines with `\n`.
   */
  line: string;
  title: string;
  author: string;
}
