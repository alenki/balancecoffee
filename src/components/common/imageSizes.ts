/**
 * `sizes` strings, derived from the grids these images actually render in.
 *
 * These tell the browser how wide an image will be before any CSS has been
 * applied, which is what lets it pick the right rung off the width ladder. A
 * wrong value silently wastes the whole pipeline: too small and the image is
 * soft, too large and the saving evaporates.
 *
 * There are two page geometries, and which one an image sits in decides its
 * arithmetic.
 *
 * The full bleed ladder, used by the hero and the menu grids, has no
 * `max-width`: only an inline padding that steps 16px, then 24px at 640, then
 * 48px at 768, then 64px at 1200. Content width is `100vw - 2 * padding` and
 * it keeps growing with the viewport.
 *
 * The capped ladder, used by the roastery and branches bands on the home
 * page, is the same padding with `max-width: var(--measure-page)` over it, so
 * the content width climbs to 1192px and then stops. Past 1320px of viewport
 * every value below is a constant, which is the point: those bands no longer
 * stretch.
 *
 * Every value carries an extra 8px for the scrollbar, which is why the
 * constants read 40, 56, 104 and 136 rather than 32, 48, 96 and 128.
 *
 * ONE RULE THAT IS EASY TO MISS. `sizes` describes the width the browser must
 * supply, and under `object-fit: cover` that is not always the width of the
 * box. When the box is narrower in aspect than the source, the HEIGHT binds:
 * the picture is scaled until it fills the box vertically and the overflow is
 * cropped off the sides. The width actually needed is then
 * `boxHeight * sourceAspect`, which is larger than the box. Declaring the box
 * width there serves a soft image with no error and no warning. When the box
 * is wider in aspect than the source the width binds and the box width is
 * correct as it stands.
 *
 * If a grid changes, redo the arithmetic here or the browser will keep
 * choosing against the old layout.
 */

/**
 * Hero card: the viewport minus the page gutter, which steps at 768 and 1200.
 * The card sits inside `.hero`, whose gutter starts at 24px rather than 16px.
 * Box widths are 1920 -> 1784px, 1440 -> 1304px, 1024 -> 920px, 768 -> 664px,
 * 390 -> 334px, and `.heroCard` is a fold height: `100svh` less the 160px of
 * header clearance above it and air below it.
 *
 * `brand/cover` is 2400 by 1600, an aspect of 1.5, so which dimension binds
 * under the cover rule above changes with the shape of the viewport and both
 * cases have to be declared:
 *
 * - Landscape, where the box is wider in aspect than 1.5: the width binds and
 *   the box width is what the browser needs. 1440 by 900 is a 1304 by 740
 *   card, an aspect of 1.76.
 * - Portrait, where it is narrower: the height binds, the picture is drawn
 *   `cardHeight * 1.5` wide and the overflow is cropped off the sides. A 390
 *   by 844 phone has a 684px tall card and needs 1026px, three times its
 *   334px box, which is the case the old constant got wrong.
 *
 * The crossover sits near a viewport aspect of 4/3 for every realistic fold,
 * so that is where the query switches. `vh` rather than `svh`: a `sizes`
 * length resolves before layout, and the large viewport is the safe side to
 * round towards.
 */
export const HERO_SIZES = [
  '(min-aspect-ratio: 4/3) and (min-width: 1200px) calc(100vw - 136px)',
  '(min-aspect-ratio: 4/3) and (min-width: 768px) calc(100vw - 104px)',
  '(min-aspect-ratio: 4/3) calc(100vw - 56px)',
  'calc(150vh - 240px)',
].join(', ');

/**
 * Menu grids. MenuPreview and MenuCategory share one grid definition, so they
 * share this value: two columns below 1024 and three above, full bleed with a
 * gutter that grows.
 * 1920 -> 568px, 1440 -> 411px, 1024 -> 290px, 768 -> 316px, 390 -> 167px.
 *
 * NOT YET CORRECTED for the cover rule above, and as with the hero the values
 * listed are box widths. `MenuCard.module.css` frames these 1/1 against 5/4
 * sources, so the height binds and every clause wants a factor of 1.25. The
 * card is short by one rung at 640, 1024, 1440 and 1920, across the 53 cards
 * the menu page renders. Correcting it changes what that whole page fetches,
 * which is a wider decision than the band this pass was for.
 */
export const MENU_CARD_SIZES =
  '(min-width: 1024px) calc(33vw - 48px), (min-width: 640px) calc(50vw - 48px), calc(50vw - 24px)';

/**
 * The roastery band's plate on the home page: the narrower of two columns
 * above 900, at 45 percent of the content width less a 64px gap, and the full
 * content width below that.
 *
 * The frame is 5/4 and `menu/hot/v60` is 1280 by 1024, which is also 5/4, so
 * `cover` crops nothing and the width binds. No compensation applies here.
 *
 * The content width is capped, so this settles rather than growing:
 * 1920 -> 508px, 1440 -> 508px, 1320 -> 508px, 1280 -> 486px, 1024 -> 386px,
 * 900 -> 330px, 800 -> 696px, 390 -> 350px.
 */
export const ROASTERY_PLATE_SIZES =
  '(min-width: 1320px) 508px, (min-width: 1200px) calc(45vw - 90px), (min-width: 900px) calc(45vw - 75px), (min-width: 768px) calc(100vw - 104px), (min-width: 640px) calc(100vw - 56px), calc(100vw - 40px)';

/** The monogram renders 22px to 54px tall at a 331x331 square. */
export const LOGO_SIZES = '72px';
