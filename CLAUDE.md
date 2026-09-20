# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bloom Roastery (بلوم روستري) is a React 19 + TypeScript + Vite single-page
application for a specialty coffee roastery from Madinah, Saudi Arabia. The
site is **Arabic first and right to left**, with an English toggle.

The brand research behind every fact on the site is written up in
`docs/superpowers/specs/2026-09-19-bloom-roastery-rebrand-design.md`. Read it
before changing copy, prices or branch data: most of it was recovered from
sources that are hard to reach, and the spec records what could not be
confirmed.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - TypeScript type-check then Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally
- `npm run images` - Regenerate responsive image derivatives and the manifest

`images` runs automatically before `dev` and `build`. It is incremental, so an
unchanged source costs nothing.

## Architecture

- **Entry point**: `index.html` → `src/main.tsx` → `src/App.tsx`
- **Build output**: `dist/`
- **Image originals**: `assets-src/` (never served; the source the pipeline reads)
- **Static assets**: `public/`

### Localisation and direction

`LanguageContext` owns the language, and is the only place that writes
`document.documentElement.lang` and `.dir`. Arabic is the default.

It also exposes **`sign`**, which is `+1` in LTR and `-1` in RTL. Any Motion
`x` offset must be multiplied by it:

```tsx
const { sign } = useLanguage();
<motion.div initial={{ opacity: 0, x: -14 * sign }} animate={{ opacity: 1, x: 0 }} />
```

`transform` has no logical equivalent and the W3C proposal for one is still
open, so `translateX` keeps its sign when the document flips. Motion's `x` prop
is `translateX`. Forgetting `sign` makes an element fly in from the wrong edge
in Arabic, and nothing will fail loudly.

Localised data uses `Localized = { ar, en }` read through `pick(value, lang)`
from `src/types`. There is deliberately no second data file per language: the
outgoing site kept two and they drifted.

### Writing RTL safe CSS

Use logical properties throughout: `margin-inline-start`, `padding-block`,
`inset-inline`, `border-block-end`, `text-align: start`. Never `left`, `right`,
`margin-left` or `padding-right` for anything asymmetric.

What logical properties do **not** cover, and so needs an explicit
`[dir='rtl']` rule:

- `transform`, including `translateX` and arrow mirroring
- `background-position`, gradients, `box-shadow` offsets, `clip-path`

Arabic typography also needs script aware overrides, which already exist in
`src/index.css` at the `[dir='rtl']` block:

- `letter-spacing` must be `0`. Arabic connects, and tracking breaks the joins.
- `text-transform: uppercase` is meaningless and must be turned off.
- Arabic body runs larger with more leading than the Latin equivalent.

Wrap Western numbers that sit inside Arabic text in `<bdi>`: phone numbers,
time ranges, counts. Without it the bidi algorithm reorders the groups.

### Currency

Use `<Price value={32} />`. Do not format prices by hand and do not use
`Intl.NumberFormat`: the `ar-SA` locale silently returns Arabic-Indic digits
while plain `ar` does not, and its currency form injects invisible RLM marks.

The new Saudi riyal sign is U+20C1 and **cannot be used here**: Google's
`latin-ext` subset range stops at U+20C0, one codepoint short, so it renders as
`.notdef` in every font this site loads. Prices print `SAR` and `ر.س` as text,
with Western digits, which is what Saudi sites do.

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
computed from the grids declared in the CSS modules, and the arithmetic is
written out beside each one. The menu grid lives in exactly one place,
`MenuCard.module.css`, because `MENU_CARD_SIZES` is derived from its column
counts; the home preview and the menu page both render through `MenuGrid` so
that a second grid definition cannot silently invalidate it.

All photography on the site is Bloom's own published material. Google Maps
photographs were deliberately not used: they belong to the reviewers who took
them.

To add an image: drop the original in `assets-src/<area>/`, run
`npm run images`, then reference it by its key (path minus extension).

### Scroll reveals

