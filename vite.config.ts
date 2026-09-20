import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const HERO = 'brand/cover'

/**
 * Deploy base. The site is hosted in a subdirectory (lumako.net/bloomroastery),
 * so every generated URL has to carry that prefix. Override with VITE_BASE to
 * build for a different path, or with '/' for a domain root.
 */
const BASE = process.env.VITE_BASE ?? '/bloomroastery/'

interface ManifestEntry {
  base: string
  widths: number[]
}

/**
 * Preloads the hero image from index.html.
 *
 * #root is empty until the bundle has parsed, so without this the browser
 * cannot discover the LCP image by scanning the markup: it has to wait for
 * React to render the <img> first. Only AVIF is preloaded. Adding a second
 * preload for the WebP fallback would make AVIF capable browsers, which
 * support both, download the image twice.
 */
function heroPreload(): Plugin {
  return {
    name: 'bloom-hero-preload',
    transformIndexHtml(html) {
      let hero: ManifestEntry | undefined
      try {
        const manifest = JSON.parse(
          readFileSync('src/generated/image-manifest.json', 'utf8')
        ) as Record<string, ManifestEntry>
        hero = manifest[HERO]
      } catch {
        // Manifest missing: `npm run images` has not run yet. Skip the preload
        // rather than failing the build; the page still works without it.
      }
      if (!hero) return html
      const { base, widths } = hero
      // Manifest bases are relative to the deploy base, and `imagesrcset` is
      // not one of the attributes Vite rewrites, so prefix it here.
      const prefixed = BASE + base

      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              type: 'image/avif',
              imagesrcset: widths.map((w) => `${prefixed}-${w}.avif ${w}w`).join(', '),
              imagesizes: '100vw',
              fetchpriority: 'high',
            },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), heroPreload()],
})
