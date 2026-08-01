import { motion } from "framer-motion";
import { Coffee, Wheat, Leaf, Wifi } from "lucide-react";
import { TID } from "@/lib/testIds";
import { img } from "@/lib/images";

const PILLARS = [
  {
    id: "coffee-bar",
    icon: Coffee,
    title: "Artisanal Coffee Bar",
    body: "Hand-pulled espresso classics and slow pour-overs from single origin beans.",
  },
  {
    id: "sourdough",
    icon: Wheat,
    title: "Gourmet Sourdough",
    body: "A long ferment, baked in-house every morning — open toasts and melts you'll remember.",
  },
  {
    id: "pure-veg",
    icon: Leaf,
    title: "100% Pure Veg Kitchen",
    body: "A clean, thoughtful vegetarian menu — nothing lost in translation.",
  },
  {
    id: "workchill",
    icon: Wifi,
    title: "Work & Chill Vibe",
    body: "Fast Wi-Fi, warm ambient seating, and playlists that never rush you.",
  },
];

export default function Ambiance() {
  return (
    <section
      id="ambiance"
      data-testid={TID.ambiance}
      className="relative py-24 lg:py-32 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="clip-frame aspect-[4/5] max-w-[440px] mx-auto lg:mx-0"
          >
            <img
              src={img("cafe_seating")}
              alt="Cozy cafe corner"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-espresso/40" />
            <span className="eyebrow">Why Nashik Loves TWM</span>
          </div>
          <h2 className="font-serif-display text-espresso text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.02em]">
            A room built for <em className="italic text-caramel not-italic">slow moments.</em>
          </h2>
          <p className="mt-6 text-espresso/70 text-[15px] leading-relaxed max-w-[540px]">
            The White Mug is designed the way great coffee is brewed — with time, with
            intention, and with room to breathe.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.id}
                data-testid={TID.ambianceCard(p.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.07 }}
                className="group relative rounded-2xl border border-borderwarm bg-white p-6 hover:shadow-[0_25px_60px_-30px_rgba(31,22,20,0.35)] transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-cream border border-borderwarm grid place-items-center mb-5 group-hover:bg-caramel group-hover:border-caramel transition-colors">
                  <p.icon className="w-5 h-5 text-espresso group-hover:text-cream transition-colors" strokeWidth={1.7} />
                </div>
                <h3 className="font-serif-display text-espresso text-2xl tracking-tight">
                  {p.title}
                </h3>
                <p className="text-mutedwarm text-[13.5px] leading-relaxed mt-2">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
