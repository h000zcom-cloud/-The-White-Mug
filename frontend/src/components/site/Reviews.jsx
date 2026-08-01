import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { REVIEWS } from "@/data/menu";
import { TID } from "@/lib/testIds";

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const total = REVIEWS.length;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  const r = REVIEWS[idx];

  return (
    <section
      id="reviews"
      data-testid={TID.reviews}
      className="relative py-24 lg:py-32 bg-[#F7F1E8] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Guest Reviews · Google</span>
        </div>
        <div className="grid grid-cols-12 gap-6 items-end">
          <h2 className="col-span-12 lg:col-span-7 font-serif-display text-espresso text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.02em]">
            4.6 stars, kindly written by <em className="italic text-caramel not-italic">460+ regulars.</em>
          </h2>
          <div className="col-span-12 lg:col-span-5 flex lg:justify-end gap-3">
            <button
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous review"
              className="w-11 h-11 rounded-full border border-espresso/20 hover:border-espresso grid place-items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next review"
              className="w-11 h-11 rounded-full border border-espresso/20 hover:border-espresso grid place-items-center transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main review */}
        <div className="relative mt-12 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={r.name}
              data-testid={TID.reviewCard(idx)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white border border-borderwarm rounded-3xl p-8 lg:p-14"
            >
              <Quote className="absolute top-8 right-8 w-14 h-14 text-caramel/25" strokeWidth={1.5} />
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(r.rating) ? "fill-caramel text-caramel" : "text-caramel/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-[12px] uppercase tracking-[0.28em] text-mutedwarm">
                  {r.rating.toFixed(1)} / 5
                </span>
              </div>
              <p className="font-serif-display text-espresso text-2xl sm:text-3xl lg:text-[38px] leading-[1.25] tracking-tight max-w-[900px]">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-espresso text-cream grid place-items-center font-semibold">
                  {r.initial}
                </div>
                <div>
                  <div className="font-medium text-espresso">{r.name}</div>
                  <div className="text-[12px] text-mutedwarm uppercase tracking-[0.28em]">
                    Google Review · Nashik
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-10 bg-espresso" : "w-4 bg-espresso/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
