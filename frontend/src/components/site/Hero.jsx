import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, MapPin, Star, Leaf, Clock } from "lucide-react";
import { TID } from "@/lib/testIds";
import { scrollToId } from "@/hooks/useLenis";
import Picture from "@/components/media/Picture";
import { Steam } from "@/components/brand/Logo";

const NAV_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=20.0063999,73.7546168";

const LINE_1 = "Specialty Coffee House";
const LINE_2 = "& Your Favorite";
const LINE_3 = "Third Space.";

const wordReveal = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: 0,
    transition: { delay: 0.15 + i * 0.06, duration: 0.9, ease: [0.2, 0.75, 0.15, 1] },
  }),
};

function Line({ text, startDelay = 0, italic = false }) {
  const words = text.split(" ");
  return (
    <span className="mask-line">
      <span className="inline-flex flex-wrap gap-x-[0.24em]">
        {words.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            variants={wordReveal}
            custom={i + startDelay}
            className={`inline-block will-change-transform ${italic ? "italic" : ""}`}
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

  /*
   * Parallax is desktop-only.
   *
   * Below lg the three photographs sit in a plain grid rather than stacked
   * absolutely, so sliding them vertically would just pull them out of
   * alignment with each other. The offsets collapse to zero and the layout
   * stays still.
   */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const yA = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -120 : 0]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -60 : 0]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -180 : 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 120 : 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  return (
    <section
      id="hero"
      ref={ref}
      data-testid={TID.hero}
      className="relative pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-24 overflow-hidden"
    >
      <motion.div
        style={{ y: yBg, opacity }}
        aria-hidden="true"
        /*
         * Hidden below lg. On a phone the headline already fills the width, so
         * the watermark sat directly behind the type and read as a smudge rather
         * than a texture.
         */
        className="pointer-events-none absolute -top-6 left-0 right-0 hidden justify-center lg:flex"
      >
        <span className="select-none font-serif-display text-[22vw] italic leading-none text-espresso/[0.035]">
          coffee
        </span>
      </motion.div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-12 gap-6 lg:gap-10">
        {/* Left: kinetic copy */}
        <div className="col-span-12 lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mb-5 flex items-center gap-3 sm:mb-8"
          >
            <span aria-hidden="true" className="h-px w-6 bg-espresso/40 sm:w-8" />
            <span className="eyebrow !text-[10px] sm:!text-[11px]">Est. Nashik · Since Day One</span>
            <Steam className="h-4 w-8 text-caramel/70" />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            className="font-serif-display text-espresso text-[42px] leading-[0.98] sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[104px] tracking-[-0.03em]"
          >
            <Line text={LINE_1} startDelay={0} />
            <Line text={LINE_2} startDelay={LINE_1.split(" ").length + 1} />
            <Line
              text={LINE_3}
              startDelay={LINE_1.split(" ").length + LINE_2.split(" ").length + 2}
              italic
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="mt-5 sm:mt-8 text-espresso/70 text-[14.5px] sm:text-[17px] leading-relaxed max-w-[520px]"
          >
            Crafting single-origin brews, sourdough open toasts, and artisanal desserts
            on Mahatma Nagar Road — Nashik&rsquo;s warmest third space.
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="mt-5 sm:mt-8 flex flex-wrap items-center gap-2"
          >
            <span className="chip !py-1.5 !text-[11.5px] sm:!text-[12.5px]">
              <Star className="w-3.5 h-3.5 fill-caramel text-caramel" />
              <span className="font-semibold text-espresso">4.6</span>
              <span className="text-mutedwarm">460+ Google</span>
            </span>
            <span className="chip !py-1.5 !text-[11.5px] sm:!text-[12.5px]">
              <Leaf className="w-3.5 h-3.5 text-vegetal" strokeWidth={2.4} />
              <span className="text-vegetal font-semibold">100% Pure Veg</span>
            </span>
            <span className="chip !py-1.5 !text-[11.5px] sm:!text-[12.5px]">
              <Clock className="w-3.5 h-3.5 text-espresso" />
              <span className="text-espresso">9:30 AM – 11:00 PM</span>
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7 }}
            /* Full width and equal on a phone, so the pair reads as a
               deliberate block rather than two differently sized pills. */
            className="mt-7 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <button
              data-testid={TID.heroCtaMenu}
              onClick={() => scrollToId("menu")}
              className="btn-glow inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 text-[14.5px] font-medium text-cream transition-colors hover:bg-espresso2 sm:min-h-[48px] sm:w-auto"
            >
              Explore Digital Menu
              <ArrowDown className="h-4 w-4" />
            </button>
            <a
              data-testid={TID.heroCtaDirections}
              href={NAV_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-espresso/20 bg-white/60 px-6 text-[14.5px] font-medium text-espresso transition-colors hover:border-espresso hover:bg-white sm:min-h-[48px] sm:w-auto sm:bg-transparent"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
            </a>
          </motion.div>
        </div>

        {/*
          Gallery.
          
          Below lg this is a plain two-column grid: the arched signature shot
          across the top, then the toast and croissant side by side. Previously
          all three were absolutely positioned inside a 460px box at every size,
          which on a phone meant they overlapped by more than half and read as a
          layout fault. From lg the absolute stack returns, where there is
          genuinely room for it to look composed.
        */}
        <div className="relative col-span-12 mt-7 grid grid-cols-2 gap-2.5 sm:gap-4 lg:col-span-5 lg:mt-0 lg:block lg:h-[700px]">
          <motion.div
            style={{ y: yA }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
            /*
             * z-20 puts the arched frame above the sourdough tile.
             *
             * These three photos are absolutely positioned siblings, so paint
             * order followed DOM order — and the sourdough, coming later,
             * covered the left half of this frame's price card. They overlap
             * between 36% and 52% of the column, which is exactly where the
             * card sits. The hero product shot and its price should be in front
             * regardless; the others tucking behind is what reads as depth.
             */
            className="clip-frame-tall relative col-span-2 aspect-[4/5] bg-cream2 sm:aspect-[16/11] lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:aspect-[3/4] lg:w-[64%]"
          >
            <Picture
              slug="spanish_latte"
              alt="A Spanish latte in a tall glass, layered espresso and condensed milk"
              aspect="auto"
              priority
              sizes="(min-width: 1024px) 375px, 60vw"
              className="h-full w-full"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-white/85 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between border border-borderwarm">
              <div>
                <div className="text-[9px] uppercase tracking-[0.28em] text-mutedwarm">Chef&rsquo;s Special</div>
                <div className="font-serif-display text-espresso text-[15px] sm:text-[17px] leading-none mt-1">
                  Spanish Latte
                </div>
              </div>
              <div className="text-espresso font-semibold text-[14px] sm:text-[15px]">₹259</div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yB }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="clip-frame aspect-square lg:absolute lg:bottom-14 lg:left-0 lg:aspect-[4/5] lg:w-[52%]"
          >
            <Picture
              slug="sourdough_toast"
              alt="Sourdough open toast topped with fresh vegetables and melted cheese"
              aspect="auto"
              priority
              sizes="(min-width: 1024px) 305px, 50vw"
              className="h-full w-full"
            />
          </motion.div>

          <motion.div
            style={{ y: yC }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="clip-frame aspect-square lg:absolute lg:bottom-0 lg:right-4 lg:w-[36%]"
          >
            <Picture
              slug="croissant"
              alt="A golden, flaky all-butter croissant"
              aspect="auto"
              sizes="(min-width: 1024px) 210px, 35vw"
              className="h-full w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            /*
             * z-30 keeps this above the arched frame, which is z-20. Only from
             * lg: below that the gallery is a grid, so an absolutely positioned
             * card would float over the photographs instead of beside them.
             */
            className="absolute -left-2 top-6 z-30 hidden w-[180px] rounded-2xl border border-borderwarm bg-white/90 p-4 shadow-[0_20px_50px_-25px_rgba(31,22,20,0.25)] backdrop-blur-md lg:block"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-mutedwarm">Signature</div>
            <div className="font-serif-display text-espresso text-2xl leading-tight mt-1">
              Single Origin
            </div>
            <div className="text-mutedwarm text-[11.5px] mt-1">
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
