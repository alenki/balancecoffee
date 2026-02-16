import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = 'public';
const QUALITY = 80;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImages(full)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

async function convert(file) {
  const ext = extname(file);
  const webpPath = file.replace(ext, '.webp');
  const originalStat = await stat(file);
  const originalKB = (originalStat.size / 1024).toFixed(1);

  try {
    await sharp(file)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const newStat = await stat(webpPath);
    const newKB = (newStat.size / 1024).toFixed(1);
    const savings = ((1 - newStat.size / originalStat.size) * 100).toFixed(0);
    console.log(`${basename(file)}: ${originalKB} KB -> ${newKB} KB (-${savings}%)`);
    return { original: originalStat.size, converted: newStat.size };
  } catch (err) {
    console.error(`FAILED: ${file}: ${err.message}`);
    return { original: originalStat.size, converted: originalStat.size };
  }
}

const images = await findImages(PUBLIC_DIR);
console.log(`Found ${images.length} images to convert\n`);

let totalOriginal = 0;
let totalConverted = 0;

for (const img of images) {
  const result = await convert(img);
  totalOriginal += result.original;
  totalConverted += result.converted;
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
console.log(`Total WebP:     ${(totalConverted / 1024 / 1024).toFixed(1)} MB`);
console.log(`Savings:        ${((1 - totalConverted / totalOriginal) * 100).toFixed(0)}%`);
