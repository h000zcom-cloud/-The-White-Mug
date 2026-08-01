import { motion } from "framer-motion";
import { img } from "@/lib/images";

const TILES = [
  { key: "hero_interior", caption: "Warm interior seating & wooden tables", span: "row-span-2" },
  { key: "barista_hands", caption: "Barista brewing latte art", span: "" },
  { key: "pour_over", caption: "Manual V60 pour-over ritual", span: "" },
  { key: "cafe_patio", caption: "Sunlit outdoor patio", span: "row-span-2" },
  { key: "cafe_work_corner", caption: "Work-friendly corner · fast Wi-Fi", span: "" },
  { key: "cafe_seating", caption: "Boucle armchair · hygge corner", span: "" },
];

export default function AmbianceGallery() {
  return (
    <section
      id="ambiance"
      data-testid="ambiance-section"
      className="relative py-14 sm:py-20 lg:py-32 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Your Third Space in Nashik</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-14">
          <h2 className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em] max-w-[760px]">
            A room built for <em className="italic text-caramel not-italic">slow moments.</em>
          </h2>
          <p className="text-espresso/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[440px]">
            Warm light. Quiet corners. Playlists that never rush you. High-speed Wi-Fi for the
            work sessions, wooden tables for the long conversations.
          </p>
        </div>

        {/* Masonry — 2-col mobile, 4-col md, 4-col lg with taller row spans on 1 & 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[230px] gap-2.5 sm:gap-4">
          {TILES.map((t, i) => (
            <motion.figure
              key={t.key}
              data-testid={`ambiance-tile-${t.key}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-borderwarm bg-cream2 ${t.span}`}
            >
              <img
                src={img(t.key)}
                alt={t.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/0 to-transparent" />
              <figcaption className="absolute bottom-3 left-3 right-3 text-cream text-[11.5px] sm:text-[13px] leading-tight">
                {t.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Pillars strip */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { t: "Artisanal Coffee Bar", s: "Pour-over rituals · Espresso classics", e: "☕" },
            { t: "Fresh Sourdough", s: "Baked in-house every morning", e: "🥑" },
            { t: "100% Pure Veg", s: "Clean, thoughtful vegetarian menu", e: "🌿" },
            { t: "Work & Chill", s: "Fast Wi-Fi · Warm seating", e: "💻" },
          ].map((p) => (
            <div
              key={p.t}
              className="rounded-2xl border border-borderwarm bg-white p-4 flex items-start gap-3"
            >
              <span className="text-2xl leading-none" aria-hidden="true">{p.e}</span>
              <div className="min-w-0">
                <div className="font-serif-display text-espresso text-[17px] sm:text-[19px] leading-tight tracking-tight">{p.t}</div>
                <div className="text-mutedwarm text-[12px] mt-1">{p.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
