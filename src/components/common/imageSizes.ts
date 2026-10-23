/**
 * `sizes` strings, measured against the real layouts.
 *
 * These tell the browser how wide an image will render before any CSS has
 * been applied, which is what lets it pick the right rung off the width
 * ladder. A wrong value silently wastes the whole pipeline: too small and the
 * image is soft, too large and the saving evaporates. So every value here was
 * measured in a browser rather than estimated, and the measurements are kept
 * alongside it. If a grid changes, re-measure and update the matching entry.
 *
 * Shared steps: the page gutter is 20px per side below 768, 32px to 1199 and
 * 56px above. Sections run the full width of the window, so every image keeps
 * growing with it; each entry rounds its ratio up to the widest measured.
 */

/**
 * Hero: the room printed inside the book's front board, one page of the open
 * spread. The page is three quarters as wide as it is tall, and the open
 * book, each page with its boards' squares round it, fills what the window
 * allows less the header, the gutters and the ribbon's room: one board
 * beside the other in landscape, one over the other in portrait. Capped at
 * 750px wide. It is only ever drawn smaller than this while the book opens,
 * never larger.
 * Measured: 390x844 -> 257px, 430x932 -> 290px, 768x1024 -> 320px,
 * 1024x1366 -> 446px, 844x390 -> 167px, 1024x768 -> 445px, 1280x720 -> 386px,
 * 1366x768 -> 421px, 1440x900 -> 518px, 1920x1080 -> 650px,
 * 2000x874 -> 500px, 2560x1440 -> 750px.
 */
export const HERO_SIZES = [
  '(orientation: landscape) and (min-width: 1200px) min(calc(73.3vh - 140px), calc(49.3vw - 55px), 750px)',
  '(orientation: landscape) and (min-width: 768px) min(calc(73.3vh - 117px), calc(49.3vw - 31px), 750px)',
  '(orientation: landscape) min(calc(73.3vh - 108px), calc(49.3vw - 19px))',
  '(min-width: 1200px) min(calc(37.1vh - 71px), calc(97vw - 108px), 750px)',
  '(min-width: 768px) min(calc(37.1vh - 59px), calc(97vw - 62px), 750px)',
  'min(calc(37.1vh - 54px), calc(97vw - 38px))',
].join(', ');

/**
 * Night band side columns, hidden below 1000px.
 * Measured: 1024 -> 193px (18.8vw), 1280 -> 234px (18.3vw), 1440 -> 267px
 * (18.5vw), 1920 -> 370px (19.3vw).
 */
export const NIGHT_SIDE_SIZES = '(min-width: 1000px) 20vw, 92vw';

/**
 * Night band centre column, hidden below 1000px.
 * Measured: 1024 -> 300px (29.3vw), 1280 -> 364px (28.4vw), 1440 -> 415px
 * (28.8vw), 1920 -> 575px (29.9vw).
 */
export const NIGHT_CENTER_SIZES = '(min-width: 1000px) 30vw, 92vw';

/**
 * Night band mosaic: a two-up grid, only rendered below 1000px.
 * Measured: 390 -> 166px (42.6vw), 768 -> 343px (44.7vw).
 */
export const NIGHT_MOSAIC_SIZES = '45vw';

/**
 * Menu cards, on the menu page and in the home page's preview, which shares
 * its grid: three columns from 1024px, two below.
 * Measured: 390 -> 163px (41.8vw), 768 -> 332px (43.2vw), 1024 -> 300px
 * (29.3vw), 1280 -> 365px (28.5vw), 1440 -> 416px (28.9vw), 1920 -> 573px
 * (29.8vw).
 */
export const MENU_CARD_SIZES = '(min-width: 1024px) 30vw, 44vw';

/**
 * Reading room masonry: three columns above 1024px, two below, with wider
 * margins from 641px. Includes the 1.1 scale the parallax applies, since that
 * is the size actually painted.
 * Measured: 390 -> 186px (47.7vw), 640 -> 323px (50.5vw), 768 -> 341px
 * (44.4vw), 1024 -> 482px (47.1vw), 1280 -> 374px (29.2vw), 1440 -> 433px
 * (30vw), 1920 -> 609px (31.7vw).
 */
export const READING_MASONRY_SIZES = '(min-width: 1025px) 31vw, (min-width: 641px) 46vw, 50vw';
