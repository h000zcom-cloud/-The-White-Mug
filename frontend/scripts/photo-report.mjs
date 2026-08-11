/**
 * Prints the photography shot list for the menu.
 *
 * There are 18 photographs and ~75 menu items, so most items currently share a
 * photo with the rest of their family. This report separates the honest matches
 * from the stand-ins, so real photography can be commissioned against a list
 * rather than a hunch.
 *
 * Run:  npm run photo-report
 */
import { MENU, CATEGORIES } from "../src/data/menu.js";
import { imageFor } from "../src/data/menuImages.js";

const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

const buckets = { exact: [], family: [], "stand-in": [] };
for (const item of MENU) buckets[imageFor(item).quality].push(item);

const pct = (n) => `${Math.round((n / MENU.length) * 100)}%`;

console.log(`\nMenu photography — ${MENU.length} items\n${"─".repeat(52)}`);
console.log(`  exact     ${String(buckets.exact.length).padStart(3)}  ${pct(buckets.exact.length).padStart(4)}  photo shows this item`);
console.log(`  family    ${String(buckets.family.length).padStart(3)}  ${pct(buckets.family.length).padStart(4)}  same family, different variant`);
console.log(`  stand-in  ${String(buckets["stand-in"].length).padStart(3)}  ${pct(buckets["stand-in"].length).padStart(4)}  needs a real photograph`);

if (buckets["stand-in"].length) {
  console.log(`\nShot list — ${buckets["stand-in"].length} photographs needed\n${"─".repeat(52)}`);
  const byCategory = new Map();
  for (const item of buckets["stand-in"]) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, []);
    byCategory.get(item.category).push(item.name);
  }
  for (const [category, names] of byCategory) {
    console.log(`\n  ${label(category)}`);
    for (const n of names) console.log(`    · ${n}`);
  }
}

console.log(
  `\nTo add one: drop <slug>.png in backend/static/images/, run \`npm run images\`,` +
    `\nthen point the item at it in src/data/menuImages.js.\n`,
);
