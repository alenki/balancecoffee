# Biblioteka

Website for **Biblioteka** (BIBΛIOTEKA), a coffee and books café on the ground
floor of the business centre at 35 Pushkina Street, Nalchik. Open daily from
8:00 to 22:00; delivery on +7 928 916-88-77.

React 19, TypeScript and Vite. Russian first, with an English edition.

## Pages

| Route | Page |
|---|---|
| `#/` | Title page, foreword, menu preview, the reading room band, how to find us |
| `#/menu` | The full menu as a grid of cards, one per item. `#/menu?chapter=lemonades` opens at a section |
| `#/reading-room` | Photographs and guest quotes |
| `#/reviews` | Guest book: composes the review into a WhatsApp message to the café |

## Commands

```bash
npm install
npm run dev       # dev server (regenerates images first)
npm run build     # type-check and production build into dist/
npm run preview   # serve the production build
npm run lint
npm run images    # regenerate responsive images and the manifest
```

`public/img/` and `src/generated/` are build outputs and are gitignored, so a
fresh clone runs `npm run images` (or any `dev`/`build`, which do it first).

## Keeping it current

| What changes | Where |
|---|---|
| Prices, items, chapters | `src/data/menu.ts` and `src/data/menu.en.ts` (ids, prices and photos must match) |
| Phone, WhatsApp, socials, hours, Ramadan hours | `src/data/cafe.ts` |
| Copy in both languages | `src/context/LanguageContext.tsx` |
| Guest quotes | `src/data/guestQuotes.ts` |
| Reading room photographs and their alt text | `src/data/gallery.ts` |
| Photographs | drop originals in `assets-src/<area>/`, run `npm run images`, reference by key |

Opening status ("Открыто до 22:00") is computed live on Moscow time, and
switches to the Ramadan schedule automatically from the Islamic calendar.

The menu note at the bottom of `#/menu` says the prices were checked against
the board at the counter in October 2026. Update that line when prices change.

## Before going live

- `index.html` carries `noindex, nofollow`. Remove that meta tag once the site
  should appear in search.
- Make `og:image` an absolute URL on the final domain; Telegram and WhatsApp
  previews need one.

## Sources

Menu, prices, hours, address, coordinates, photographs and guest quotes come
from the café's own Yandex Maps listing (org 26863601865), its Yandex Business
page and its Instagram (@bibliotekanalchik), checked October 2026. The logo
marks are vector traces of the café's logo master.
