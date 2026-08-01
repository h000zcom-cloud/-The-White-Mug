import { motion, AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { Coffee, Snowflake, Zap, Heart, Sparkles, Droplet, Leaf, RefreshCcw, ChevronRight } from "lucide-react";
import { BREW_QUIZ_MAP, MENU } from "@/data/menu";
import { ReserveCtx } from "@/lib/reserve-context";
import { img } from "@/lib/images";

const STEPS = [
  {
    key: "temp",
    q: "How do you like it?",
    options: [
      { id: "warm", label: "Warm & Cozy", icon: Coffee, blurb: "Steamed milk, hand-pulled shots" },
      { id: "iced", label: "Iced & Chilled", icon: Snowflake, blurb: "Over ice, refreshing pours" },
    ],
  },
  {
    key: "flavor",
    q: "Which flavour speaks to you?",
    options: [
      { id: "strong", label: "Strong & Bold", icon: Zap, blurb: "Robust, full-bodied cup" },
      { id: "sweet", label: "Smooth & Sweet", icon: Heart, blurb: "Rounded, sweeter notes" },
      { id: "creamy", label: "Creamy & Indulgent", icon: Sparkles, blurb: "Rich, dessert-like" },
    ],
  },
  {
    key: "milk",
    q: "Milk preference?",
    options: [
      { id: "dairy", label: "Dairy / Cream", icon: Droplet, blurb: "Whole milk, classic" },
      { id: "plant", label: "Plant-based", icon: Leaf, blurb: "Oat / Almond (+₹89)" },
      { id: "black", label: "Black / No Milk", icon: Coffee, blurb: "Pure and unmasked" },
    ],
  },
];

export default function BrewQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const openReserve = useContext(ReserveCtx);
  const done = step >= STEPS.length;

  const result = useMemo(() => {
    if (!done) return null;
    const key = `${answers.temp}|${answers.flavor}|${answers.milk}`;
    const name = BREW_QUIZ_MAP[key] || "Spanish Latte";
    return MENU.find((m) => m.name === name) || MENU.find((m) => m.name === "Spanish Latte");
  }, [answers, done]);

  const choose = (opt) => {
    setAnswers((a) => ({ ...a, [STEPS[step].key]: opt.id }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <section
      id="quiz"
      data-testid="quiz-section"
      className="relative py-14 sm:py-20 lg:py-32 bg-[#F7F1E8] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Intro */}
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-espresso/40" />
              <span className="eyebrow">Interactive · 5 seconds</span>
            </div>
            <h2 className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em]">
              Find your <em className="italic text-caramel not-italic">perfect brew.</em>
            </h2>
            <p className="mt-4 text-espresso/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[440px]">
              Answer three tiny questions and we&rsquo;ll match you with the cup TWM regulars order for exactly your mood.
            </p>

            {/* progress dots */}
            <div className="mt-8 flex items-center gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all ${
                    i < step ? "w-8 bg-espresso" : i === step && !done ? "w-8 bg-caramel" : "w-3 bg-espresso/15"
                  }`}
                />
              ))}
              <span className="ml-3 text-[11px] uppercase tracking-[0.28em] text-mutedwarm">
                {done ? "Match found" : `Step ${step + 1} / ${STEPS.length}`}
              </span>
            </div>
          </div>

          {/* Quiz card */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative rounded-[28px] bg-white border border-borderwarm p-5 sm:p-8 lg:p-10 min-h-[380px] sm:min-h-[420px] shadow-[0_25px_60px_-30px_rgba(31,22,20,0.28)]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="eyebrow">Question {step + 1}</span>
                      {step > 0 && (
                        <button
                          onClick={() => setStep((s) => Math.max(0, s - 1))}
                          data-testid="quiz-back-btn"
                          className="text-[12px] text-mutedwarm hover:text-espresso"
                        >
                          ← back
                        </button>
                      )}
                    </div>
                    <h3 className="mt-3 font-serif-display text-espresso text-2xl sm:text-3xl lg:text-[36px] leading-tight tracking-tight">
                      {STEPS[step].q}
                    </h3>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {STEPS[step].options.map((opt) => (
                        <button
                          key={opt.id}
                          data-testid={`quiz-opt-${STEPS[step].key}-${opt.id}`}
                          onClick={() => choose(opt)}
                          className="group text-left min-h-[64px] rounded-2xl border border-borderwarm bg-cream hover:border-espresso hover:bg-white transition-colors p-4 flex items-center gap-4 active:scale-[0.99]"
                        >
                          <span className="grid place-items-center w-11 h-11 rounded-full bg-white border border-borderwarm group-hover:bg-espresso group-hover:border-espresso transition-colors shrink-0">
                            <opt.icon className="w-4 h-4 text-espresso group-hover:text-cream" strokeWidth={1.8} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-espresso text-[15px] leading-tight">{opt.label}</div>
                            <div className="text-mutedwarm text-[12px] mt-0.5 leading-tight">{opt.blurb}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-mutedwarm ml-auto shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    data-testid="quiz-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-stretch gap-5"
                  >
                    {result?.image && (
                      <div className="w-full sm:w-[46%] aspect-[4/5] rounded-2xl overflow-hidden border border-borderwarm shrink-0">
                        <img src={img(result.image)} alt={result.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <span className="eyebrow">Your Match</span>
                      <h3 className="mt-2 font-serif-display text-espresso text-3xl sm:text-4xl lg:text-[42px] leading-[1.05] tracking-tight">
                        {result?.name}
                      </h3>
                      <p className="mt-3 text-mutedwarm text-[14px] leading-relaxed">{result?.desc}</p>
                      <div className="mt-4 inline-flex items-center gap-2">
                        <span className="text-espresso font-semibold text-lg">₹{result?.priceRange || result?.price}</span>
                        {result?.pureVeg && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-vegetal">
                            <span className="w-3.5 h-3.5 rounded-sm border border-vegetal grid place-items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-vegetal" />
                            </span>
                            Pure Veg
                          </span>
                        )}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          data-testid="quiz-reserve-btn"
                          onClick={() => openReserve?.(result?.name)}
                          className="btn-glow inline-flex items-center gap-2 h-11 px-5 rounded-full bg-espresso text-cream text-[13px] font-semibold hover:bg-espresso2 transition-colors"
                        >
                          Reserve & Try It
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          data-testid="quiz-reset-btn"
                          onClick={reset}
                          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-espresso/20 hover:border-espresso text-espresso text-[13px] font-medium transition-colors"
                        >
                          <RefreshCcw className="w-4 h-4" /> Try again
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
