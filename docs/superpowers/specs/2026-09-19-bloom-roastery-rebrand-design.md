# Bloom Roastery rebrand

Date: 2026-09-19
Status: approved, in implementation

Readapts the Harmony Coffee site (React 19, TypeScript, Vite, Russian with an
EN toggle) into a site for **Bloom Roastery** (بلوم روستري), a specialty coffee
roastery from Madinah, Saudi Arabia. Arabic first, right to left, with an
English toggle.

## The brand, as researched

Everything below was taken from Bloom's own published material, not invented.

### Identity

| Token | Value | Source |
| --- | --- | --- |
| Rich black | `#231F20` | sampled pixel exact from their logo PNG |
| Chartreuse | `#D7DE27` | sampled pixel exact from their logo PNG |

Those are the only two colours in the mark. Their own Salla storefront runs an
entirely greyscale theme (`--color-primary: #5d5d5d`) and never uses the
chartreuse, so the accent is effectively unused on the web today. The meta
`theme-color` of `#37a495` on their store is Salla's platform teal, not brand.

The logo is a bilingual horizontal lockup: `BLOOM ROASTERY` in a light, very
widely tracked all caps transitional serif, over `بلـــوم روســـتري` in a light
monolinear Arabic with extended kashida, beside a chartreuse **B/R monogram**
whose B bowl is crossed by an R leg.

A secondary brand ornament exists: an Islamic interlace band in pale grey with
chartreuse diamonds.

### Company

- Trading name: Bloom Roastery, بلوم روستري
- Owner: شركة مقهى ازدهار القهوة لتقديم المشروبات القابضة. *Izdihar* means
  blooming, so the Arabic company name is the brand name's own root.
- CR 4650546708 (05/05/1439H), VAT 311085354400003, trademark 1439017731
- Registered address: شارع سلطانة، حي القبلتين، ص.ب 4855، المدينة المنورة 42314
- Contact: +966 55 313 1751 (also WhatsApp), info@br.sa.com
- Roaster: Loring S15 Falcon
- Socials: instagram, snapchat, tiktok, x, all at `bloomroastery`
- Shop: br.sa.com, a Salla store, currently dormant (every category returns zero
  products)

### Branches

Hours are 6:00 to 2:00 chain wide.

| Branch | Street | Coordinates | Phone | Rating |
| --- | --- | --- | --- | --- |
| Sultana (flagship, opened 2019) | شارع سلطانة, in the Alsunbuleya complex | 24.4843744, 39.5726766 | see note | 4.3 from 3,791 reviews |
| Al Faisaliah (opened 22 Jan 2026) | Rufaidah Al Ansariah, Al Jamiah 42351 | 24.4744217, 39.5675053 | +966 53 800 9488 | 4.4 |
| Mahzoor (opened about 2 Mar 2026) | طلحة بن الحسين العنبري, Mahzur 42319 | 24.4358591, 39.6535219 | +966 53 262 3784 | 4.6 |
| Jeddah | 11 West, Hiraa St, Ash Shati | not yet listed | none | coming soon |

Notes carried into the data file as comments:

- Sultana's phone conflicts across sources: Google says +966 55 590 5701,
  Snapchat and two directories say 053 003 9936. The site uses the company
  number instead of picking a side.
- The Al Faisaliah branch is *named* الفيصلية but both Google and OpenStreetMap
  place it in حي الجامعة. The site prints the street, never "Al Faisaliah
  district".
- Jeddah has no Google listing and was absent from their Linktree at research
  time. It is labelled coming soon and carries no phone or hours.

### Menu

53 items harvested from their live QR menu, with Arabic names, calories and
current prices. Their full resolution photography came from the same source:
the menu's thumbnails wrap an unresized original once the crop suffix is
stripped off the URL.

Four categories: الفطور breakfast (11), الحلويات sweets (15), المشروبات الباردة
cold (16), المشروبات الحارة hot (11).

The prices in the Ninja delivery listing are marked up. Their own menu is
authoritative and is what the site uses: espresso 13 not 15, cappuccino 17 not
19, flat white 17, V60 20, cold brew 26, avocado toast 32, French toast 35.

Item descriptions are written fresh for this site. Their own copy is long
marketing prose that does not fit a card and is theirs, not ours.

### Origins

Four beans, recovered from the dormant store's sitemap: El Salvador Buena
Vista, Ethiopia Guji Uraga, Colombia Caldas, and Papabisa Blend. No tasting
notes survive, so the site names the origins without inventing cupping scores.

## Design

**Direction: Madinah light.** Their photography is bright, daylit, white
tables. The canvas is bone, type is the rich black, and the chartreuse is
rationed hard: the monogram, rules, active states, focus rings, and one
full bleed band. The roastery section inverts to near black, which is where the
chartreuse earns its keep. The interlace ornament appears as a hairline motif
at section seams.

This is deliberately the opposite of the outgoing warm taupe franchise look.

### Typography

> **The Latin half of this section was superseded on 2026-09-20.** Both Latin
> faces were chosen without a sample of Bloom's own artwork, and both had the
> genre wrong: the wordmark is a Didone rather than a Garamond, and Bloom sets
> everything it publishes in a geometric sans rather than a neo grotesque. The
> table is kept for the record. See
> `2026-09-20-bloom-typography-correction-design.md` for the artwork, the
> identification method and the system that replaced this one. The Arabic
> reasoning below still stands, and the correction confirmed it.

Four families, each with one job.