Every entrance on this site starts at `opacity: 0`, which means a reveal that
never fires is not a missed animation: it is copy that never appears, with no
scroll position that brings it back. Use **`useReveal`** from
`src/hooks/useReveal.ts` and nothing else. Do not reach for Motion's
`whileInView`, `viewport={{ once: true }}` or `useInView`: those are a single
IntersectionObserver callback with no second chance, and when one is missed
the section is gone for the life of the page.

`useReveal` keeps the observer as the fast path and adds two nets behind it: a
geometric re-check on a timer, which catches an observation computed while the
site was still mounting behind the loading field and `html` was
`overflow: hidden`, and a failsafe that shows the element outright if the
observer never reported at all. The timer is deliberately not
`requestAnimationFrame`, because frames stop in a background tab.

It returns `{ ref, revealed }`, and the call site drives Motion with
`animate={revealed ? { ... } : undefined}`. Prefer one reveal per band with the
children separated by their own `delay`, rather than an observer per line.

The same rule applies anywhere else content is hidden until a callback: `Image`
consults `img.complete` as well as `onLoad`, because a cached image can finish
before React attaches the handler, and `LoadingScreen` carries a wall clock cap
because the site mounts behind it and its counter runs on frames.

### Routing

Uses `HashRouter` from react-router-dom (hash-based routing for static hosting compatibility):
- `/` - HomePage
- `/menu` - MenuPage, the 53 real items
- `/branches` - BranchesPage
- `/contact` - ContactPage
- `*` - NotFoundPage

The hash is the route, so an in-page `href="#target"` would rewrite it. Jump
links must move focus in JavaScript instead (see the skip link in `App.tsx`).

`useLenis` sets `history.scrollRestoration = 'manual'` and scrolls to the top on
every pathname change. Without it the browser restores an offset that belongs to
whichever page was open last, which drops a deep link into the footer.

### Component Organization

```
src/
  components/
    common/   # Image, Logo, Price
    layout/   # Header, Footer, LoadingScreen
    home/     # HomePage sections
    menu/     # MenuGrid, MenuCard, MenuCategory, CategoryNav
  context/    # LanguageContext: language, direction, sign, translations
  data/       # menu, branches, contact and origins
  hooks/      # Custom hooks
  pages/      # Route-level components
  types/      # TypeScript interfaces, Localized and pick
```

### Key Libraries

- **react-router-dom**: Client-side routing
- **motion**: Animations and transitions. `MotionConfig reducedMotion="user"`
  wraps the app, so `prefers-reduced-motion` is honoured without per-component
  handling. Lenis is not instantiated at all under that setting.
- **lenis**: Smooth scroll
- **sharp**: Build-time image encoding (dev dependency, used by the image script)

### Known issue

`npm run lint` reports one pre-existing error in `src/hooks/useLenis.ts`:
`react-hooks/set-state-in-effect`. The hook creates the Lenis instance in an
effect, because it touches the DOM, then publishes it to context. Clearing it
properly means moving to `useSyncExternalStore`. It predates the rebrand.

## Deployment

The site is hosted at **lumako.net/bloomroastery**, a subdirectory rather than
a domain root, so `base` in `vite.config.ts` is `/bloomroastery/`. Set
`VITE_BASE` to build for a different path (`VITE_BASE=/ npm run build` for a
root). Note the host is `.net`, not `.ru`.

Every asset URL has to carry that prefix:

- Vite rewrites `src` and `href` in `index.html` and all bundled imports.
- Image manifest bases are stored **relative** (`img/brand/cover`, no leading
  slash). `Image.tsx` and `LoadingScreen.tsx` prepend
  `import.meta.env.BASE_URL`; the hero preload plugin prepends `BASE`, because
  `imagesrcset` is not an attribute Vite rewrites.
- `og:image` and `og:url` in `index.html` are written out in full. Link
  unfurlers fetch a plain URL and do not resolve a site relative path, and Vite
  does not touch `meta` content.

