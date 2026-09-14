# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harmony Coffee is a React 19 + TypeScript + Vite single-page application for a coffee shop chain with multiple city locations.

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
- **Static assets**: `public/` (public) and `src/assets/` (bundled)

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
choosing against the old layout.

To add an image: drop the original in `assets-src/<area>/`, run
`npm run images`, then reference it by its key (path minus extension).

### Routing

Uses `HashRouter` from react-router-dom (hash-based routing for static hosting compatibility):
- `/` - HomePage
- `/menu` - MenuPage
- `/daily` - DailyPage
- `/reviews` - ReviewsPage
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
    common/   # Reusable UI (Image, Logo)
    layout/   # App shell (Header, Footer)
    home/     # HomePage sections
    menu/     # MenuPage components
  context/    # React Context providers
  data/       # Static data (locations, menu items)
  hooks/      # Custom hooks
  pages/      # Route-level components
  types/      # TypeScript interfaces
```

### Key Libraries

- **react-router-dom**: Client-side routing
- **motion**: Animations and transitions. `MotionConfig reducedMotion="user"`
  wraps the app, so `prefers-reduced-motion` is honoured without per-component
  handling. Lenis is not instantiated at all under that setting.
- **lenis**: Smooth scroll
- **sharp**: Build-time image encoding (dev dependency, used by the image script)

`leaflet`, `react-leaflet` and `@types/leaflet` are still in `package.json` but
nothing imports them. They can be uninstalled.

## TypeScript Configuration

Strict mode enabled with additional checks:
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noFallthroughCasesInSwitch` and `noUncheckedSideEffectImports` enabled
- Uses bundler module resolution and React JSX transform

## ESLint

Uses flat config format (`eslint.config.js`) with TypeScript, React Hooks, and React Refresh plugins.

## Frontend Aesthetics

Avoid generic "AI slop" design. Create distinctive, creative frontends that surprise and delight.

**Typography**: Choose beautiful, unique fonts. Avoid generic choices (Arial, Inter, Roboto, system fonts, Space Grotesk).

The site is set in **Onest** (`--font-primary` / `--font-display`, weights 100 to
900) with **Playfair Display** italic as the editorial accent (`--font-serif`).
Playfair is deliberately rationed: hero line three, section eyebrows, stat
labels and footer headings. Do not spend it on body or product copy. Inter is
loaded for one thing only, the Lumako wordmark in the footer.

**Color & Theme**: Commit to a cohesive aesthetic using CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw inspiration from IDE themes and cultural aesthetics.

**Motion**: Use the Motion library for animations. Focus on high-impact moments. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

**Backgrounds**: Create atmosphere and depth. Layer CSS gradients, use geometric patterns, or add contextual effects rather than defaulting to solid colors.

**Avoid**: Overused fonts, clichéd purple gradients on white, predictable layouts, cookie-cutter patterns. Vary between light/dark themes and make unexpected choices that feel genuinely designed for the context.

## Punctuation

This project bans dashes used as punctuation, in UI copy and in source comments and docs alike: no em dash, no en dash, no double hyphen. Use a colon, a semicolon, a comma, or a second sentence instead. Ranges take a word ("8:00 to 23:00"), which on the site means the `common.timeRange` translation key. Hyphens inside compound words ("edge-to-edge"), CSS custom property names (`--color-primary`), CLI flags and HTML comment delimiters are syntax, not punctuation, and stay.
