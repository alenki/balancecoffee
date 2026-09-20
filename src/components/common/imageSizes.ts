/**
 * `sizes` strings, derived from the grids these images actually render in.
 *
 * These tell the browser how wide an image will be before any CSS has been
 * applied, which is what lets it pick the right rung off the width ladder. A
 * wrong value silently wastes the whole pipeline: too small and the image is
 * soft, too large and the saving evaporates.
 *
 * Every value below is computed from the grid declared in the matching CSS
 * module, and the derivation is written out beside it so it can be checked.
 * The shared geometry is the page container: `max-width: 1320px` with an
 * inline padding that steps 24px, then 40px at 768, then 64px at 1280. So the
 * content width is `min(1320px, 100vw) - 2 * padding`, which settles at
 * 1192px once the viewport passes 1320px.
 *
 * If a grid changes, redo the arithmetic here or the browser will keep
 * choosing against the old layout.
 */

/**
 * Hero card: the full content width of the container.
 * 1320+ -> 1192px, 1280 -> 100vw-128, 768 -> 100vw-80, below -> 100vw-48.
 */
export const HERO_SIZES =
  '(min-width: 1320px) 1192px, (min-width: 1280px) calc(100vw - 128px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)';

/**
 * Menu grids. MenuPreview and MenuCategory share one grid definition, so they
 * share this value.
 *
 * Columns and gap: 2 up with a 12px gap below 768, 3 up with 20px to 1280,
 * 4 up with 24px above.
 * 1320+ -> (1192 - 3*24)/4 = 280px
 * 1280  -> (100vw - 128 - 72)/4 = 25vw - 50px
 * 768   -> (100vw - 80 - 40)/3  = 33.33vw - 40px
 * below -> (100vw - 48 - 12)/2  = 50vw - 30px
 */
export const MENU_CARD_SIZES =
  '(min-width: 1320px) 280px, (min-width: 1280px) calc(25vw - 50px), (min-width: 768px) calc(33.33vw - 40px), calc(50vw - 30px)';

/**
 * Roastery section portrait: half the content width above 900, full below.
 * 1320+ -> (1192 - 64)/2 = 564px
 */
export const ROASTERY_SIZES =
  '(min-width: 1320px) 564px, (min-width: 900px) calc(50vw - 80px), calc(100vw - 48px)';

/** The monogram renders 22px to 54px tall at a 331x331 square. */
export const LOGO_SIZES = '72px';
