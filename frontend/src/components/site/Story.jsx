import { motion } from "framer-motion";
import { TID } from "@/lib/testIds";
import Picture from "@/components/media/Picture";

const CHAPTERS = [
  {
    num: "01",
    title: "Single Origin, Selected By Hand",
    body:
      "Beans traced back to a single farm. Roasted small-batch and rested to peak. Each cup is a conversation between altitude, terroir and the barista in front of you.",
  },
  {
    num: "02",
    title: "Four Ways to Brew, Slowly",
    body:
      "French Press, Aeropress, Chemex and V60. Manual brewing is a ritual — the pour, the bloom, the wait. We serve time first, coffee second.",
  },
  {
    num: "03",
    title: "Fresh Sourdough, Baked Today",
    body:
      "A slow starter, a long ferment, and a hot oven. Our open toasts are built on the same loaves we bake every morning — crackle first, crumb second.",
  },
  {
    num: "04",
    title: "A Hygge Room For Nashik",
    body:
      "Warm light. Quiet corners. Playlists that never rush you. This is a room for laptops, first dates, second books and old friends — a genuine third space.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] },
  }),
};

export default function Story() {
  return (
    <section
      id="story"
      data-testid={TID.story}
      className="relative py-14 sm:py-20 lg:py-32 bg-cream"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-12 gap-8 lg:gap-16">
        {/* Left column: sticky image */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-espresso/40" />
              <span className="eyebrow">Our Story & Craft</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em]"
            >
              A quiet obsession with <em className="text-caramel not-italic italic">coffee, craft &amp; company.</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-6 lg:mt-10 clip-frame aspect-[4/5] max-w-[420px]"
            >
              <Picture
                slug="barista_hands"
                alt="A barista pouring a rosetta in latte art into a white ceramic cup"
                aspect="auto"
                sizes="(min-width: 1024px) 420px, 92vw"
                className="h-full w-full"
              />
            </motion.div>
          </div>
        </div>

        {/* Right column: numbered manifesto */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col">
            {CHAPTERS.map((c, i) => (
              <motion.article
                key={c.num}
                data-testid={TID.storyChapter(c.num)}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="py-7 lg:py-10 border-t border-borderwarm first:border-t-0"
              >
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="font-serif-display italic text-caramel text-3xl sm:text-4xl lg:text-5xl leading-none">
                      {c.num}
                    </span>
                  </div>
                  <div className="col-span-10 sm:col-span-11">
                    <h3 className="font-serif-display text-espresso text-[22px] sm:text-3xl lg:text-[34px] leading-tight tracking-tight">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-espresso/70 text-[14px] sm:text-base leading-relaxed max-w-[560px]">
                      {c.body}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
