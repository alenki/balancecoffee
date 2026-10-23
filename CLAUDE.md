# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Biblioteka (BIBΛIOTEKA) is a React 19 + TypeScript + Vite single-page site for
a single coffee and books café at 35 Pushkina Street, Nalchik. Russian is the
default language; English is a full second edition.

Every fact the site states about the café (phone, hours, Ramadan hours,
coordinates, legal details, links) lives in `src/data/cafe.ts`. The menu lives
in `src/data/menu.ts` and `src/data/menu.en.ts`, which must keep the same ids,
prices and item photos.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - TypeScript type-check then Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally
- `npm run images` - Regenerate responsive image derivatives and the manifest
- `npm run map` - Redraw the visit section's street map from OpenStreetMap (by hand only)

`images` runs automatically before `dev` and `build`. It is incremental, so an
unchanged source costs nothing. It does not delete stale outputs: after
removing or renaming an original, delete `public/img/` and rerun.

## Architecture

- **Entry point**: `index.html` → `src/main.tsx` → `src/App.tsx`
- **Build output**: `dist/`
- **Image originals**: `assets-src/` (never served; the source the pipeline reads)
- **Static assets**: `public/` (favicon, touch icon, `og-image.jpg`)

### Images

Every photo goes through `scripts/build-images.mjs`, which reads originals from
`assets-src/` and writes AVIF plus WebP at a ladder of widths into
`public/img/`, along with `src/generated/image-manifest.ts`. Both outputs are
generated and gitignored, so a fresh clone must run `npm run images` (or any
`dev`/`build`, which do it automatically).

Render photos with `<Image>` from `src/components/common/Image.tsx`, never a
raw `<img>`. It takes a manifest key rather than a URL, so a typo is a type
error, and it supplies the `srcset`, the intrinsic `width`/`height`, and the
blurred placeholder it dissolves out of.

Pass `sizes` from `src/components/common/imageSizes.ts`. Those strings are
measured from the real layouts, not estimated. If you change a grid, re-measure
the rendered width and update the matching entry, or the browser will keep
choosing against the old layout. `vite.config.ts` imports `HERO_SIZES` for the
hero preload, so the two cannot drift.

To add an image: drop the original in `assets-src/<area>/` (`hall`, `menu` or
`street`), run `npm run images`, then reference it by its key (path minus
extension).

### Brand marks

The logo is not an image. `src/components/common/brandMarks.ts` holds vector
paths traced from the café's 3544px logo master: the emblem's line art, its 117
stardust particles (kept separate so they can animate), and the BIBΛIOTEKA
wordmark. `<Emblem>` and `<Wordmark>` render them with `currentColor` and
`fill-rule="evenodd"`: ink on paper, foil on cloth.

### Street map

The visit section's map is a line drawing, not an embed. `npm run map` fetches
the streets around `cafe.coordinates` from OpenStreetMap once, turns them so
Pushkina runs level, and writes `src/data/streetMap.ts`, which is committed: the
site never calls a map service. `StreetMap.tsx` draws it in three crops (wide,
medium, tall for phones) with the street names, the stop and the café laid over
it as HTML, so type stays one size while the drawing stretches. Label positions
are metres along each street, hand placed per crop to clear the café's mark and
each other; after changing a crop, check every width down to 320px. Keep the
"© OpenStreetMap contributors" credit under it: the data's licence requires it.

### Routing

Uses `HashRouter` from react-router-dom (hash-based routing for static hosting compatibility):
- `/` - HomePage
- `/menu` - MenuPage (`/menu?chapter=<id>` opens at that chapter)
- `/reading-room` - ReadingRoomPage
- `/reviews` - ReviewsPage (the guest book)
- `*` - NotFoundPage

The hash is the route, so an in-page `href="#target"` would rewrite it. Jump
links must move focus in JavaScript instead (see the skip link in `App.tsx`
and the ribbon in `HeroSection.tsx`).

