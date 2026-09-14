# Loading screen

Status: built. Files listed at the end.

## What it is

A single counter, centred on the hero section's own white ground. Progress is
real, so the number carries the whole piece and nothing competes with it. When
it reaches 100 the field splits along the centre line and parts, revealing the
homepage already coming alive behind it.

## Ground

`--color-bg-white` (`#ffffff`), which is exactly `.hero`'s background. Because
the loading field and the page behind it are the same white, the parting halves
read as the page itself opening rather than a curtain being removed.

The field carries the same SVG fractal-noise plate the hero and manifesto use,
at 0.03 with a slow four-step drift, so the white holds material instead of
sitting dead. At that opacity it is texture, not colour: the ground still
matches the hero exactly.

## The counter

Onest at weight 200, `clamp(3rem, 9.5vw, 8rem)`. Onest's zero is the same
circle the wordmark's a, c and e counters are built from, so the figure reads
as the brand at display scale and hands off into the hero without a change of
voice. 200 is the optical weight at this size: 100 goes wiry, 300 starts to
read as body copy set large.

Playfair italic was tried first, following the About section's stat numerals.
It was rejected at review: at 4rem in a row of three stats it is a delicate
detail, but at 8rem alone on white a Didone italic becomes the whole identity,
and it is a genre away from the geometric sans the hero resolves into.

Three digits are always present. Leading zeros stay on the page but recede to
13% opacity, so `091` reads as ninety-one while the figure keeps a constant
width. Each digit sits in a fixed `0.6em` box, so the number never jitters
horizontally as it climbs; without that, a centred figure would wobble on every
tick.

The figure changes about a hundred times on the way up, so it is written
straight to the DOM from a MotionValue subscription rather than through React
state.

## Honest loading

`usePreloadProgress` warms the hero LCP image, both logo marks and
`document.fonts.ready`, then blends three signals every frame:

- **ceiling**: real completion, held below 100 until the last asset lands
- **floor**: elapsed time over `minDuration`, shaped `1 - (1-t)^1.55`
- **smoothing**: a rAF lerp between the two, so the number never jumps or stalls

Floor 1500 ms, ceiling 6000 ms. Failures resolve rather than reject, so a
missing asset can never hold the site hostage.

Timing is also held behind a gate. The counter is the only thing on screen and
it is set in a webfont that is itself still arriving, so the figure is not
painted until that face has loaded, and counting does not begin until 220 ms
after that. Without the gate a first visit shows the figure in the fallback and
then snapping faces mid count; without the head start the 0.5s fade races the
climb and the first legible value is already past 20. The gate is capped at
1200 ms, so a slow font delays the loader by a beat rather than stalling it.
Held frames do not count against the floor, so the readout always gets its full
climb from 000.

Pipeline images are responsive, so warming a hardcoded URL would cache a rung
the browser then declines to use. `warm(name, sizes)` builds a detached
`<picture>` mirroring the real sources, letting the same selection run twice and
land on one file.

## Timeline

| t | event |
|---|---|
| 0.00 | the white field paints immediately |
| face | the figure fades up over 0.5s once its own face has loaded |
| +0.22 | counting starts, the fade already most of the way in |
| 0 to 1.50 | the figure climbs, ghost zeros lighting as it crosses each decade |
| 1.50 | 100 |
| +0.52 | `onDone()` fires: the site mounts behind the still frame |
| +0.76 | the counter fades and rises 12px, clearing the centre line |
| +0.92 | THE PART: the field splits along that line, `[0.76, 0, 0.24, 1]`, 0.82s |
| +1.74 | overlay retires, scroll handed back |

About 3.0 s. The site mounts 240 ms before the field moves so its render cost
lands during a still frame, and the hero's own choreography (headline lines at
0.5 / 0.62 / 0.74 s, logo at 1.0 s) therefore runs *as* the field opens. The
page is not uncovered; it comes alive.

## Accessibility

`prefers-reduced-motion` removes the part: the overlay cross-fades out in 0.4 s
and the counter still counts. The visuals are `aria-hidden`; one `role="status"`
element announces loading. Scroll is held by `lenis.stop()` plus a body overflow
lock and handed back when the overlay retires.

## Two defects found and fixed during build

1. **Mount flash.** Motion only applies render-time styles when `initial` is
   explicit. With `animate` alone, elements painted at their resting values for
   about four frames before hiding. Every animated element now carries an
   explicit `initial`.

2. **Intermittent crash on load.** The first rAF timestamp can predate the
   `performance.now()` captured in the effect, making `elapsed` negative and
   progress slightly negative, which indexed an array at `-1` and white-screened
   the loader. Roughly one load in six, non-deterministic. Fixed by clamping
   elapsed and progress at the source in `usePreloadProgress`.

## History

The first build was a typographic piece called "The Beam": BALANCE assembled
from the centre outward, its letters converging on a hairline that grew from a
fulcrum as the progress readout, on a cream ground with four editorial corner
labels. It was cut back to the counter alone on the hero's white at the client's
direction. The mechanics that survived, real asset-driven progress, the ghost
zeros, and the part along the centre line, are the ones described above.

## Files

- `src/components/layout/LoadingScreen.tsx` (new)
- `src/components/layout/LoadingScreen.module.css` (new)
- `src/hooks/usePreloadProgress.ts` (new)
- `src/App.tsx`: additive mount gate only, five lines. Nothing else touched.
