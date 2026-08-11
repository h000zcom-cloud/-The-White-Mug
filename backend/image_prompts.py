"""
Curated image prompts for The White Mug – Cafe.
Each entry generates one hero-quality product / interior photograph
via Gemini Nano Banana. Prompts are engineered to feel like real
editorial photography (not "AI art"), with consistent warm-luxe
color grade, spotlight framing, and shallow depth of field.
"""

BRAND_GRADE = (
    "Editorial food photography, warm minimalist luxe cafe aesthetic. "
    "Warm cream and deep espresso palette, soft caramel gold highlights, "
    "single-source window light with soft directional shadows, "
    "shallow depth of field, hyper realistic 85mm lens look, matte film grain, "
    "no text, no watermark, no logo, natural imperfections, "
    "styled by a top food stylist, shot for a specialty coffee magazine."
)

IMAGE_PROMPTS = {
    # HERO / SIGNATURE
    "hero_interior": (
        "Interior of a high-end specialty coffee house at golden hour. "
        "Warm cream walls, exposed brick accent, walnut wood counter, "
        "brushed brass pendant lights hanging low, a single barista in soft focus "
        "pouring a chemex behind the bar. Empty marble table in foreground with a "
        "single white ceramic mug catching a beam of light. Cinematic, moody-warm. "
        + BRAND_GRADE
    ),
    "spanish_latte": (
        "A tall clear glass of Spanish Latte on a cream linen surface, "
        "layered espresso and steamed milk with a distinct condensed-milk "
        "cream band at the bottom, delicate microfoam on top. Golden window "
        "light hitting the rim of the glass, a small brass spoon resting beside. "
        "Overhead 45-degree angle, styled minimally. " + BRAND_GRADE
    ),
    "sourdough_toast": (
        "A rustic slice of thick-cut sourdough open toast on a matte ceramic "
        "plate, topped with smashed avocado, cherry tomato halves, microgreens, "
        "pink pepper, drizzle of olive oil. Crumbs scattered on cream linen napkin. "
        "Overhead shot, warm daylight, extreme detail on the crust. " + BRAND_GRADE
    ),
    "croissant": (
        "A single freshly baked all-butter croissant on parchment paper, "
        "flaky golden layers with visible honeycomb interior peeking through, "
        "buttery sheen. Soft window light from the left, dusting of flour, "
        "next to a small espresso cup slightly out of focus. " + BRAND_GRADE
    ),
    "pour_over": (
        "Close-up of a barista's hands pouring water from a gooseneck kettle "
        "in a slow spiral over a V60 pour-over dripper, steam rising, cream "
        "textured background, brass timer visible slightly out of focus. "
        "Warm cinematic light, macro lens feel. " + BRAND_GRADE
    ),
    "coffee_beans": (
        "A pile of dark roasted specialty coffee beans spilling from a linen "
        "sack onto a walnut wood surface, single-origin label peeking, one bean "
        "in perfect focus. Directional warm light, deep espresso tones. "
        + BRAND_GRADE
    ),
    # MENU HERO CARDS
    "iced_latte": (
        "A tall glass of iced latte with dark espresso pouring into cold milk, "
        "the pour caught mid-motion creating swirling cloud patterns, "
        "condensation on the glass, ice cubes catching light. "
        "Editorial motion photography. " + BRAND_GRADE
    ),
    "frappe": (
        "A blended caramel frappe in a slim tall glass, topped with a "
        "swirl of whipped cream, caramel drizzle cascading down the sides, "
        "crushed biscoff crumb on top. Warm background bokeh of a cafe. "
        + BRAND_GRADE
    ),
    "brownie": (
        "A dense chocolate brownie square on a small round black slate plate, "
        "cracked glossy top, molten chocolate oozing from a fork bite, "
        "single scoop of vanilla ice cream melting beside, mint leaf garnish. "
        "Overhead, warm light. " + BRAND_GRADE
    ),
    "pizza": (
        "A 9-inch artisanal margherita pizza on a rustic wooden peel, "
        "charred crust, fresh basil leaves, milky mozzarella pools, "
        "olive oil sheen. Overhead shot, cream linen underneath. " + BRAND_GRADE
    ),
    "mojito": (
        "A tall glass of virgin mojito with muddled mint leaves, lime wedges, "
        "and crushed ice, sparkling water bubbles rising, a copper straw "
        "leaning in. Cream backdrop, refreshing warm light. " + BRAND_GRADE
    ),
    "cheesecake": (
        "A single slice of blueberry cheesecake on a small ivory plate, "
        "creamy layer, buttery biscuit base, glossy blueberry compote topping "
        "dripping down the side, fresh blueberries scattered. Overhead 30-deg. "
        + BRAND_GRADE
    ),
    # LIFESTYLE / SECONDARY
    "barista_hands": (
        "Barista's hands pouring latte art (rosetta) into a white ceramic cup "
        "on a saucer, dark espresso becoming white foam pattern, extreme "
        "close-up, brass tamper in background out of focus. " + BRAND_GRADE
    ),
    "cafe_seating": (
        "A cozy corner of a specialty cafe: a boucle armchair, a small round "
        "walnut side table with an open novel and a half-drunk cappuccino, "
        "a warm floor lamp glow, terracotta ceramic vase with dried pampas. "
        "Wide 35mm, hygge aesthetic. " + BRAND_GRADE
    ),
    "sandwich": (
        "A gourmet grilled sandwich cut in half showing melted mozzarella, "
        "roasted vegetables, and pesto oozing out, on a black slate board, "
        "next to a small ramekin of dipping sauce. Warm overhead light. "
        + BRAND_GRADE
    ),
    "hot_chocolate": (
        "A ceramic mug of thick hot chocolate topped with marshmallows and "
        "a light cocoa dust, cinnamon stick resting on the rim, dark wooden "
        "table, warm winter light. " + BRAND_GRADE
    ),
}

