import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TID } from "@/lib/testIds";
import { img } from "@/lib/images";
import { scrollToId } from "@/hooks/useLenis";

const PICKS = [
  {
    tag: "Chef's Special",
    name: "Spanish Latte",
    price: 259,
    note: "Espresso · Steamed Milk · Condensed Milk",
    img: "spanish_latte",
    span: "lg:col-span-6 lg:row-span-2",
    aspect: "aspect-[4/5]",
  },
  {
    tag: "House Signature",
    name: "Avocado Sourdough Toast",
    price: 399,
    note: "Whole Avocado · Sea Salt · Sourdough",
    img: "sourdough_toast",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5]",
  },
  {
    tag: "Slow Brew",
    name: "Chemex Pour Over",
    price: 359,
    note: "Single Origin · 5-minute Ritual",
    img: "pour_over",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5]",
  },
  {
    tag: "Bakery",
    name: "All-Butter Croissant",
    price: 249,
    note: "Baked Fresh · Golden & Flaky",
    img: "croissant",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5]",
  },
  {
    tag: "Cold Bar",
    name: "TWM Special Frappe",
    price: 200,
    note: "House Blend · Rich & Creamy",
    img: "frappe",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5]",
  },
];

export default function SignatureBrews() {
  return (
    <section
      id="signature"
      data-testid={TID.signature}
      className="relative py-24 lg:py-32 bg-cream"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-espresso/40" />
              <span className="eyebrow">Signature Brews & Bites</span>
            </div>
            <h2 className="font-serif-display text-espresso text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.02em]">
              The picks Nashik keeps <em className="italic text-caramel not-italic">coming back for.</em>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 flex items-end lg:justify-end">
            <p className="text-espresso/70 leading-relaxed max-w-[420px]">
              A handful of quiet obsessions from our bar and bakery. Each one is on the
              menu below — search, filter, and read the story behind every cup and crust.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 auto-rows-[minmax(240px,auto)] gap-4 lg:gap-6">
          {PICKS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
              className={`group relative col-span-2 ${p.span} rounded-3xl overflow-hidden border border-borderwarm bg-white`}
            >
              <div className={`relative ${p.aspect}`}>
                <img
                  src={img(p.img)}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent" />
                {p.tag === "Chef's Special" && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 chip bg-white/90">
                    <Sparkles className="w-3 h-3 text-caramel" />
                    <span className="text-espresso">{p.tag}</span>
                  </span>
                )}
                {p.tag !== "Chef's Special" && (
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] font-medium text-white/90">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 lg:p-6 text-cream">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif-display text-2xl lg:text-3xl leading-tight tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-cream/75 text-[12px] mt-1">{p.note}</p>
                  </div>
                  <div className="text-cream font-semibold text-lg">₹{p.price}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <button
            onClick={() => scrollToId("menu")}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-espresso/20 text-espresso hover:bg-white transition-colors text-[13px] font-medium"
          >
            See the full digital menu
            <span>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
