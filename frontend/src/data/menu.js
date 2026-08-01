/**
 * Full menu for The White Mug – Cafe.
 * Prices in INR. Categories match the digital menu spec.
 */

export const CATEGORIES = [
  { id: "all", label: "All", tag: "" },
  { id: "specialty", label: "Specialty Coffees", tag: "☕" },
  { id: "manual", label: "Manual Brews", tag: "🧪" },
  { id: "cold", label: "Cold Brews & Frappes", tag: "🧊" },
  { id: "coolers", label: "Coolers & Shakes", tag: "🥤" },
  { id: "toast", label: "Sourdough & Sandwiches", tag: "🥪" },
  { id: "croissant", label: "Croissants", tag: "🥐" },
  { id: "bites", label: "Bites & Fries", tag: "🍟" },
  { id: "pizza", label: "Pizzas & Pasta", tag: "🍕" },
  { id: "dessert", label: "Desserts", tag: "🍰" },
];

/* Helper to build items compactly */
const item = (name, price, desc, cat, opts = {}) => ({
  name,
  price,
  desc,
  category: cat,
  ...opts,
});

export const MENU = [
  // A · Warm Specialty Coffees
  item("Espresso", 179, "A bold, concentrated shot of pure coffee essence.", "specialty", { image: "spanish_latte" }),
  item("Americano", 199, "Espresso mellowed with hot water for a smooth, long sip.", "specialty"),
  item("Vienna Coffee", 219, "Smooth coffee topped with a light layer of cream for a velvety finish.", "specialty"),
  item("Cortado", 219, "An espresso cut with an equal amount of warm steamed milk.", "specialty"),
  item("Bombon", 219, "Sweet condensed milk meets espresso for creamy indulgence.", "specialty"),
  item("Flat White", 219, "Velvety steamed milk atop a strong espresso base.", "specialty"),
  item("Cappuccino", 259, "Equal parts espresso, steamed milk and foamed milk. A classic.", "specialty", { image: "barista_hands" }),
  item("Latte", 259, "Smooth espresso swirled with plenty of steamed milk.", "specialty"),
  item("Spanish Latte", 259, "Smooth espresso swirled with steamed and condensed milk.", "specialty", { special: true, image: "spanish_latte" }),
  item("Hot Chocolate", 289, "Creamy cocoa delight for non-coffee days.", "specialty", { image: "hot_chocolate" }),
  item("Café Mocha", 299, "Rich cocoa, steamed milk and coffee — the ultimate trio.", "specialty"),

  // B · Single Origin Manual Brews
  item("French Press", 329, "Robust and full-bodied — unfiltered and comforting with every sip.", "manual", { image: "pour_over" }),
  item("Aeropress", 349, "Smooth, bold brew with a rich mouthfeel — brewed fast, served fresh.", "manual"),
  item("Chemex", 359, "Clean, crisp cup with delicate clarity — ideal for tasting subtle origin notes.", "manual", { image: "pour_over" }),
  item("V60 Pour Over", 359, "Light, smooth and balanced — brings out clear, gentle flavors.", "manual"),

  // C · Iced Coffees & Signature Frappes
  item("Iced Americano", 120, "Chilled espresso poured over ice and cold water.", "cold"),
  item("Iced Latte", 140, "Espresso swirled with chilled milk over ice.", "cold", { image: "iced_latte" }),
  item("Iced Mocha", 160, "Chilled espresso with cocoa and cold milk.", "cold"),
  item("Flavoured Iced Latte", 180, "Vanilla · Caramel · Hazelnut · Cinnamon · Popcorn · Irish Cream · TWM Special.", "cold", { priceRange: "160–180" }),
  item("Classic Frappe", 150, "Rich blended cold coffee with creamy froth.", "cold", { image: "frappe" }),
  item("Caramel / Hazelnut Frappe", 170, "Blended cold coffee infused with hazelnut or caramel glaze.", "cold"),
  item("Oreo / KitKat Frappe", 180, "Blended coffee with crunchy cookie or chocolate bits.", "cold"),
  item("Brownie Frappe", 190, "Rich cold coffee blended with fresh chocolate brownie chunks.", "cold"),
  item("TWM Special Frappe", 200, "Our signature house frappe blend.", "cold", { special: true, image: "frappe" }),

  // D · Coolers & Thick Shakes
  item("Virgin Mojito", 130, "Refreshing mint, lime and sparkling soda.", "coolers", { image: "mojito" }),
  item("Fruit Mojito", 140, "Green Apple · Watermelon · Orange Mint.", "coolers"),
  item("Blue Lagoon", 130, "Vibrant citrus blue refreshment.", "coolers"),
  item("Peach / Lemon Iced Tea", 120, "House-brewed iced tea infused with peach or lemon notes.", "coolers", { priceRange: "110–120" }),
  item("Passion Fruit Cooler", 145, "Tropical fruit chiller with real passion pulp.", "coolers"),
  item("Kiwi Mint Cooler", 150, "Fresh kiwi muddled with mint — cold and bright.", "coolers"),
  item("Vanilla Shake", 130, "Classic slow-blended vanilla thick shake.", "coolers"),
  item("Chocolate Shake", 140, "Cocoa-rich thick shake with a chocolate drizzle.", "coolers"),
  item("Strawberry Shake", 135, "Fresh strawberry blended into a creamy shake.", "coolers"),
  item("Mango Shake", 140, "Ripe Alphonso mango shake in season.", "coolers"),
  item("Butterscotch Shake", 140, "Butterscotch caramel shake with crunch bits.", "coolers"),
  item("Oreo / KitKat Shake", 160, "Cookies & chocolate blended thick.", "coolers"),
  item("Brownie Shake", 170, "Fresh brownie chunks blended into a shake.", "coolers"),
  item("Nutella Shake", 180, "Rich Nutella hazelnut chocolate shake.", "coolers"),
  item("Lotus Biscoff Shake", 200, "Caramelised biscoff cookie shake, our house favourite.", "coolers", { special: true }),

  // E · Open Toast (Sourdough) & Sandwiches
  item("Masala Corn Toast", 289, "Topped with cheese, corn, chilli and baked in oven.", "toast", { image: "sourdough_toast" }),
  item("Cheese Bruschetta", 289, "Light zesty topping with mushroom, tomato, onion, basil and cheese.", "toast"),
  item("Tuscan Toast", 289, "Baked with pesto, spinach, tomato, roasted garlic and mozzarella.", "toast"),
  item("BBQ Paneer Supreme", 289, "Paneer and veggies tossed in a smoky BBQ sauce on crisp toast.", "toast"),
  item("Avocado Toast", 399, "Whole avocado with light seasoning on crisp sourdough toast.", "toast", { special: true, image: "sourdough_toast" }),
  item("Classic Coleslaw Crunch Sandwich", 299, "Light, crunchy and creamy with a classic coleslaw finish.", "toast"),
  item("Spinach Corn Supreme Sandwich", 299, "Rich, creamy and balanced with spinach, corn and melted cheese.", "toast"),
  item("BBQ Paneer Cheese Melt", 329, "Green veggies and paneer layered with a smoky, sweet BBQ glaze.", "toast", { image: "sandwich" }),
  item("Glazed Onion Cheese Melt", 329, "Sweet caramelised onions with melted mozzarella & honey mustard.", "toast"),
  item("Creamy Mushroom Bliss Sandwich", 329, "Earthy mushrooms tossed in olive oil and spices.", "toast"),

  // F · Freshly Baked Croissants
  item("Butter Croissant", 249, "Flaky, airy, all-butter croissant baked golden.", "croissant", { image: "croissant" }),
  item("Veggie Delight Croissant Sandwich", 349, "Avocado, tomato, lettuce, cucumber, cheese slice and house spread.", "croissant"),
  item("Paneer Tikka Croissant Sandwich", 349, "Paneer tikka cubes, mint chutney spread, veggies and lettuce.", "croissant", { image: "croissant" }),

  // G · Quick Bites & Snacks
  item("French Fries — Salted", 229, "Golden, crispy hand-cut fries with sea salt.", "bites"),
  item("French Fries — Peri Peri", 229, "Fries tossed in smoky African peri peri seasoning.", "bites"),
  item("French Fries — Cheesy", 249, "Fries drenched in warm cheese sauce.", "bites"),
  item("Classic Potato Wedges", 229, "Deep fried potato wedges tossed with seasonings.", "bites"),
  item("Cheese Garlic Potato Nuggets", 229, "Blend of potato, garlic and cheese with a dipping sauce.", "bites"),
  item("Jalapeño Pops", 229, "Deep fried roll flavoured with jalapeño chilli and dressing.", "bites"),
  item("Garlic Bread", 110, "Freshly baked warm garlic baguette.", "bites"),
  item("Cheese Garlic Bread", 140, "Warm garlic baguette loaded with melted cheese.", "bites"),
  item("Loaded Nachos", 160, "Crispy corn chips with warm cheese sauce and fresh tomato salsa.", "bites"),

  // H · Artisanal Pizzas (9-inch) & Pastas
  item("Margherita Pizza", 220, "Classic mozzarella, fresh basil, rich tomato sauce.", "pizza", { image: "pizza" }),
  item("Veggie Supreme Pizza", 260, "Bell peppers, corn, olives, onions, mozzarella.", "pizza"),
  item("Paneer Tikka Pizza", 280, "Spiced paneer tikka, capsicum, onions, mozzarella.", "pizza"),
  item("TWM Special Pizza", 300, "House signature pizza loaded with premium toppings.", "pizza", { special: true, image: "pizza" }),
  item("Penne Arrabbiata (Red)", 200, "Penne in spicy garlic tomato basil sauce.", "pizza"),
  item("Penne Alfredo (White)", 220, "Creamy parmesan white sauce pasta.", "pizza"),
  item("TWM Pink Sauce Pasta", 240, "Fusion of red tomato and creamy Alfredo sauce.", "pizza"),

  // I · Bakery & Fresh Desserts
  item("Chocolate Brownie", 90, "Rich fudgy chocolate cake slice.", "dessert", { image: "brownie" }),
  item("Brownie with Ice Cream", 130, "Warm brownie served with a vanilla ice cream scoop.", "dessert"),
  item("Sizzling Brownie", 160, "Served hot on a sizzler plate with chocolate fudge sauce.", "dessert", { image: "brownie" }),
  item("Blueberry Cheesecake", 180, "Creamy cheesecake topped with sweet blueberry compote.", "dessert", { image: "cheesecake" }),
  item("Affogato", 140, "Scoop of vanilla ice cream topped with a hot espresso shot.", "dessert"),
  item("Chocolate Mousse", 120, "Silky dark chocolate mousse cup.", "dessert"),
];

export const ADDONS = {
  flavours: {
    price: 29,
    items: ["Roasted Hazelnut", "French Vanilla", "Tiramisu", "Irish Cream", "Caramel"],
  },
  milk: {
    price: 89,
    items: ["Oat Milk", "Soy Milk", "Almond Milk", "Lactose-free Milk"],
  },
};

export const REVIEWS = [
  {
    name: "Adventurous Gemini",
    rating: 5,
    text: "Best Spanish Latte and Hot Chocolate in Nashik! Clean, cozy, and amazing ambiance.",
    initial: "A",
  },
  {
    name: "Sanika Unavane",
    rating: 5,
    text: "Loved the brunch here! Amazing coffee, unique food options, super clean and hygienic.",
    initial: "S",
  },
  {
    name: "Sachin Bairagi",
    rating: 4.5,
    text: "Exotic beverage collection and a beautiful history of coffee presentation. A must-visit third space.",
    initial: "S",
  },
];