`useLenis` sets `history.scrollRestoration = 'manual'` and scrolls to the top on
every pathname change. Without it the browser restores an offset that belongs to
whichever page was open last, which drops a deep link into the footer.

Lenis clamps programmatic scrolls to a cached limit. Anything that scrolls to
content which may have just mounted (the menu's chapter deep link) must call
`lenis.resize()` first.

The home hero is pinned for about two screens while its book opens. Motion's
`useScroll` reads the progress and `HeroSection` writes it to the stage as
custom properties (`--open`, `--lift`, `--fall`, `--scale`, `--pitch`,
`--yaw`, `--lens`, `--details`), and its layout writes the book's
make in whole pixels; CSS draws the 3D. Keep `opacity`, `filter`, `overflow`,
`clip-path`, masks and blend modes off `.book`, `.body` and `.cover`: any of
them flattens the 3D and the cover stops turning. The faces are leaves and may
use them, and so may `.scene`, which holds the perspective. Two things cost a
face its antialiased edges in Chrome, so the book's silhouette steps: an SVG
filter image as its background (the cloth grain is a raster tile,
`public/cloth.webp`, for this reason), and any keyframe animation running
inside it (the cover's stardust uses `dust="settle"`, which rises once and
then leaves nothing running). Firefox sorts the book by cutting each face
along the planes of the faces painted before it, and draws a face it has cut
with harder edges, so `.body`, whose page edges and drape stand across the
boards and the title page, paints last (`z-index: 1`); a new face that stands
across others belongs after them in paint order. The book's size comes from
the stage's own 100svh height, not `innerHeight`, so a phone's sliding
toolbars never resize it mid scroll. Playwright's WebKit paints its
screenshots in software and flattens all 3D, so check the book in real Safari.

The guest book has no backend: it composes the review into a `wa.me` link to
the café's WhatsApp number and opens it. Each field sizes itself from an
invisible copy of its own text (the `data-value` mirror in
`ReviewsPage.module.css`), so nothing scrolls inside a field; if you change a
field's font or padding, change its mirror to match. The postmark waits for
the page to be visible before it lands, because sending usually takes the
guest away to WhatsApp.

### Component Organization

```
src/
  components/
    common/   # Image, Emblem, Logo/Wordmark, OpenStatus, brandMarks, imageSizes
    layout/   # Header, Footer, LoadingScreen (the running head)
    home/     # HomePage sections: Hero, Foreword, MenuPreview, Night, Visit, FirstLineGame
    menu/     # MenuPage components: CategoryNav, MenuCategory, MenuItem
    reviews/  # ReviewsPage components: MarkScale, Postmark
  context/    # LanguageContext (translations, plural-aware tn())
  data/       # cafe facts, menu (ru + en), gallery, guest quotes
  hooks/      # useLenis, useOpenStatus, usePreloadProgress, useScrollAnimation
  pages/      # Route-level components
  types/      # TypeScript interfaces
  utils/      # Formatting (prices, Roman numerals)
```

### Key Libraries

- **react-router-dom**: Client-side routing
- **motion**: Animations and transitions. `MotionConfig reducedMotion="user"`
  wraps the app, so `prefers-reduced-motion` is honoured without per-component
  handling. Lenis is not instantiated at all under that setting.
- **lenis**: Smooth scroll
- **sharp**: Build-time image encoding (dev dependency, used by the image script)

## TypeScript Configuration

Strict mode enabled with additional checks:
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noFallthroughCasesInSwitch` and `noUncheckedSideEffectImports` enabled
- Uses bundler module resolution and React JSX transform

## ESLint

Uses flat config format (`eslint.config.js`) with TypeScript, React Hooks, and React Refresh plugins.

## Frontend Aesthetics

Avoid generic "AI slop" design. Create distinctive, creative frontends that surprise and delight.

The site is set like a clothbound book. The loader is the running head drawn
large on paper: the wordmark over a rule that is drawn out from the centre as
the site really loads. At 100 the page parts along the rule and the upper half
rises until it is the header, wordmark and rule landing on the real ones to
the pixel. It has no type, so it never waits on a webfont. The hero is then
the book itself, a clothbound hardback set down shut on the page and tipped
away from the reader, so the depth of its pages shows: red cloth, the café's
mark stamped in cream, a red ribbon leaving the pages at the foot and lying
out on the page. It is drawn the way a book is bound: boards standing out
past the pages by their squares, the joint pressed in beside the spine, the
cloth turned in round the endpaper, headbands at the ends of the spine.
Scrolling swings the front board open on its joint onto the room, printed on
the endpaper and facing the title page, while the camera rises to straight
overhead and draws the spread up until it fills the screen, flat. On a
portrait screen it is bound at the head and opens upward. Keep it that bare.
The menu is a grid of cards,
kept from the previous
version of the site at the owner's request: a photograph where the café has
published one of that item, otherwise a red tile stamped with the item's name
in cream, like the café's own posts. The home page's menu preview, also
restored from that version at the owner's request, shows six of those same
cards, each linking to its chapter.
The current page is marked by a red ribbon bookmark hanging from the header.
The guest book is a short letter written straight onto the page: no card, no
boxes, no labels over the fields, the words around each blank saying what
goes in it ("Ставлю вам", "С уважением,", "P.S. Для ответа:"). The guest
circles a mark from 1 to 5 in red ink, as a mark is given in a school exercise
book, and the prompt for the letter answers it. Sending postmarks the letter
next to the signature, dated that day.
The footer is the book's last page, on the cover's cloth. Russian books keep
their contents at the back, so the navigation is set as one, with chapter
numerals and a foil ribbon hanging from the head of the page to the chapter
you are in. The imprint (legal details, copyright) sits in small type under
the phone and links. The wordmark, drawn gutter to gutter, is the last thing
on the page: nothing beneath it, no rule, no text. Its letters rise out of the
page's bottom edge as it comes into view. The Lumako credit signs the page at
the foot of the address column, on one baseline with the copyright beside it.
No labels over the columns.
Keep new work inside that world, and keep it restrained: no parchment
textures, no page curls.

Sections run the full width of the window, with only the gutter at the edges.
Do not cap them with a max-width; cap only measures of running text.

**Colour** (tokens in `src/index.css`): the café's own red and cream, sampled
from its Instagram posts. `--c-binding` red (#BF011D) dominates (foreword,
night band, footer, primary buttons, menu tiles); `--c-paper` is the reading surface;
`--c-ink` for type; `--c-foil` cream only ever on red, never on paper;
`--c-stamp` is the same red used as an accent on paper (ribbon, rubricated
initials, chapter numerals, badges, the guest book stamp). There is no green
and no gold: gold on this red fails contrast. Cream on the red holds 5.5:1, so
`--c-on-binding-muted` stays at 0.9 opacity to keep small type at 4.5:1.

**Typography**: **Literata** (`--font-serif`), Google's typeface for reading
books on screen, for display, headings and long reading text; its optical size
axis makes it a fine display face at large sizes. **Ysabeau Office**
(`--font-sans`) for the interface, labels, and prices (lining, tabular figures).
Wide-tracked small caps for eyebrows echo the logo's motto. Inter is loaded for
one thing only, the Lumako wordmark in the footer.

**Motion**: Use the Motion library for animations. Focus on high-impact moments. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

## Punctuation

This project bans dashes used as punctuation, in UI copy and in source comments and docs alike: no em dash, no en dash, no double hyphen. Use a colon, a semicolon, a comma, or a second sentence instead. Ranges take a word ("8:00 to 23:00"), which on the site means the `common.timeRange` translation key. Hyphens inside compound words ("edge-to-edge"), CSS custom property names (`--color-primary`), CLI flags and HTML comment delimiters are syntax, not punctuation, and stay.
