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
 * Hero: the photograph on the endpaper inside the book's front board, under
 * the epigraph and facing the title page. A page is three quarters as wide
 * as it is tall, and the open spread, each page with its boards' squares,
 * fills what the window allows less the header, the gutters and the
 * ribbon's room: one page beside the other in landscape, one over the other
 * in portrait, never more than 750px wide. The print is a 2:3 of the room
 * between its lines (in landscape from the top of the title's capitals down
 * to the imprint's baseline, about half the page's width; in portrait from
 * under the epigraph down to the head margin above the spine), but never
 * narrower than the verse and its indent, 204px (208px in English, rounded
 * up), and never wider than the type area, which binds on a phone. On the
 * smallest pages it takes the verse's own width; on a phone on its side it
 * is not drawn. It is only ever drawn smaller than this while the book
 * opens, never larger.
 * Measured, page then print: 360x640 -> 182/133px, 375x667 -> 192/133px,
 * 390x844 -> 257/190px, 430x932 -> 290/204px, 768x1024 -> 320/204px,
 * 820x1180 -> 377/210px, 1024x1366 -> 446/256px, 844x390 -> 167px/none,
 * 1280x600 -> 299/204px, 1366x657 -> 341/204px, 1280x720 -> 386/204px,
 * 1024x768 -> 445/228px, 1366x768 -> 421/216px, 1180x820 -> 482/249px,
 * 1440x900 -> 518/266px, 1920x1080 -> 650/334px, 2000x874 -> 500/256px,
 * 2560x1440 -> 750/385px.
 */
export const FRONTISPIECE_SIZES = [
  '(orientation: landscape) and (min-width: 1200px) max(min(calc(37.8vh - 72px), calc(25.4vw - 28px), 387px), 208px)',
  '(orientation: landscape) and (min-width: 768px) max(min(calc(37.8vh - 60px), calc(25.4vw - 15px), 387px), 208px)',
  '(orientation: landscape) 208px',
  '(min-width: 1200px) max(min(calc(21.3vh - 40px), calc(55.7vw - 62px), 431px), 208px)',
  '(min-width: 768px) max(min(calc(22vh - 43px), calc(57.5vw - 45px), 436px), 208px)',
  'min(calc(27.5vh - 40px), calc(71.8vw - 28px), 208px)',
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
