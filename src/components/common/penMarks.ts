/**
 * Marks made with the red pen, shared by the guest book's mark scale and the
 * game's score.
 *
 * A quick pen loop, drawn once and kept as a path: it starts at one o'clock,
 * runs anticlockwise the way a right hand circles a word, and overshoots its
 * start on a slightly wider radius. Drawn in a 60 by 48 box.
 */
export const PEN_RING =
  'M41.7 10.3C40.7 10.1 37.9 9 35.7 8.7C33.5 8.4 31.1 8.3 28.8 8.5C26.5 8.7 24 9.1 21.8 9.8C19.6 10.4 17.5 11.3 15.7 12.4C14 13.5 12.5 14.9 11.3 16.3C10.1 17.8 9.3 19.5 8.7 21.2C8.1 22.9 7.9 24.7 7.9 26.4C8 28.2 8.4 30 9.3 31.5C10.1 33 11.3 34.5 12.9 35.7C14.5 36.8 16.5 37.8 18.7 38.5C20.8 39.2 23.4 39.7 25.8 39.9C28.2 40.1 30.8 40.1 33.2 39.8C35.7 39.5 38.1 39 40.4 38.2C42.7 37.4 45 36.3 46.9 35C48.8 33.7 50.7 32.2 52 30.5C53.4 28.9 54.4 27 54.9 25.2C55.4 23.3 55.4 21.3 55.1 19.5C54.7 17.7 53.8 15.9 52.6 14.3C51.5 12.7 49.9 11.2 48.2 10C46.5 8.8 44.5 7.8 42.3 7.1C40.2 6.4 37.7 5.9 35.3 5.7C32.8 5.5 28.7 5.9 27.4 6';

/** The pen's stroke: how fast a loop is drawn, and how it eases. */
export const PEN_STROKE = { duration: 0.46, ease: [0.4, 0.1, 0.2, 1] } as const;
