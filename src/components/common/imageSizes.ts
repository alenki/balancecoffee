/**
 * `sizes` strings, measured against the real layouts.
 *
 * These tell the browser how wide an image will render before any CSS has
 * been applied, which is what lets it pick the right rung off the width
 * ladder. A wrong value silently wastes the whole pipeline: too small and the
 * image is soft, too large and the saving evaporates. So every value here was
 * measured in a browser rather than estimated, and the measurements are kept
 * alongside it. If a grid changes, re-measure and update the matching entry.
 */

/**
 * Hero card: the viewport minus the page gutter, which steps at 768 and 1200.
 * Measured: 390 -> 334px, 768 -> 664px, 1024 -> 920px, 1440 -> 1304px,
 * 1920 -> 1784px.
 */
export const HERO_SIZES =
  '(min-width: 1200px) calc(100vw - 136px), (min-width: 768px) calc(100vw - 104px), calc(100vw - 56px)';

/**
 * Menu grids (MenuPreview and MenuCategory share the same rules): two columns
 * below 1024px and three above, full-bleed with a gutter that grows.
 * Measured: 390 -> 167px, 768 -> 316px, 1024 -> 290px, 1440 -> 411px,
 * 1920 -> 568px.
 */
export const MENU_CARD_SIZES =
  '(min-width: 1024px) calc(33vw - 48px), (min-width: 640px) calc(50vw - 48px), calc(50vw - 24px)';

/**
 * Gallery side columns, hidden below 1000px.
 * Measured: 1024 -> 21.7vw, 1440 -> 21.8vw, 1920 -> 22.9vw.
 */
export const GALLERY_SIDE_SIZES = '(min-width: 1000px) 23vw, 92vw';

/**
 * Gallery centre column is materially wider than the sides, so it needs its
 * own value or it loads a rung too small.
 * Measured: 1024 -> 35.4vw, 1440 -> 35.8vw, 1920 -> 38.9vw.
 */
export const GALLERY_CENTER_SIZES = '(min-width: 1000px) 39vw, 92vw';

/**
 * Gallery mosaic: a two-up grid, only rendered below 1000px.
 * Measured: 390 -> 42.1vw, 768 -> 46.0vw.
 */
export const GALLERY_MOSAIC_SIZES = '46vw';

/**
 * Daily masonry: three columns above 1024px, two below.
 * Measured: 390 -> 47.1vw, 768 -> 44.1vw, 1024 -> 46.8vw, 1440 -> 29.9vw,
 * 1920 -> 31.6vw.
 */
export const DAILY_MASONRY_SIZES = '(min-width: 1025px) 32vw, 48vw';

/** Wordmark renders 28px to 56px tall at a 400x176 aspect, so ~128px wide. */
export const LOGO_SIZES = '128px';
