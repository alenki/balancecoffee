/**
 * The streets around the café, drawn from OpenStreetMap by
 * scripts/draw-street-map.mjs (`npm run map`). Generated: edit the script,
 * not this file.
 *
 * Map data © OpenStreetMap contributors, under the ODbL.
 *
 * Metres from the café door, turned 42.3° clockwise from north so that
 * Pushkina Street runs level: x east along Pushkina, y down the page. Each
 * street is a flat run of x, y pairs.
 */

export type StreetId = 'pushkina' | 'chekhova' | 'keshokova' | 'lenina' | 'shogentsukova' | 'nogmova';

export interface Street {
  id?: StreetId;
  /** The avenues and through roads, drawn heavier. */
  major: boolean;
  points: readonly number[];
}

/** How far the map is turned clockwise from north, in degrees. */
export const MAP_TURN = 42.3;

/** The "Городская администрация" stop nearest the door. */
export const BUS_STOP: readonly [number, number] = [5.7, 23.1];

export const STREETS: readonly Street[] = [
  { major: false, points: [602.3, 178.4, 602.1, 261.3] },
  { major: false, points: [-299.6, 194.1, -293.7, 313.7] },
  { major: false, points: [-300.6, 181.5, -299.6, 194.1] },
  { major: false, points: [-301.2, 162.9, -300.6, 181.5] },
  { major: false, points: [521.1, 267.5, 521.7, 184.2] },
  { major: false, points: [602.9, 124.7, 602.3, 178.4] },
  { major: false, points: [83, -54.1, 83.9, 15.8] },
  { major: false, points: [85.6, -270.7, 84.3, -189.6] },
  { major: false, points: [200.6, -74.4, 196.3, -47.1, 193.8, -37, 194.6, -7.1, 193.2, 15.7] },
  { id: 'chekhova', major: false, points: [-9.5, 15.8, -9.4, -94.6] },
  { id: 'keshokova', major: false, points: [-78.5, -257.6, -79.8, -166.7, -81, -143.1] },
  { id: 'nogmova', major: false, points: [377.6, -143, 376.3, 15.5] },
  { id: 'nogmova', major: false, points: [377.6, -143, 379.1, -255.5] },
  { id: 'nogmova', major: false, points: [368.3, 262.4, 370.1, 141.8, 371.9, 129.2] },
  { id: 'nogmova', major: false, points: [376.3, 15.5, 374.2, 113.2, 371.9, 129.2] },
  { id: 'pushkina', major: false, points: [-87.4, 15.9, 376.3, 15.5] },
  { id: 'pushkina', major: false, points: [-382.4, 15.1, -87.4, 15.9] },
  { id: 'pushkina', major: false, points: [376.3, 15.5, 480.5, 15.6] },
  { id: 'pushkina', major: false, points: [605.7, 15.7, 681.5, 17.3] },
  { id: 'pushkina', major: false, points: [480.5, 15.6, 561.4, 15.6] },
  { id: 'pushkina', major: false, points: [561.4, 15.6, 605.7, 15.7] },
  { id: 'keshokova', major: true, points: [-93.4, 146.3, -87.4, 15.9] },
  { id: 'keshokova', major: true, points: [-87.4, 15.9, -82.7, -119.3, -81, -143.1] },
  { id: 'keshokova', major: true, points: [-93.4, 146.3, -99.6, 199.4, -107.7, 242.2] },
  { id: 'lenina', major: true, points: [479.3, -143, 377.6, -143] },
  { id: 'lenina', major: true, points: [-81, -143.1, 32.9, -143.5] },
  { id: 'lenina', major: true, points: [-372.3, -143.4, -198.7, -142.1] },
  { id: 'lenina', major: true, points: [-198.7, -142.1, -173.8, -141.7, -81, -143.1] },
  { id: 'lenina', major: true, points: [205.6, -143.3, 272.2, -143.2] },
  { id: 'lenina', major: true, points: [272.2, -143.2, 377.6, -143] },
  { id: 'lenina', major: true, points: [32.9, -143.5, 119.1, -143.4] },
  { id: 'lenina', major: true, points: [119.1, -143.4, 205.6, -143.3] },
  { id: 'lenina', major: true, points: [552.7, -143, 479.3, -143] },
  { id: 'lenina', major: true, points: [627.9, -142.9, 552.7, -143] },
  { id: 'shogentsukova', major: true, points: [670.4, 123, 602.9, 124.7] },
  { id: 'shogentsukova', major: true, points: [477.7, 127.1, 371.9, 129.2] },
  { id: 'shogentsukova', major: true, points: [203.1, 132.6, 146.6, 134.2, 17.9, 139.9] },
  { id: 'shogentsukova', major: true, points: [-182.2, 153.2, -387.1, 169.6] },
  { id: 'shogentsukova', major: true, points: [-93.4, 146.3, -108.7, 148.4, -182.2, 153.2] },
  { id: 'shogentsukova', major: true, points: [17.9, 139.9, -81.6, 144.8, -93.4, 146.3] },
  { id: 'shogentsukova', major: true, points: [371.9, 129.2, 358.7, 129.4] },
  { id: 'shogentsukova', major: true, points: [358.7, 129.4, 203.1, 132.6] },
  { id: 'shogentsukova', major: true, points: [602.9, 124.7, 477.7, 127.1] },
];
