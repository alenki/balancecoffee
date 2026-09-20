import type { Branch } from '../types';

/**
 * Bloom's locations.
 *
 * Streets are recorded as the mapping services have them, which is not always
 * what the branch is called. The Al Faisaliah branch in particular sits in
 * حي الجامعة according to both Google and OpenStreetMap, so its district is
 * printed as Al Jamiah and never as Al Faisaliah.
 *
 * Sultana carries no branch phone on purpose: Google publishes
 * +966 55 590 5701 while Snapchat and two directories publish 053 003 9936,
 * and there is no way to tell which is current. The company line covers it.
 */
export const branches: Branch[] = [
  {
    id: 'sultana',
    name: { ar: 'سلطانة', en: 'Sultana' },
    street: { ar: 'شارع سلطانة', en: 'Sultana Street' },
    district: { ar: 'مجمع السنبلية', en: 'Alsunbuleya complex' },
    city: { ar: 'المدينة المنورة', en: 'Madinah' },
    coordinates: [24.4843744, 39.5726766],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=24.4843744,39.5726766',
    opened: '2019',
    rating: 4.3,
    reviewCount: 3791,
  },
  {
    id: 'al-faisaliah',
    name: { ar: 'الفيصلية', en: 'Al Faisaliah' },
    street: { ar: 'شارع رفيدة الأنصارية', en: 'Rufaidah Al Ansariah Street' },
    district: { ar: 'حي الجامعة', en: 'Al Jamiah' },
    city: { ar: 'المدينة المنورة', en: 'Madinah' },
    coordinates: [24.4744217, 39.5675053],
    phone: '+966 53 800 9488',
    phoneHref: 'tel:+966538009488',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=24.4744217,39.5675053&query_place_id=ChIJjZSlGAC5vRUR1RRGilP6Law',
    opened: '2026',
    rating: 4.4,
  },
  {
    id: 'mahzoor',
    name: { ar: 'مهزور', en: 'Mahzoor' },
    street: { ar: 'شارع طلحة بن الحسين العنبري', en: 'Talha bin Al Husain Al Anbari Street' },
    district: { ar: 'مهزور', en: 'Mahzur' },
    city: { ar: 'المدينة المنورة', en: 'Madinah' },
    coordinates: [24.4358591, 39.6535219],
    phone: '+966 53 262 3784',
    phoneHref: 'tel:+966532623784',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=24.4358591,39.6535219&query_place_id=ChIJ5e-IJwCVvRURKFEodN5TZNc',
    opened: '2026',
    rating: 4.6,
  },
  {
    // Announced only. No listing exists yet and it was absent from their own
    // Linktree at research time, so it carries no phone, hours or rating.
    // The coordinates are the 11 West complex, not the cafe within it.
    id: 'jeddah',
    name: { ar: 'جدة', en: 'Jeddah' },
    street: { ar: 'مجمع ١١ ويست، شارع حراء', en: '11 West, Hiraa Street' },
    district: { ar: 'حي الشاطئ', en: 'Ash Shati' },
    city: { ar: 'جدة', en: 'Jeddah' },
    coordinates: [21.6063352, 39.1200964],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=21.6063352,39.1200964',
    isComingSoon: true,
  },
];

export const openBranches = branches.filter((b) => !b.isComingSoon);
