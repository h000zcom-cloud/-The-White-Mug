import { motion } from "framer-motion";
import { Coffee, Wheat, Leaf, Wifi } from "lucide-react";
import Picture from "@/components/media/Picture";

const PILLARS = [
  { title: "Artisanal Coffee Bar", sub: "Pour-over rituals · espresso classics", Icon: Coffee },
  { title: "Fresh Sourdough", sub: "Baked in-house every morning", Icon: Wheat },
  { title: "100% Pure Veg", sub: "Clean, thoughtful vegetarian menu", Icon: Leaf },
  { title: "Work & Chill", sub: "Fast Wi-Fi · warm seating", Icon: Wifi },
];

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
              <Picture
                slug={t.key}
                alt={t.caption}
                aspect="auto"
                sizes="(min-width: 640px) 25vw, 50vw"
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/0 to-transparent" />
              <figcaption className="absolute bottom-3 left-3 right-3 text-cream text-[11.5px] sm:text-[13px] leading-tight">
                {t.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/*
          Pillars. These used emoji, which render as a different picture on every
          operating system and undercut an otherwise controlled palette. Line
          icons match the logo's weight and inherit brand colour.
        */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-4 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group flex items-start gap-3 rounded-2xl border border-borderwarm bg-white p-3.5 transition-[border-color,box-shadow] duration-300 hover:border-espresso/20 hover:shadow-lift sm:p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream2 text-espresso transition-colors duration-300 group-hover:bg-caramel/15 group-hover:text-caramel">
                <p.Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <div className="min-w-0">
                <div className="text-[14.5px] font-semibold leading-tight text-espresso sm:text-[15.5px]">
                  {p.title}
                </div>
                <div className="mt-1 text-[12px] leading-snug text-mutedwarm">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
