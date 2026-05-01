// scripts/compress-images.mjs
// Run once to compress large images in assets/img/.
// Usage: npm run compress-images
// Requires: npm install -D sharp
//
// Biggest offender: hangul-papers.jpg (2.1MB)

import sharp from "sharp";
import { readdir, stat, mkdir, copyFile, writeFile, rename } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const IMAGE_DIRS = ["assets/img"];
const BACKUP_DIR = join(__dirname, "image-originals");
const MIN_BYTES = 100 * 1024;
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = { quality: 85, compressionLevel: 9 };

const EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, results);
    else if (EXTS.has(extname(e.name).toLowerCase())) results.push(full);
  }
  return results;
}

async function ensureBackup(filePath) {
  await mkdir(BACKUP_DIR, { recursive: true });
  const dest = join(BACKUP_DIR, basename(filePath));
  if (!existsSync(dest)) await copyFile(filePath, dest);
}

async function compress(filePath) {
  const s = await stat(filePath);
  if (s.size < MIN_BYTES) return null;

  await ensureBackup(filePath);

  const ext = extname(filePath).toLowerCase();
  const meta = await sharp(filePath).metadata();
  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  let pipeline = sharp(filePath);
  if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  pipeline = ext === ".png"
    ? pipeline.png(PNG_QUALITY)
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  const buf = await pipeline.toBuffer();
  if (buf.length >= s.size) return null;

  const tmp = filePath + ".tmp";
  await writeFile(tmp, buf);
  await rename(tmp, filePath);
  return { before: s.size, after: buf.length, saved: s.size - buf.length };
}

async function main() {
  console.log("🖼️  aaronsnowberger.com — image compression\n");
  let totalSaved = 0, count = 0;

  for (const dir of IMAGE_DIRS) {
    const files = await walk(join(ROOT, dir));
    for (const f of files) {
      const r = await compress(f);
      if (!r) continue;
      const pct = Math.round((r.saved / r.before) * 100);
      console.log(`  ✓ ${f.replace(ROOT + "/", "")}`);
      console.log(`    ${kb(r.before)} → ${kb(r.after)}  (−${pct}%)`);
      totalSaved += r.saved;
      count++;
    }
  }

  if (count === 0) console.log("  All images already optimized.");
  else {
    console.log(`\n  ${count} image${count !== 1 ? "s" : ""} compressed.`);
    console.log(`  Total saved: ${kb(totalSaved)}`);
  }
}

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
main().catch(console.error);