`public/.htaccess` ships with the build: it serves `index.html` for anything
that is not a real file, enables gzip, declares the AVIF and WebP types, and
caches hashed assets for a year while keeping `index.html` uncached. Its
`RewriteBase` repeats the deploy path, so change it alongside `base`.

To deploy: `npm run build`, then upload the **contents** of `dist/` (including
the dotfile `.htaccess`) into `bloomroastery/` under the site root.

## TypeScript Configuration

Strict mode enabled with additional checks:
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noFallthroughCasesInSwitch` and `noUncheckedSideEffectImports` enabled
- Uses bundler module resolution and React JSX transform

## ESLint

Uses flat config format (`eslint.config.js`) with TypeScript, React Hooks, and React Refresh plugins.

## Frontend Aesthetics

Avoid generic "AI slop" design. Create distinctive, creative frontends that surprise and delight.

**Colour**: The palette is the brand's own, sampled pixel exact from their logo:
rich black `#231F20` and acid chartreuse `#D7DE27`. Those are the only two
colours in their mark. The site puts them on a bone canvas (`#F6F4EF`) and
**rations the chartreuse hard**: the monogram, rules, active states, focus
rings, badges and one full bleed band. It is acid and unreadable as body text,
which is why `--color-chartreuse-deep` exists for the rare case where the
accent has to carry a word. Do not spread it around; its power is its scarcity.

**Typography**: Bloom publishes in exactly two faces and the site holds to
that. A bold geometric sans carries everything the brand says; a Didone is
reserved for the name itself. Both were read off Bloom's own artwork, and the
working is in `docs/superpowers/specs/2026-09-20-bloom-typography-correction-design.md`.

| Role | Latin | Arabic |
| --- | --- | --- |
| Display and headings | Outfit Bold, caps | Readex Pro Medium |
| Body and UI | Outfit | Readex Pro |
| Logo wordmark | Bodoni Moda, caps, 0.24em tracking | Readex Pro 200, kashida |
| Editorial accent | Bodoni Moda italic, the copy's own case | Readex Pro 200 |
| Lumako wordmark only | Inter | n/a |

Outfit carries no Arabic subset, so `Outfit, 'Readex Pro'` resolves Latin in
Outfit and falls through to Readex Pro for Arabic per character, free, because
of Google's unicode-range subsetting.

**Headings are bold, not light.** Bloom sets its headlines heavy and its
eyebrows light and widely tracked, so `--track-display` is slightly negative
(`-0.015em`) and the wide tracking lives on `--track-eyebrow` instead. A
display element that pins `var(--font-light)` is a leftover from the serif and
will read thin and generic.

No Didone covers Arabic. An Arabic accent line therefore resolves to Readex
Pro and separates itself from the heading by weight, 200 against the heading's
500, rather than by face. Arabic display weights sit at 500 because Arabic
carries more stroke per unit area than Latin at the same number.

`--font-wordmark` and `--font-accent` are both Bodoni Moda, held apart so that
reconsidering the accent cannot move the logo.

Cairo, Tajawal and Almarai are banned: they are the default across Saudi
ecommerce and read as generic. Aref Ruqaa was dropped in the same pass:
nothing calligraphic appears anywhere in Bloom's material. The accent face is
rationed the way the colour is, roughly one line per section.

**Motion**: Use the Motion library. Focus on high-impact moments. One well
orchestrated page load with staggered reveals beats scattered micro
interactions. Remember `sign` on every horizontal offset.

**Avoid**: Overused fonts, clichéd purple gradients on white, predictable
layouts, cookie-cutter patterns.

## Punctuation

This project bans dashes used as punctuation, in UI copy and in source comments
and docs alike: no em dash, no en dash, no double hyphen. Use a colon, a
semicolon, a comma, or a second sentence instead. Ranges take a word ("6:00 to
2:00"), which on the site means the `common.timeRange` translation key. Hyphens
inside compound words ("edge-to-edge"), CSS custom property names
(`--color-primary`), CLI flags and HTML comment delimiters are syntax, not
punctuation, and stay.
