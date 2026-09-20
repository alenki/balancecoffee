# Bloom Roastery typography correction

**Date:** 2026-09-20
**Supersedes:** the Typography section of
`2026-09-19-bloom-roastery-rebrand-design.md`

## Why this exists

The rebrand picked its Latin faces without a sample of Bloom's own artwork.
Two pieces of Bloom material surfaced afterwards and contradicted both
choices:

1. An International Coffee Day post, 1 October, setting `BLOOM ROASTERY`,
   `1 OCTOBER` and `INTERNATIONAL COFFEE DAY` in a bold geometric sans.
2. The logo file: the wordmark `BLOOM ROASTERY` over `بلــوم روســتري`,
   beside the chartreuse monogram.

The two disagree with each other, and that disagreement is the finding. The
logo sets the name in a serif. Everything else Bloom publishes is a geometric
sans. So the brand runs two faces with two jobs, and the site had the genre
wrong on both.

## What the artwork shows

**The wordmark is a Didone.** Vertical stress, thin flat unbracketed serifs,
clear thick to thin contrast in the `O`. The site was setting it in Cormorant
Garamond, an old style Garamond: angled stress, bracketed serifs, low
contrast. Right structure, wrong species.

**Everything else is a geometric sans.** Near circular `O`, `C` terminals cut
horizontally, `1` with a flag and no foot, `R` with a straight diagonal leg,
pointed `A` apex. The site was setting it in Onest, a neo grotesque.

**The Arabic wordmark is a hairline geometric** with squared `seen` teeth, a
flat baseline and long kashida elongation. Readex Pro was already the right
call here, as the original spec argued, but it was set at 300 where the mark
sits nearer 200, and without the elongation.

## How the sans was identified

Candidates were normalised to a common cap height and stacked directly under
the artwork, rather than compared by eye at arbitrary sizes.

Reference proportions, measured from the source bitmap by thresholding and
taking the dark pixel bounding box:

| String | Width in cap heights |
| --- | --- |
| `1 OCTOBER` | 7.66 |
| `COFFEE DAY` | 9.05 |
| `INTERNATIONAL` | 11.30 |

Montserrat was eliminated: at matched cap height it runs visibly wider than
the artwork on both test strings. Jost, Urbanist, Figtree, Plus Jakarta Sans,
DM Sans, Raleway and Josefin Sans were eliminated on letterform shape.

Outfit and Poppins both sit on the artwork's proportions. **Outfit** was
chosen on two grounds: the artwork's `O` carries slight stroke modulation,
which Poppins does not have because it is strictly monolinear; and Outfit is
one variable file where Poppins ships nine static weights.

A width ratio comparison using canvas `measureText` was attempted first and
discarded: it returned identical ratios across weights, because weights absent
from the stylesheet silently resolve to the nearest loaded one. The
cap height normalised visual stack is the result that stands.

## The system

| Role | Latin | Arabic |
| --- | --- | --- |
| Display and headings | Outfit Bold, caps | Readex Pro Medium |
| Body and UI | Outfit | Readex Pro |
| Logo wordmark | Bodoni Moda, caps, 0.24em tracking | Readex Pro 200, kashida |
| Editorial accent | Bodoni Moda italic, copy's own case | Readex Pro 200 |
| Lumako wordmark only | Inter | n/a |

Outfit carries no Arabic subset, so `Outfit, 'Readex Pro'` resolves Latin in
Outfit and falls through to Readex Pro for Arabic per character. Google's
unicode-range subsetting makes that free, exactly as it did for Onest, so the
mechanism the rebrand relied on survives the swap unchanged.

`--font-wordmark` and `--font-accent` both resolve to Bodoni Moda. They are
kept as separate variables so that reconsidering the accent face cannot move
the logo.

## Consequences beyond the font names

**Headings are bold, not light.** Every display element pinned
`var(--font-light)`, which was calibrated for Cormorant Garamond Light. At 300
a geometric sans reads thin and generic, the opposite of Bloom's artwork. Page
and section titles moved to 700, secondary uppercase labels such as branch and
origin names to 600, values and links to 500.

**Display tracking inverted.** `--track-display` went from `0.22em` to
`-0.015em`. A light serif at display size needs its counters opened out; a
bold geometric needs them closed up. The wide tracking Bloom does use, on the
small `BLOOM ROASTERY` line above `1 OCTOBER`, is already carried by
`--track-eyebrow` at `0.28em`, which is unchanged.

**Arabic display weights came up** from 200 to 500. 200 was calibrated against
a light serif; against a bold geometric it disappears. Readex Pro at 500 reads
about as heavy as a Latin geometric at 700, because Arabic carries more stroke
per unit area.

**Accent lines drop out of caps.** They inherit `text-transform: uppercase`
from the heading they sit in. A Didone italic set in caps is close to
unreadable, so the accent spans take `text-transform: none` and render in the
case the copy was written in. The translation strings were already lowercase
(`to find us`, `measured precisely`, `growing beyond`), so this needed no copy
change: `WHERE` followed by an italic `to find us`.

**Aref Ruqaa is gone.** Nothing calligraphic appears anywhere in Bloom's
material. No Didone covers Arabic, so an Arabic accent line now resolves to
Readex Pro and separates itself from the heading by weight, 200 against the
heading's 500, rather than by face.

**The loading screen preloads different faces.** It warmed
`300 2rem "Cormorant Garamond"` for the wordmark and `200 8rem Onest` for the
counter. Both now name the faces that actually arrive, or the reveal races a
font that is never requested.

## The kashida

The Arabic wordmark is live text, so the elongation has to be typed. It is
five tatweel (U+0640) after the `lam` and three after the `seen`. The span is
`aria-hidden` and the link carries the real name, so the padding characters
never reach a screen reader.

The logo file justifies its Arabic and Latin lines to equal width, the Arabic
within 2 per cent of the Latin, with the kashida doing the stretching. That
does not transfer: the site's header shows one language at a time, never the
stacked pair, so there is no second line to justify against. The elongation is
kept as a likeness of how Bloom draws the name, not as a measurement.

## Verification

- `npm run build` passes. `npm run lint` reports only the pre existing
  `react-hooks/set-state-in-effect` error in `src/hooks/useLenis.ts`.
- Both language versions were rendered and read at 1440px: hero, menu,
  roastery and branches sections, plus the header lockup in Latin and Arabic.
- Readex Pro renders U+0640 correctly at wordmark size, with no broken joins.
