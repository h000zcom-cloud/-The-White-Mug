/**
 * Renders the favicon set from public/favicon.svg.
 *
 *   npm run icons
 *
 * The project referenced favicon.ico, logo192.png and manifest.json in its HTML
 * but none of those files existed, so every one was a 404 and browsers fell back
 * to a default icon. This generates real ones from the brand mark.
 *
 * PNG rather than ICO: sharp cannot write the ICO container, and every browser
 * still in use accepts `<link rel="icon" type="image/png">`. The SVG is declared
 * first anyway, which modern browsers prefer and which stays sharp at any size.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "..", "public");
const SRC = path.join(PUBLIC, "favicon.svg");

/** name -> pixel size. */
const TARGETS = {
  "favicon-32.png": 32,
  "favicon-48.png": 48,
  "icon-192.png": 192,
  "icon-512.png": 512,
  "apple-touch-icon.png": 180,
};

async function main() {
  const svg = await readFile(SRC);

  for (const [name, size] of Object.entries(TARGETS)) {
    // `density` matters: rasterising an SVG at the default 72dpi and scaling up
    // produces soft edges. Rendering at the target size directly keeps it crisp.
    const out = path.join(PUBLIC, name);
    const info = await sharp(svg, { density: Math.max(72, size * 4) })
      .resize(size, size, { fit: "contain", background: { r: 251, g: 250, b: 248, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`  ${name.padEnd(22)} ${size}x${size}  ${(info.size / 1024).toFixed(1)} KB`);
  }

  // Web app manifest, referenced from index.html.
  const manifest = {
    name: "The White Mug — Specialty Coffee & Pure Veg Cafe, Nashik",
    short_name: "The White Mug",
    description:
      "Specialty coffee house and 100% pure vegetarian cafe on Mahatma Nagar Road, College Road, Nashik.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FBFAF8",
    theme_color: "#FBFAF8",
    lang: "en-IN",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  await writeFile(path.join(PUBLIC, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log("  manifest.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
