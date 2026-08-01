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
      className="relative py-14 sm:py-20 lg:py-32 bg-[#F7F1E8] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Verified · Google Reviews</span>
        </div>

        {/* Google rating badge card */}
        <div className="rounded-3xl border border-borderwarm bg-white p-5 sm:p-6 lg:p-7 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          <div className="col-span-2 sm:col-span-1 flex items-center gap-4">
            <GoogleG />
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.24em] text-mutedwarm">Google</div>
              <div className="font-serif-display text-espresso text-[26px] leading-none">4.6</div>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < 4 ? "fill-caramel text-caramel" : i === 4 ? "fill-caramel/70 text-caramel" : "text-caramel/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <Stat label="Reviews" value="460+" />
          <Stat label="Bestseller" value="Spanish Latte" small />
          <Stat label="Diet" value="100% Pure Veg" small />
        </div>

        <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <h2 className="font-serif-display text-espresso text-[32px] leading-[1.05] sm:text-5xl lg:text-[60px] tracking-[-0.02em] max-w-[760px]">
            Kindly written by <em className="italic text-caramel not-italic">460+ regulars.</em>
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous review"
              data-testid="review-prev"
              className="w-11 h-11 min-h-[44px] rounded-full border border-espresso/20 hover:border-espresso grid place-items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next review"
              data-testid="review-next"
              className="w-11 h-11 min-h-[44px] rounded-full border border-espresso/20 hover:border-espresso grid place-items-center transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Review card */}
        <div className="relative mt-8 min-h-[280px] sm:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={r.name}
              data-testid={TID.reviewCard(idx)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white border border-borderwarm rounded-3xl p-6 sm:p-10 lg:p-14"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 sm:w-14 sm:h-14 text-caramel/25" strokeWidth={1.5} />
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(r.rating) ? "fill-caramel text-caramel" : "text-caramel/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-[11px] uppercase tracking-[0.24em] text-mutedwarm">
                  {r.rating.toFixed(1)} / 5
                </span>
              </div>
              <p className="font-serif-display text-espresso text-[22px] sm:text-3xl lg:text-[38px] leading-[1.25] tracking-tight max-w-[900px]">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-espresso text-cream grid place-items-center font-semibold">
                  {r.initial}
                </div>
                <div>
                  <div className="font-medium text-espresso">{r.name}</div>
                  <div className="text-[11.5px] text-mutedwarm uppercase tracking-[0.24em]">
                    Google Review · Nashik
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-2">
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

function Stat({ label, value, small }) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] uppercase tracking-[0.24em] text-mutedwarm">{label}</div>
      <div className={`text-espresso font-semibold mt-1 ${small ? "text-[14px]" : "text-[20px]"}`}>
        {value}
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.3 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6c1.8-5.4 6.9-9.3 12.9-9.3Z" />
      <path fill="#4285F4" d="M46.6 24.6c0-1.5-.1-3-.4-4.4H24v8.4h12.6c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7-10.5 7-17.2Z" />
      <path fill="#FBBC05" d="M10.5 28.6a14.6 14.6 0 0 1 0-9.2l-7.8-6a24 24 0 0 0 0 21.2l7.8-6Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.9-6a15 15 0 0 1-7.9 2.1c-6 0-11.1-3.9-12.9-9.3l-7.8 6C6.6 42.6 14.6 48 24 48Z" />
    </svg>
  );
}
