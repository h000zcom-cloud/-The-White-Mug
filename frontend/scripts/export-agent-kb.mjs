/**
 * Generates the knowledge base document for the ElevenLabs conversational agent.
 *
 *   npm run agent-kb
 *
 * Writes `agent/knowledge-base.md`, which you upload to the agent's Knowledge
 * Base panel.
 *
 * Generated rather than hand-written on purpose: the menu is the source of
 * truth, so a price change or a new item flows into the agent by re-running this
 * instead of someone remembering to edit a second copy. A stale knowledge base
 * is worse than none — the agent will quote last season's prices with total
 * confidence.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MENU, CATEGORIES, ADDONS, REVIEWS } from "../src/data/menu.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "..", "agent", "knowledge-base.md");

const CAFE = {
  name: "The White Mug",
  tagline: "Specialty coffee house and 100% pure vegetarian cafe",
  address:
    "Shop 4, 5 & 6, 8 Building, Mahatma Nagar Road, Veer Sawarkar Nagar, College Road, Nashik, Maharashtra 422005",
  phone: "+91 95611 66185",
  altPhone: "786 100 4444",
  hours: "Every day, 9:30 AM to 11:00 PM",
  instagram: "@thewhitemugcafe",
  rating: "4.6 out of 5 from 460+ Google reviews",
  maps: "https://www.google.com/maps/place/20.0063999,73.7546168",
};

const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
const price = (m) => (m.priceRange ? `INR ${m.priceRange}` : `INR ${m.price}`);

/** Items grouped by category, in menu order. */
function menuSection() {
  const lines = [];
  for (const cat of CATEGORIES.filter((c) => c.id !== "all")) {
    const items = MENU.filter((m) => m.category === cat.id);
    if (!items.length) continue;

    lines.push(`### ${cat.label}`, "");
    for (const m of items) {
      const tags = [];
      if (m.bestseller) tags.push("bestseller");
      if (m.special) tags.push("house special");
      if (m.specialty) tags.push("specialty coffee");
      const suffix = tags.length ? ` _(${tags.join(", ")})_` : "";
      lines.push(`- **${m.name}** - ${price(m)}${suffix}  `, `  ${m.desc}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

/**
 * What we can honestly say is popular.
 *
 * Only two signals exist in the data: the bestseller/special flags, and the
 * three named reviews. Anything beyond that would be invented, so the document
 * states the limit explicitly — the agent reads this and inherits the honesty.
 */
function popularitySection() {
  const bestsellers = MENU.filter((m) => m.bestseller);
  const specials = MENU.filter((m) => m.special && !m.bestseller);

  const lines = [
    "## What is actually popular",
    "",
    "These are the only popularity signals that exist. Do not invent ratings,",
    "review counts, or percentages for individual items.",
    "",
    "### Bestsellers - the most-ordered items",
    "",
  ];

  for (const m of bestsellers) {
    lines.push(`- **${m.name}** (${label(m.category)}, ${price(m)}) - ${m.desc}`);
  }

  lines.push("", "### House specials - what the kitchen is proudest of", "");
  for (const m of specials) {
    lines.push(`- **${m.name}** (${label(m.category)}, ${price(m)}) - ${m.desc}`);
  }

  lines.push(
    "",
    "### Items named in customer reviews",
    "",
    "Guests have specifically praised: Spanish Latte, Hot Chocolate, the",
    "single-origin manual brews, and the sourdough options. These are safe to",
    "recommend as customer favourites because real reviews mention them.",
    "",
  );

  return lines.join("\n");
}

function reviewsSection() {
  const lines = ["## Customer reviews on record", "", `Overall: ${CAFE.rating}.`, ""];
  for (const r of REVIEWS) {
    lines.push(`- ${r.name} (${r.rating}/5): "${r.text}"`);
  }
  lines.push(
    "",
    "There are only three reviews on file. When a guest asks what other",
    "customers think, you may quote these and reference the bestseller list.",
    "Never fabricate additional reviews or attribute opinions to guests.",
    "",
  );
  return lines.join("\n");
}

/** Dietary and practical facts that come up constantly. */
function factsSection() {
  const veganUnsafe = "Most drinks are made with dairy by default.";
  return [
    "## Practical facts",
    "",
    `- **Name**: ${CAFE.name} - ${CAFE.tagline}`,
    `- **Address**: ${CAFE.address}`,
    `- **Phone**: ${CAFE.phone} (alternate: ${CAFE.altPhone})`,
    `- **Hours**: ${CAFE.hours}`,
    `- **Instagram**: ${CAFE.instagram}`,
    `- **Directions**: ${CAFE.maps}`,
    "",
    "### Dietary",
    "",
    "- The kitchen is **100% pure vegetarian**. There is no meat, fish or egg",
    "  in any dish. Every item on the menu is safe for a vegetarian.",
    `- ${veganUnsafe} For a vegan guest, offer oat, soy or almond milk as a`,
    `  substitute at +INR ${ADDONS.milk.price}, and flag that some desserts and`,
    "  bakery items still contain dairy - tell them to confirm with staff.",
    "- Jain, gluten-free and allergy questions: do not guess. Say the kitchen",
    "  can advise and give the phone number.",
    "",
    "### Customisation",
    "",
    `- **Flavour shots** (+INR ${ADDONS.flavours.price}): ${ADDONS.flavours.items.join(", ")}`,
    `- **Alternative milks** (+INR ${ADDONS.milk.price}): ${ADDONS.milk.items.join(", ")}`,
    "",
    "### Reservations",
    "",
    "- Tables are booked over WhatsApp on the website, or by phone.",
    "- Birthday, anniversary and small-party requests are welcome.",
    "- There is no online ordering or delivery through the website.",
    "",
  ].join("\n");
}

/**
 * A small decision guide. The agent handles open-ended asks better with a few
 * worked routes than with the raw menu alone.
 */
function guidanceSection() {
  return [
    "## Recommending well",
    "",
    "Ask at most one clarifying question, then commit to a recommendation. A",
    "guest asking what to order wants an answer, not a questionnaire.",
    "",
    "| If the guest wants | Recommend | Why |",
    "| --- | --- | --- |",
    "| The single safest first order | Spanish Latte (INR 259) | Bestseller and house special, named in reviews |",
    "| Strong black coffee | Chemex (INR 359) or V60 Pour Over (INR 359) | Bestselling manual brews, clean and origin-forward |",
    "| Something sweet and creamy | TWM Special Frappe (INR 200) | House signature, bestseller |",
    "| No coffee at all | Hot Chocolate (INR 289) | Praised by name in reviews |",
    "| A proper meal | Avocado Toast (INR 399) or Tuscan Toast (INR 289) | Both bestsellers on house sourdough |",
    "| Dessert | Blueberry Cheesecake (INR 180) | Bestseller |",
    "| Something refreshing | Virgin Mojito (INR 130) | Light, no coffee |",
    "| To work for a few hours | Any manual brew, and mention fast Wi-Fi and the quiet corner seating | |",
    "| The cheapest way in | Iced Americano (INR 120) or Chocolate Brownie (INR 90) | Lowest price points |",
    "",
    "Always give the price with the name. Offer at most three options, and say",
    "which one you would pick.",
    "",
  ].join("\n");
}

async function main() {
  const bestsellers = MENU.filter((m) => m.bestseller).length;
  const specials = MENU.filter((m) => m.special).length;

  const doc = [
    "# The White Mug - Agent Knowledge Base",
    "",
    "> Generated by `npm run agent-kb`. Do not edit by hand - re-run the script",
    "> after changing `src/data/menu.js` so the agent never quotes stale prices.",
    "",
    `Menu items: ${MENU.length}. Bestsellers: ${bestsellers}. House specials: ${specials}.`,
    "",
    factsSection(),
    popularitySection(),
    reviewsSection(),
    guidanceSection(),
    "## Full menu",
    "",
    "All prices in Indian Rupees, inclusive of taxes. Every item is vegetarian.",
    "",
    menuSection(),
  ].join("\n");

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${doc}\n`, "utf8");

  console.log(
    `Knowledge base written to agent/knowledge-base.md` +
      `\n  ${MENU.length} items, ${bestsellers} bestsellers, ${specials} specials, ${REVIEWS.length} reviews` +
      `\n  ${(Buffer.byteLength(doc, "utf8") / 1024).toFixed(1)} KB` +
      `\n\nUpload it in the ElevenLabs agent under Knowledge Base.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
