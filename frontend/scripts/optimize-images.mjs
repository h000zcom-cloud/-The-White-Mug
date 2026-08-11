/**
 * Image pipeline for The White Mug.
 *
 * Source art lives in `backend/static/images/` as ~750 KB PNGs (18 files,
 * 13.7 MB total). Shipping those directly is the single largest performance
 * problem on the site: on a typical Indian 4G connection the hero alone costs
 * several seconds before anything is visible.
 *
 * This script derives, for every source image, a responsive ladder in AVIF and
 * WebP plus one compressed JPEG fallback, and writes a manifest the React side
 * consumes to build `srcset`/`sizes` and reserve layout space (which removes
 * cumulative layout shift).
 *
 * Run:  npm run images
 *
 * Output is deterministic, so it is safe to commit `public/img/` and skip the
 * step in CI. Re-running skips derivatives that are already newer than their
 * source, so it is cheap in a watch loop.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(FRONTEND, "..", "backend", "static", "images");
const OUT_DIR = path.join(FRONTEND, "public", "img");
const MANIFEST = path.join(FRONTEND, "src", "data", "imageManifest.json");

/**
 * Widths to emit. Chosen against the layouts that actually exist in the design
 * rather than round numbers: 400 covers menu thumbnails and the mobile chip
 * rail, 800 covers single-column mobile hero and the bento tiles, 1200 covers
 * two-column desktop cards, 1800 covers the full-bleed hero on a 2x laptop.
 */
const WIDTHS = [400, 800, 1200, 1800];

/** Quality settings tuned per format. AVIF holds up far lower than JPEG. */
const AVIF = { quality: 45, effort: 6, chromaSubsampling: "4:2:0" };
const WEBP = { quality: 72, effort: 5 };
const JPEG = { quality: 76, progressive: true, mozjpeg: true };

/**
 * A tiny blurred placeholder, inlined as a data URI. Shown underneath the real
 * image so a loading tile reads as "this is a photo arriving" rather than a
 * grey hole, without costing an extra network request.
 */
async function makeBlurPlaceholder(input) {
  const buf = await sharp(input)
    .resize(20, null, { fit: "inside" })
    .blur(1.2)
    .webp({ quality: 28 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

/** Average colour, used as the CSS background while the placeholder decodes. */
async function dominantColor(input) {
  const { dominant } = await sharp(input).stats();
  const hex = (n) => n.toString(16).padStart(2, "0");
  return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;
}

async function newerThan(target, source) {
  try {
    const [t, s] = await Promise.all([stat(target), stat(source)]);
    return t.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

async function processOne(file) {
  const slug = path.basename(file, path.extname(file));
  const src = path.join(SRC_DIR, file);
  const meta = await sharp(src).metadata();

  const variants = { avif: {}, webp: {} };
  let bytesWritten = 0;

  // Never upscale: cap the ladder at the source's own width.
  const widths = WIDTHS.filter((w) => w <= meta.width).concat(
    WIDTHS.every((w) => w > meta.width) ? [meta.width] : [],
  );

  for (const width of widths) {
    const jobs = [
      { ext: "avif", opts: AVIF, bag: variants.avif },
      { ext: "webp", opts: WEBP, bag: variants.webp },
    ];

    for (const { ext, opts, bag } of jobs) {
      const name = `${slug}-${width}.${ext}`;
      const out = path.join(OUT_DIR, name);
      bag[width] = `/img/${name}`;

      if (await newerThan(out, src)) {
        bytesWritten += (await stat(out)).size;
        continue;
      }
      const info = await sharp(src)
        .resize(width, null, { withoutEnlargement: true })
        [ext](opts)
        .toFile(out);
      bytesWritten += info.size;
    }
  }

  // One JPEG at the largest width, for browsers without AVIF or WebP support.
  const fallbackWidth = widths[widths.length - 1];
  const fallbackName = `${slug}-${fallbackWidth}.jpg`;
  const fallbackPath = path.join(OUT_DIR, fallbackName);
  if (!(await newerThan(fallbackPath, src))) {
    await sharp(src).resize(fallbackWidth, null, { withoutEnlargement: true }).jpeg(JPEG).toFile(fallbackPath);
  }
  bytesWritten += (await stat(fallbackPath)).size;

  const [blur, color] = await Promise.all([makeBlurPlaceholder(src), dominantColor(src)]);
  const originalBytes = (await stat(src)).size;

  return {
    slug,
    entry: {
      width: meta.width,
      height: meta.height,
      aspectRatio: +(meta.width / meta.height).toFixed(4),
      widths,
      avif: variants.avif,
      webp: variants.webp,
      fallback: `/img/${fallbackName}`,
      blur,
      color,
      hash: createHash("sha1").update(slug).digest("hex").slice(0, 8),
    },
    originalBytes,
    bytesWritten,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  if (!files.length) {
    console.error(`No source images found in ${SRC_DIR}`);
    process.exit(1);
  }

  console.log(`Optimizing ${files.length} images -> ${path.relative(FRONTEND, OUT_DIR)}\n`);

  const manifest = {};
  let totalOriginal = 0;
  let totalLargestAvif = 0;

  // Sequential on purpose: sharp already parallelizes internally, and running
  // 18 AVIF encodes at once starves the machine on a laptop.
  for (const file of files) {
    const { slug, entry, originalBytes } = await processOne(file);
    manifest[slug] = entry;
    totalOriginal += originalBytes;

    const largest = entry.widths[entry.widths.length - 1];
    const avifSize = (await stat(path.join(FRONTEND, "public", entry.avif[largest]))).size;
    totalLargestAvif += avifSize;

    const pct = Math.round((1 - avifSize / originalBytes) * 100);
    console.log(
      `  ${slug.padEnd(20)} ${String(entry.width).padStart(5)}px  ` +
        `${(originalBytes / 1024).toFixed(0).padStart(4)} KB PNG -> ` +
        `${(avifSize / 1024).toFixed(0).padStart(3)} KB AVIF @${largest}px  (-${pct}%)`,
    );
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const saved = 1 - totalLargestAvif / totalOriginal;
  console.log(
    `\nSource PNGs        ${(totalOriginal / 1024 / 1024).toFixed(2)} MB` +
      `\nLargest AVIF set   ${(totalLargestAvif / 1024 / 1024).toFixed(2)} MB` +
      `\nReduction          ${(saved * 100).toFixed(1)}%` +
      `\n\nManifest -> ${path.relative(FRONTEND, MANIFEST)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
