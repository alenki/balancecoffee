/**
 * Build-time image pipeline.
 *
 * Reads originals from assets-src/, writes responsive AVIF + WebP derivatives to
 * public/img/, and emits a manifest carrying intrinsic dimensions and a blurred
 * base64 placeholder for every image.
 *
 * Incremental: a source whose content hash and encode settings are unchanged is
 * skipped. Byte-identical sources are encoded once and share their derivatives.
 *
 * Run via `npm run images` (also wired to prebuild/predev).
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname, relative, sep } from 'node:path';

const SRC_DIR = 'assets-src';
const OUT_DIR = join('public', 'img');
const GEN_DIR = join('src', 'generated');
const CACHE_FILE = join('node_modules', '.cache', 'site-images.json');

/** Bump when encoder settings change, to force a full re-encode. */
const ENCODER_VERSION = 1;

const PHOTO_ENCODE = {
  avif: { quality: 55, effort: 4, chromaSubsampling: '4:2:0' },
  webp: { quality: 78, effort: 5 },
};

/**
 * Width ladders, derived from the sizes these images actually render at.
 * First match wins. Ladder entries above the source width are dropped, and the
 * source width itself becomes the top rung: nothing is ever upscaled.
 */
const ROLES = [
  // Hero plate: the right-hand page of the opening spread, about half the
  // viewport on desktop and the full column on phones.
  { match: (k) => k === 'hall/counter', widths: [640, 960, 1280, 1680] },
  // Everything else: chapter plates, the night band, the reading room
  // masonry and the storefront. ~600 CSS px at most.
  { match: (k) => /^(hall|street|menu)\//.test(k), widths: [320, 480, 640, 960, 1280] },
];

const roleFor = (key) => ROLES.find((r) => r.match(key)) ?? { widths: [480, 960] };

/** assets-src/menu/iced-latte.jpg -> menu/iced-latte */
const keyFor = (file) =>
  relative(SRC_DIR, file).split(sep).join('/').replace(/\.[^.]+$/, '');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(png|jpe?g|webp|tiff?)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

/** Ladder clamped to the source width, with the source width as the top rung. */
function ladderFor(role, srcWidth) {
  const top = Math.min(srcWidth, role.widths[role.widths.length - 1]);
  const rungs = role.widths.filter((w) => w < top);
  return [...new Set([...rungs, top])].sort((a, b) => a - b);
}

/** ~24px wide, pre-blurred so the browser's upscale reads as a soft blur. */
async function makeLqip(buffer) {
  const out = await sharp(buffer)
    .rotate()
    .resize(24, null, { fit: 'inside' })
    .blur(1)
    .webp({ quality: 40, effort: 6 })
    .toBuffer();
  return `data:image/webp;base64,${out.toString('base64')}`;
}

async function loadCache() {
  try {
    const cache = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
    return cache.encoderVersion === ENCODER_VERSION ? cache.entries : {};
  } catch {
    return {};
  }
}

/** Runs tasks with bounded concurrency: large PNGs are memory-hungry. */
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i], i);
      }
    })
  );
  return results;
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No ${SRC_DIR}/ directory: nothing to build.`);
    process.exit(1);
  }

  const files = (await walk(SRC_DIR)).sort();
  const cache = await loadCache();
  const nextCache = {};
  const manifest = {};
  const byHash = new Map();

  let encoded = 0;
  let reused = 0;
  let deduped = 0;

  // Hash and read metadata first, so duplicate detection is order-independent.
  const prepared = await pool(files, 8, async (file) => {
    const buffer = await readFile(file);
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    const meta = await sharp(buffer).metadata();
    return { file, buffer, hash, key: keyFor(file), meta };
  });

  for (const item of prepared) {
    const role = roleFor(item.key);
    item.role = role;
    item.widths = ladderFor(role, item.meta.width);
    item.base = `/img/${item.key}`;
  }

  // Resolve duplicates up front, so concurrent workers can't both encode the
  // same content. The first key in sorted order owns the derivatives.
  const aliases = [];
  const canonical = [];
  for (const item of prepared) {
    const owner = byHash.get(item.hash);
    if (owner) aliases.push({ item, owner });
    else {
      byHash.set(item.hash, item);
      canonical.push(item);
    }
  }

  // Returns per-item byte totals. Accumulating into a shared counter from
  // inside the pool would lose updates, since `+=` reads before it awaits.
  const written = await pool(canonical, 4, async (item) => {
    const { key, hash, buffer, meta, role, widths, base } = item;

    const outputs = widths.flatMap((w) => [
      `${OUT_DIR}/${key}-${w}.avif`,
      `${OUT_DIR}/${key}-${w}.webp`,
    ]);
    const cached = cache[key];
    const fresh =
      cached &&
      cached.hash === hash &&
      cached.lqip !== undefined &&
      JSON.stringify(cached.widths) === JSON.stringify(widths) &&
      outputs.every((p) => existsSync(p));

    let lqip;
    if (fresh) {
      lqip = cached.lqip;
      reused++;
    } else {
      await mkdir(dirname(outputs[0]), { recursive: true });
      const enc = PHOTO_ENCODE;
      const pipeline = sharp(buffer).rotate();

      for (const w of widths) {
        const resized = pipeline.clone().resize(w, null, { withoutEnlargement: true });
        await Promise.all([
          resized.clone().avif(enc.avif).toFile(`${OUT_DIR}/${key}-${w}.avif`),
          resized.clone().webp(enc.webp).toFile(`${OUT_DIR}/${key}-${w}.webp`),
        ]);
      }
      lqip = await makeLqip(buffer);
      encoded++;
      process.stdout.write(`  ${key}  ${widths.join('/')}\n`);
    }

    const sizes = await Promise.all(outputs.map(async (p) => (await stat(p)).size));

    const entry = { base, w: meta.width, h: meta.height, widths, lqip };
    manifest[key] = entry;
    nextCache[key] = { hash, ...entry };

    const avif = sizes.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);
    const webp = sizes.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0);
    return { avif, webp };
  });

  // Aliases share the owner's derivatives: same base, no extra bytes on disk.
  for (const { item, owner } of aliases) {
    manifest[item.key] = { ...manifest[owner.key] };
    nextCache[item.key] = { hash: item.hash, ...manifest[owner.key] };
    deduped++;
  }

  // Stable key order keeps the generated file diff-friendly.
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));

  await mkdir(GEN_DIR, { recursive: true });
  await mkdir(dirname(CACHE_FILE), { recursive: true });

  const ts = `// GENERATED by scripts/build-images.mjs: do not edit.