| Role | Latin | Arabic |
| --- | --- | --- |
| Display | Cormorant Garamond Light, caps, wide tracking | Readex Pro Light |
| Body and UI | Onest | Readex Pro |
| Editorial accent | Cormorant italic | Aref Ruqaa |
| Lumako wordmark only | Inter | n/a |

Onest carries no Arabic subset, so a stack of `Onest, 'Readex Pro'` resolves
Latin in Onest and falls through to Readex Pro for Arabic, per character, at no
cost: Google's unicode-range subsetting makes the fallback free.

Cairo, Tajawal and Almarai were rejected on purpose. They are the default
across Saudi ecommerce and read as generic. Readex Pro is one variable file
(2.2KB of CSS against 15.4KB for IBM Plex Sans Arabic's seven static weights)
and its monolinear modern build matches Bloom's own Arabic logotype.

Arabic typography rules that differ from the Latin ones already in the repo:

- `letter-spacing` must be `0`. Arabic is a connected script and tracking
  breaks the joins. Every tracked heading needs a script aware override.
- Arabic body wants roughly 18 to 20px where Latin sits at 15 to 16, with
  `line-height` 1.6 to 1.8 rather than 1.4.
- `text-transform: uppercase` is meaningless in Arabic and must not apply.

### Currency

Prices print Western digits (`32`), which is what Saudi sites do even on
Arabic pages: a scan of niceonesa.com/ar and jarir.com/sa-ar found zero
Arabic-Indic digits.

The currency reads `SAR` in English and `ر.س` in Arabic, as text. The new
Saudi riyal sign is **U+20C1**, shipped in Unicode 17.0 on 9 September 2025,
but it cannot be used here: Google's `latin-ext` subset range is
`U+20A0-20AB, U+20AD-20C0`, which stops one codepoint short, so the glyph
renders as `.notdef` with any Google webfont. CLDR also still lists it as
`symbol-alt-variant` while `SAR` and `ر.س.‏` remain primary. Of five major
Saudi retailers scanned, none emit the literal character.

`Intl.NumberFormat` is avoided for prices: `ar-SA` defaults to Arabic-Indic
digits while plain `ar` does not, and the currency form wraps output in
invisible RLM marks that fight hand tuned layout.

## Architecture

### Routes

| Route | Was | Now |
| --- | --- | --- |
| `/` | HomePage | HomePage |
| `/menu` | MenuPage | MenuPage, 53 real items |
| `/roastery` | n/a (was `/daily`) | the Loring S15, the four origins, the izdihar story, links out to the shop |
| `/branches` | n/a (was `/reviews`) | three Madinah branches plus Jeddah |
| `/contact` | n/a | contact and enquiries |
| `*` | NotFoundPage | NotFoundPage |

`/daily` and `/reviews` are dropped. Daily had no Bloom content to carry and
Reviews was a form that discarded its input and showed a thank you screen.

### Localisation

`Lang` becomes `'ar' | 'en'`, default `'ar'`, persisted under a new storage key.
The provider sets both `document.documentElement.lang` and `.dir`.

Localised data moves from two parallel files (`menu.ts` and `menu.en.ts`, which
had to be kept in lockstep by hand) to one file with a `Localized = {ar, en}`
value per field, read through a `pick(value, lang)` helper. This halves the
surface where the two languages can drift apart.

### RTL

Layout flips via CSS logical properties (`margin-inline-start`, `inset-inline`,
`padding-block`, `text-align: start`), which are Baseline Widely Available. No
duplicate RTL stylesheet and no `postcss-rtlcss` build step.

What does **not** flip automatically, and is handled by hand:

- `transform` has no logical equivalent and the W3C proposal for one is still
  open, so `translateX` keeps its sign under `dir=rtl`. Motion's `x` prop is
  `translateX`, so every horizontal entrance animation in this codebase
  multiplies its offset by a direction sign from a `useDirection()` hook.
- `background-position`, gradients, `box-shadow` offsets and `clip-path`.
- Directional SVG arrows, which are mirrored with a transform keyed on `:dir()`.

Phone numbers and time ranges sitting inside Arabic text are wrapped in `<bdi>`
so the bidi algorithm does not reorder them.

### Images

All photography is Bloom's own published material:

- 53 menu photographs at 1280px, from their live QR menu
- one hero, their own cover shot
- the wordmark and the B/R monogram

Google Maps photographs were deliberately **not** used. They belong to the
reviewers who took them, not to Bloom.

No interior photography exists that can be used legitimately, so the site
builds its atmosphere from the product photography, the palette and the
typography instead of padding with stock cafe interiors that are not Bloom.

The outgoing `assets-src/cafe/` stock photographs and the old menu photographs
are deleted. They are tracked in git and so remain recoverable.

`scripts/build-images.mjs` gains a `brand/` role for the hero ladder; the
`menu/` and `logos/` roles carry over unchanged.

### Deployment

Deploys to **lumako.net/bloomroastery**. `base` in `vite.config.ts` becomes
`/bloomroastery/`, `RewriteBase` in `public/.htaccess` matches, and the
absolute `og:image` and `og:url` in `index.html` are rewritten to the
lumako.net host. Note this is `.net`, not the `.ru` the old build used.

`leaflet`, `react-leaflet` and `@types/leaflet` are uninstalled. Nothing
imported them, and `/branches` uses static map links rather than a map runtime.

## Out of scope

- A working contact or enquiry backend. The form posts nowhere; this is stated
  in a comment rather than faked with a thank you screen.
- Ecommerce. The shop stays on br.sa.com and the site links out to it.
- Real interior photography, which does not exist in usable form.
- Tasting notes for the four origins, which are not recoverable.
