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
  price?: number;
  priceVariants?: PriceVariant[];
  /** Key into the generated image manifest, not a URL. */
  image: ImageName;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: MenuItem[];
}

// Location Types
export interface CafeLocation {
  address: string;
  coordinates: [number, number];
  isComingSoon?: boolean;
}

export interface City {
  id: string;
  name: string;
  locations: CafeLocation[];
}

// Contact Types
export interface ContactInfo {
  phone: string;
  phoneHref: string;
  telegram: string;
  deliveryHours: {
    start: string;
    end: string;
  };
}
