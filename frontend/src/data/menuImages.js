/**
 * Photography assignment for every menu item.
 *
 * We have 18 photographs and ~75 items, so most items share a photo with the
 * rest of their family. This module is the single place that decides which.
 * When a real photo of an item arrives, drop it in `backend/static/images/`,
 * run `npm run images`, and change one line here.
 *
 * `quality` records how honest the match is, so the site can be upfront and so
 * you get a prioritised shot list rather than a vague "needs photos":
 *
 *   exact    – the photo genuinely depicts this item
 *   family   – same drink or dish family, different flavour or variant
 *   stand-in – nothing in the library depicts this; the closest plated shot
 *              is used and the item is on the shot list below
 *
 * `focus` nudges the crop so a grid of nine shakes doesn't look like one photo
 * repeated nine times. It maps to CSS object-position.
 */

const exact = (slug, focus) => ({ slug, quality: "exact", focus });
const family = (slug, focus) => ({ slug, quality: "family", focus });
const standIn = (slug, focus) => ({ slug, quality: "stand-in", focus });

export const MENU_IMAGES = {
  // A · Warm Specialty Coffees
  Espresso: exact("coffee_beans", "50% 40%"),
  Americano: family("pour_over", "50% 35%"),
  "Vienna Coffee": family("hot_chocolate", "50% 30%"),
  Cortado: family("barista_hands", "45% 50%"),
  Bombon: family("spanish_latte", "50% 60%"),
  "Flat White": family("barista_hands", "55% 45%"),
  Cappuccino: exact("barista_hands", "50% 50%"),
  Latte: family("spanish_latte", "50% 45%"),
  "Spanish Latte": exact("spanish_latte", "50% 50%"),
  "Hot Chocolate": exact("hot_chocolate", "50% 50%"),
  "Café Mocha": family("hot_chocolate", "50% 60%"),

  // B · Single Origin Manual Brews
  "French Press": exact("pour_over", "50% 50%"),
  Aeropress: family("coffee_beans", "50% 60%"),
  Chemex: exact("pour_over", "45% 45%"),
  "V60 Pour Over": exact("pour_over", "55% 55%"),

  // C · Iced Coffees & Signature Frappes
  "Iced Americano": family("iced_latte", "50% 30%"),
  "Iced Latte": exact("iced_latte", "50% 50%"),
  "Iced Mocha": family("iced_latte", "50% 60%"),
  "Flavoured Iced Latte": family("iced_latte", "45% 45%"),
  "Classic Frappe": exact("frappe", "50% 50%"),
  "Caramel / Hazelnut Frappe": exact("frappe", "50% 35%"),
  "Oreo / KitKat Frappe": family("frappe", "55% 55%"),
  "Brownie Frappe": family("brownie", "50% 60%"),
  "TWM Special Frappe": exact("frappe", "45% 45%"),

  // D · Coolers & Thick Shakes
  "Virgin Mojito": exact("mojito", "50% 50%"),
  "Fruit Mojito": family("mojito", "50% 35%"),
  "Blue Lagoon": family("mojito", "55% 55%"),
  "Peach / Lemon Iced Tea": family("mojito", "45% 60%"),
  "Passion Fruit Cooler": family("mojito", "50% 65%"),
  "Kiwi Mint Cooler": family("mojito", "55% 40%"),
  "Vanilla Shake": family("frappe", "50% 45%"),
  "Chocolate Shake": family("frappe", "45% 55%"),
  "Strawberry Shake": family("frappe", "55% 50%"),
  "Mango Shake": family("frappe", "50% 40%"),
  "Butterscotch Shake": family("frappe", "45% 35%"),
  "Oreo / KitKat Shake": family("frappe", "55% 60%"),
  "Brownie Shake": family("brownie", "45% 45%"),
  "Nutella Shake": family("frappe", "50% 55%"),
  "Lotus Biscoff Shake": family("frappe", "55% 35%"),

  // E · Open Toast (Sourdough) & Sandwiches
  "Masala Corn Toast": exact("sourdough_toast", "50% 50%"),
  "Cheese Bruschetta": family("sourdough_toast", "45% 40%"),
  "Tuscan Toast": exact("sourdough_toast", "55% 55%"),
  "BBQ Paneer Supreme": family("sourdough_toast", "50% 35%"),
  "Avocado Toast": exact("sourdough_toast", "50% 45%"),
  "Classic Coleslaw Crunch Sandwich": family("sandwich", "50% 40%"),
  "Spinach Corn Supreme Sandwich": family("sandwich", "45% 55%"),
  "BBQ Paneer Cheese Melt": exact("sandwich", "50% 50%"),
  "Glazed Onion Cheese Melt": family("sandwich", "55% 45%"),
  "Creamy Mushroom Bliss Sandwich": family("sandwich", "50% 60%"),

  // F · Freshly Baked Croissants
  "Butter Croissant": exact("croissant", "50% 50%"),
  "Veggie Delight Croissant Sandwich": family("croissant", "45% 55%"),
  "Paneer Tikka Croissant Sandwich": family("croissant", "55% 45%"),

  // G · Quick Bites & Snacks — the thinnest part of the photo library
  "French Fries — Salted": standIn("sandwich", "50% 70%"),
  "French Fries — Peri Peri": standIn("sandwich", "45% 65%"),
  "French Fries — Cheesy": standIn("sandwich", "55% 70%"),
  "Classic Potato Wedges": standIn("sandwich", "50% 65%"),
  "Cheese Garlic Potato Nuggets": standIn("sandwich", "45% 60%"),
  "Jalapeño Pops": standIn("sandwich", "55% 60%"),
  "Garlic Bread": standIn("pizza", "50% 65%"),
  "Cheese Garlic Bread": standIn("pizza", "45% 60%"),
  "Loaded Nachos": standIn("pizza", "55% 70%"),

  // H · Artisanal Pizzas & Pastas
  "Margherita Pizza": exact("pizza", "50% 50%"),
  "Veggie Supreme Pizza": family("pizza", "45% 45%"),
  "Paneer Tikka Pizza": family("pizza", "55% 55%"),
  "TWM Special Pizza": exact("pizza", "50% 40%"),
  "Penne Arrabbiata (Red)": standIn("pizza", "50% 60%"),
  "Penne Alfredo (White)": standIn("pizza", "45% 55%"),
  "TWM Pink Sauce Pasta": standIn("pizza", "55% 60%"),

  // I · Bakery & Fresh Desserts
  "Chocolate Brownie": exact("brownie", "50% 50%"),
  "Brownie with Ice Cream": exact("brownie", "45% 55%"),
  "Sizzling Brownie": exact("brownie", "55% 45%"),
  "Blueberry Cheesecake": exact("cheesecake", "50% 50%"),
  Affogato: family("brownie", "50% 40%"),
  "Chocolate Mousse": family("cheesecake", "45% 60%"),
};

/** Fallback so a newly added item never renders an empty tile. */
const CATEGORY_FALLBACK = {
  specialty: "barista_hands",
  manual: "pour_over",
  cold: "iced_latte",
  coolers: "mojito",
  toast: "sourdough_toast",
  croissant: "croissant",
  bites: "sandwich",
  pizza: "pizza",
  dessert: "brownie",
};

/**
 * Resolve the photo for a menu item. Always returns something renderable.
 */
export function imageFor(item) {
  const hit = MENU_IMAGES[item.name];
  if (hit) return hit;
  return {
    slug: CATEGORY_FALLBACK[item.category] ?? "hero_interior",
    quality: "stand-in",
    focus: "50% 50%",
  };
}

/**
 * Items whose photo is only a stand-in — i.e. the real shot list, in priority
 * order. Surfaced by `npm run photo-report` so it stays visible instead of
 * quietly rotting in a comment.
 */
export function shotList(menu) {
  return menu
    .filter((item) => imageFor(item).quality === "stand-in")
    .map((item) => ({ name: item.name, category: item.category }));
}
