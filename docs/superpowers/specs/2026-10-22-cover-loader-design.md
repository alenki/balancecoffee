# Loading screen: the cover

Status: built. Files listed at the end.

## What it is

The site is set like a clothbound book, so it opens like one. While the hero
plate and the webfonts load, the screen is the book's cover: bookcloth green,
the logo stamped in gilt, the motto under it, and the real load count as the
folio at the foot. At 100 the cover swings open on its spine and the hero, a
title page facing a photograph, is already there underneath.

## Cover

`--c-binding` (`#1f3a33`), the same green as the night band and the footer, so
the site closes the way it opened. The cloth is two 3px repeating gradients (a
linen weave) over a fractal-noise plate, with a radial falloff toward the edges
where cloth wraps the boards. Two gilt rules, inset 24px and 31px on desktop,
stand in for the blind-stamped border of a real cover. A 28px shadow on the
left edge reads as the spine crease.

## Stamping

The emblem and the wordmark are vector paths traced from the café's 3544px logo
master (`src/components/common/brandMarks.ts`), filled with `--c-gilt`. Each
carries a one-pixel drop shadow, as foil sits slightly proud of the cloth. The
emblem's stardust is a separate set of 117 particles: on the cover they rise
off the spoon nearest-first, then twinkle on staggered periods.

## Folio

Literata, tabular lining figures, in gilt at the foot of the cover. Three
digits always, leading zeros at 28% opacity in fixed 0.72em boxes, so the
centred figure never shifts. Written straight to the DOM from a MotionValue
subscription rather than through React state.

## Honest loading

`usePreloadProgress` warms the hero plate (mirroring its real `<picture>` so
the same rung is chosen twice) and `document.fonts.ready`, then blends:

- **ceiling**: real completion, held below 100 until the last asset lands
- **floor**: elapsed time over 1500 ms, shaped `1 - (1-t)^1.55`
- **smoothing**: a rAF lerp between the two

Ceiling 6000 ms, so a slow asset can never hold the site hostage. Counting is
gated on Literata having loaded (capped at 1200 ms) plus a 220 ms head start.

## Timeline

| t | event |
|---|---|
| 0.00 | the closed cover paints |
| face | the folio fades in once Literata is ready |
| 0 to 1.50 | the folio climbs; the stardust rises off the spoon |
| 1.50 | 100 |
| +0.42 | `onDone()`: the site mounts behind the closed cover |
| +0.64 | the folio fades; the cover starts to swing |
| +0.76 to +1.96 | THE SWING: `rotateY(0 to -112deg)` about the left edge, `[0.62, 0, 0.3, 1]`, 1.2 s |
| +2.09 | overlay retires, scroll handed back |

Perspective is 2200px with its origin on the spine (`0% 50%`), so the cover
lifts toward the reader and folds away to the left instead of ballooning at
the centre. A gradient shade deepens on the cloth as it turns, and a soft
shadow passes across the first page beneath it.

## Accessibility

`prefers-reduced-motion` drops the swing: the overlay cross-fades out in
0.45 s, the folio still counts, the stardust sits still. The visuals are
`aria-hidden`; one `role="status"` element announces loading. Scroll is held by
`lenis.stop()` plus a body overflow lock until the overlay retires.

## Files

- `src/components/layout/LoadingScreen.tsx`
- `src/components/layout/LoadingScreen.module.css`
- `src/components/common/Emblem.tsx`, `Emblem.module.css`
- `src/components/common/brandMarks.ts`
- `src/hooks/usePreloadProgress.ts`
