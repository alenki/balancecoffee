import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { HERO_SIZES } from './src/components/common/imageSizes'

const HERO = 'hall/counter'

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
    name: 'hero-preload',
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

      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              type: 'image/avif',
              imagesrcset: widths.map((w) => `${base}-${w}.avif ${w}w`).join(', '),
              imagesizes: HERO_SIZES,
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
  plugins: [react(), heroPreload()],
  build: {
    rollupOptions: {
      output: {
        // Libraries change far less often than the site, so they get their
        // own long-lived chunks instead of riding in every content deploy.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          motion: ['motion', 'lenis'],
        },
      },
    },
  },
})