// Run \`npm run images\` to regenerate.

export interface ImageMeta {
  /** Path prefix; append \`-<width>.<format>\`. */
  base: string;
  /** Intrinsic dimensions of the original, for width/height attributes. */
  w: number;
  h: number;
  /** Available widths, ascending. */
  widths: number[];
  /** Blurred ~24px placeholder as a data URI. */
  lqip: string;
}

export const images = ${JSON.stringify(sorted, null, 2)} satisfies Record<string, ImageMeta>;

export type ImageName = keyof typeof images;
`;

  await writeFile(join(GEN_DIR, 'image-manifest.ts'), ts);
  await writeFile(join(GEN_DIR, 'image-manifest.json'), JSON.stringify(sorted, null, 2));
  await writeFile(
    CACHE_FILE,
    JSON.stringify({ encoderVersion: ENCODER_VERSION, entries: nextCache }, null, 2)
  );

  const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
  const avif = written.reduce((n, w) => n + w.avif, 0);
  const webp = written.reduce((n, w) => n + w.webp, 0);

  console.log(
    `\n${files.length} sources, ${canonical.length} encoded to disk ` +
      `(${encoded} new, ${reused} cached, ${deduped} deduplicated)\n` +
      `public/img: ${mb(avif + webp)} on disk  ` +
      `[avif ${mb(avif)} + webp ${mb(webp)}]\n` +
      `A visitor downloads one format at one width per image, so the served ` +
      `weight is a small fraction of this.`
  );
}

await main();
