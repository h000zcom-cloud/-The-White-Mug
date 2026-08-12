import { motion } from "framer-motion";
import { Flame, Star, Wheat, Sparkles, ChevronRight } from "lucide-react";
import { useContext } from "react";
import { ReserveCtx } from "@/lib/reserve-context";
import Picture from "@/components/media/Picture";

const SPECIALS = [
  {
    name: "Spanish Latte",
    price: 259,
    desc: "Smooth espresso swirled with steamed & condensed milk.",
    image: "spanish_latte",
    badge: { text: "Bestseller", icon: Flame, tone: "amber" },
  },
  {
    name: "Avocado Sourdough Toast",
    price: 399,
    desc: "Fresh avocado on crisp sourdough with light herbs.",
    image: "sourdough_toast",
    badge: { text: "Sourdough Special", icon: Wheat, tone: "green" },
  },
  {
    name: "Tuscan Toast",
    price: 289,
    desc: "Baked pesto, spinach, tomato, roasted garlic & mozzarella.",
    image: "sandwich",
    badge: { text: "Must Try", icon: Star, tone: "gold" },
  },
  {
    name: "TWM Special Frappe",
    price: 200,
    desc: "House signature blended cold coffee with whipped cream.",
    image: "frappe",
    badge: { text: "Chef's Special", icon: Sparkles, tone: "gold" },
  },
];

const badgeTone = {
  amber: "bg-[#7A2E12] text-[#FFE6B8]",
  green: "bg-vegetal text-cream",
  gold: "bg-caramel text-espresso",
};

export default function ChefSpecials() {
  const openReserve = useContext(ReserveCtx);

  return (
    <section
      id="specials"
      data-testid="specials-section"
      className="relative py-14 sm:py-20 lg:py-32 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Today&rsquo;s Popular Picks</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-14">
          <h2 className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em] max-w-[720px]">
            The four Nashik is <em className="italic text-caramel not-italic">talking about.</em>
          </h2>
          <p className="text-espresso/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[420px]">
            Our most-ordered plates and pours this week — freshly made, hand-plated.
          </p>
        </div>

        {/*
          Mobile: horizontal snap-scroll carousel · Desktop: 4-column grid

          `scroll-pl-*` matters and is easy to lose. The row goes full-bleed with
          `-mx-4` and restores the inset with `px-4`, but `snap-mandatory` snaps a
          card's edge to the *scrollport* edge, and the scrollport is the padding
          box — so the browser scrolled straight past that 16px of padding and
          parked the first card flush against the screen edge. `scroll-padding`
          insets the snapport itself, so every snap position now lands 16px in
          and the first card gets the same breathing room as the gap between cards.
        */}
        <div className="-mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-0 flex lg:grid lg:grid-cols-4 gap-3 lg:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar lg:overflow-visible pb-2 lg:pb-0">
          {SPECIALS.map((s, i) => (
            <motion.article
              key={s.name}
              data-testid={`special-card-${i}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
              className="group relative snap-start shrink-0 w-[78vw] sm:w-[46vw] lg:w-auto rounded-3xl overflow-hidden border border-borderwarm bg-white flex flex-col hover:shadow-[0_25px_60px_-30px_rgba(31,22,20,0.35)] transition-shadow duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Picture
                  slug={s.image}
                  alt={s.name}
                  aspect="auto"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 46vw, 78vw"
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-brand group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-wide ${badgeTone[s.badge.tone]}`}
                >
                  <s.badge.icon className="w-3 h-3" strokeWidth={2.2} />
                  {s.badge.text}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                  <div className="flex items-end justify-between gap-3">
                    <h3 className="font-serif-display text-[22px] sm:text-2xl leading-tight tracking-tight">
                      {s.name}
                    </h3>
                    <div className="text-cream font-semibold text-[16px] whitespace-nowrap">
                      ₹{s.price}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-mutedwarm text-[13px] leading-relaxed">{s.desc}</p>
                <button
                  onClick={() => openReserve?.(s.name)}
                  data-testid={`special-reserve-${i}`}
                  className="mt-auto inline-flex items-center justify-between h-11 px-4 rounded-full border border-espresso/15 hover:border-espresso hover:bg-espresso hover:text-cream text-espresso text-[13px] font-medium transition-colors"
                >
                  Reserve for this
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
