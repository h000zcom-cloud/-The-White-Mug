import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, MapPin, Star, Leaf, Clock } from "lucide-react";
import { TID } from "@/lib/testIds";
import { scrollToId } from "@/hooks/useLenis";
import { img } from "@/lib/images";

const LINE_1 = "Specially Coffee House";
const LINE_2 = "& Your Favorite";
const LINE_3 = "Third Space.";

const wordReveal = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: 0,
    transition: { delay: 0.15 + i * 0.06, duration: 0.9, ease: [0.2, 0.75, 0.15, 1] },
  }),
};

function Line({ text, startDelay = 0 }) {
  const words = text.split(" ");
  return (
    <span className="mask-line">
      <span className="inline-flex flex-wrap gap-x-[0.28em]">
        {words.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            variants={wordReveal}
            custom={i + startDelay}
            className="inline-block will-change-transform"
          >
            {w}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  return (
    <section id="hero" ref={ref} data-testid={TID.hero} className="relative pt-24 lg:pt-28 pb-16 lg:pb-24 overflow-hidden">
      {/* Faint decorative wordmark */}
      <motion.div
        style={{ y: yBg, opacity }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-0 right-0 flex justify-center"
      >
        <span className="font-serif-display italic text-[22vw] leading-none text-espresso/[0.04] select-none">
          coffee
        </span>
      </motion.div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-6 lg:gap-10">
        {/* Left: kinetic copy */}
        <div className="col-span-12 lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-8 h-px bg-espresso/40" />
            <span className="eyebrow">Est. Nashik · Since Day One</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            className="font-serif-display text-espresso text-[13vw] leading-[0.98] sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[104px] tracking-[-0.03em]"
          >
            <Line text={LINE_1} startDelay={0} />
            <Line text={LINE_2} startDelay={LINE_1.split(" ").length + 1} />
            <span className="mask-line">
              <span className="inline-flex flex-wrap gap-x-[0.28em]">
                {LINE_3.split(" ").map((w, i) => (
                  <motion.span
                    key={w}
                    variants={wordReveal}
                    custom={i + LINE_1.split(" ").length + LINE_2.split(" ").length + 2}
                    className="inline-block italic text-espresso/95"
                    style={{ fontStyle: "italic" }}
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="mt-8 text-espresso/70 text-[17px] leading-relaxed max-w-[520px]"
          >
            Crafting single-origin brews, sourdough open toasts, and artisanal desserts
            on Mahatma Nagar Road — Nashik&rsquo;s warmest third space for slow mornings,
            quiet afternoons, and long conversations.
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-2.5"
          >
            <span className="chip">
              <Star className="w-3.5 h-3.5 fill-caramel text-caramel" />
              <span className="font-semibold text-espresso">4.6</span>
              <span className="text-mutedwarm">Google · 460+ Reviews</span>
            </span>
            <span className="chip">
              <Leaf className="w-3.5 h-3.5 text-vegetal" strokeWidth={2.4} />
              <span className="text-vegetal font-semibold">100% Pure Veg</span>
            </span>
            <span className="chip">
              <Clock className="w-3.5 h-3.5 text-espresso" />
              <span className="text-espresso">9:30 AM – 11:00 PM · Daily</span>
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <button
              data-testid={TID.heroCtaMenu}
              onClick={() => scrollToId("menu")}
              className="btn-glow inline-flex items-center gap-2.5 h-13 px-7 py-4 rounded-full bg-espresso text-cream text-[14px] font-medium hover:bg-espresso2 transition-colors"
            >
              Explore Digital Menu
              <ArrowDown className="w-4 h-4" />
            </button>
            <a
              data-testid={TID.heroCtaDirections}
              href="https://maps.app.goo.gl/xF1oL7z2xZ8oPKPq9"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 h-13 px-7 py-4 rounded-full border border-espresso/20 text-espresso hover:border-espresso hover:bg-white transition-colors text-[14px] font-medium"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          </motion.div>
        </div>

        {/* Right: parallax gallery */}
        <div className="col-span-12 lg:col-span-5 relative h-[540px] sm:h-[620px] lg:h-[700px] mt-8 lg:mt-0">
          <motion.div
            style={{ y: yA }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute top-0 right-0 w-[62%] aspect-[3/4] clip-frame-tall bg-cream2"
          >
            <img
              src={img("spanish_latte")}
              alt="Spanish latte in a tall glass"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-borderwarm">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-mutedwarm">Chef&rsquo;s Special</div>
                <div className="font-serif-display text-espresso text-[17px] leading-none mt-1">Spanish Latte</div>
              </div>
              <div className="text-espresso font-semibold text-[15px]">₹259</div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yB }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute bottom-16 left-0 w-[52%] aspect-[4/5] clip-frame"
          >
            <img
              src={img("sourdough_toast")}
              alt="Fresh sourdough open toast"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            style={{ y: yC }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute bottom-0 right-6 w-[36%] aspect-square clip-frame"
          >
            <img
              src={img("croissant")}
              alt="Golden butter croissant"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating small stat */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="absolute top-8 -left-3 bg-white/90 backdrop-blur-md border border-borderwarm rounded-2xl p-4 shadow-[0_20px_50px_-25px_rgba(31,22,20,0.25)] w-[190px]"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-mutedwarm">Signature</div>
            <div className="font-serif-display text-espresso text-2xl leading-tight mt-1">
              Single Origin
            </div>
            <div className="text-mutedwarm text-[12px] mt-1">
              French Press · Aeropress · Chemex · V60
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="hidden lg:flex justify-center mt-10"
      >
        <button
          onClick={() => scrollToId("marquee")}
          className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-mutedwarm hover:text-espresso transition-colors"
        >
          <span className="w-10 h-px bg-mutedwarm" />
          scroll to discover
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </section>
  );
}