# --- Additional images for Ambiance Masonry Gallery ---
IMAGE_PROMPTS["cafe_patio"] = (
    "Sunlit outdoor patio of a specialty coffee cafe. Small round teak tables, "
    "rattan chairs, potted olive tree and terracotta planters, warm string lights "
    "overhead, dappled golden-hour sunlight, a cappuccino cup catching light on one "
    "table. Ivy climbing a cream-painted wall. Cinematic, editorial, 35mm feel. "
    + BRAND_GRADE
)

IMAGE_PROMPTS["cafe_work_corner"] = (
    "A quiet work-friendly corner of a specialty cafe. Boucle armchair by a large "
    "window, a walnut writing desk with an open laptop softly out of focus, a "
    "steaming ceramic mug, a small plant, brass table lamp on, warm afternoon "
    "sunlight raking across the wall. Hygge, minimal, warm neutrals. " + BRAND_GRADE
)


# ---------------------------------------------------------------------------
# Menu gap-fill shots.
#
# `frontend/npm run photo-report` lists the menu items that have no truthful
# photograph and are currently borrowing another dish's shot. These prompts
# close that gap. After generating, run `npm run images` in frontend/ and point
# the item at its new slug in `frontend/src/data/menuImages.js`.
# ---------------------------------------------------------------------------

IMAGE_PROMPTS["french_fries"] = (
    "A tall paper cone of golden hand-cut French fries with flaky sea salt, "
    "standing in a small wire basket on a cream linen surface, a ramekin of "
    "house dip beside it, a few fries resting on the linen. Warm window light "
    "from the left, steam just visible. " + BRAND_GRADE
)

IMAGE_PROMPTS["fries_peri_peri"] = (
    "Crispy French fries tossed in deep red peri peri seasoning, piled on matte "
    "black slate, visible flecks of chilli and herb, a lime wedge and a small "
    "bowl of aioli beside. Overhead 30-degree angle, warm directional light. "
    + BRAND_GRADE
)

IMAGE_PROMPTS["fries_cheesy"] = (
    "French fries drenched in glossy molten cheese sauce, a slow drip caught "
    "mid-fall, chopped chives and cracked black pepper on top, served in a "
    "shallow enamel dish. Close three-quarter angle, warm light, extreme texture "
    "detail on the cheese. " + BRAND_GRADE
)

IMAGE_PROMPTS["potato_wedges"] = (
    "Thick-cut skin-on potato wedges, deep golden and dusted with herb "
    "seasoning, arranged on parchment in a small cast-iron pan, sour cream dip "
    "in a ceramic ramekin. Overhead shot, cream linen, warm daylight. "
    + BRAND_GRADE
)

IMAGE_PROMPTS["potato_nuggets"] = (
    "Golden cheese-and-garlic potato nuggets, one broken open to show a molten "
    "cheese pull, stacked on a small ivory plate with a dipping sauce alongside "
    "and a sprig of parsley. Close macro angle, shallow depth of field, warm "
    "light. " + BRAND_GRADE
)

IMAGE_PROMPTS["jalapeno_pops"] = (
    "Crisp golden breaded jalapeno cheese poppers on a matte black slate board, "
    "one split open showing melted cream cheese and green chilli, a small bowl "
    "of ranch dressing beside, scattered breadcrumbs. Warm overhead light. "
    + BRAND_GRADE
)

IMAGE_PROMPTS["garlic_bread"] = (
    "A warm garlic baguette cut into batons, glistening with garlic butter and "
    "chopped parsley, arranged on a wooden board lined with parchment, a small "
    "dish of marinara beside. Soft window light, visible crumb and crust "
    "texture. " + BRAND_GRADE
)

IMAGE_PROMPTS["loaded_nachos"] = (
    "A generous pile of crisp corn tortilla chips loaded with molten cheese "
    "sauce, fresh tomato salsa, jalapeno rings, black olives and coriander, "
    "served in a shallow terracotta dish. Overhead 45-degree angle, warm light, "
    "vivid but natural colour. " + BRAND_GRADE
)

IMAGE_PROMPTS["pasta_red"] = (
    "Penne arrabbiata in a wide shallow ceramic bowl, glossy spicy tomato sauce "
    "clinging to the pasta, fresh basil leaf on top, chilli flakes and grated "
    "parmesan scattered, a fork twirling one piece. Overhead, cream linen, warm "
    "light. " + BRAND_GRADE
)

IMAGE_PROMPTS["pasta_white"] = (
    "Penne alfredo in a wide shallow ivory bowl, silky cream parmesan sauce "
    "coating every piece, cracked black pepper and shaved parmesan on top, a "
    "sprig of parsley. Overhead shot, warm neutral light, rich but not yellow. "
    + BRAND_GRADE
)

IMAGE_PROMPTS["pasta_pink"] = (
    "Penne in a blush pink sauce — tomato and cream marbled together, the swirl "
    "still visible — in a wide shallow ceramic bowl, basil chiffonade and "
    "parmesan on top. Overhead 30-degree angle, cream linen, warm window light. "
    + BRAND_GRADE
)
