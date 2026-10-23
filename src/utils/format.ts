/** No-break space: keeps a figure and its unit on one line. */
const NBSP = ' ';

/** 190 -> "190 ₽" */
export const rub = (n: number) => `${n}${NBSP}₽`;

/** Chapter numbers, the way a book sets them. */
export function toRoman(n: number): string {
  const table: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  let rest = n;
  for (const [value, glyph] of table) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}
