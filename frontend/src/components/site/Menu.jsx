import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Leaf, Flame, X, Plus } from "lucide-react";
import { useContext, useMemo, useRef, useState } from "react";
import { CATEGORIES, MENU, ADDONS } from "@/data/menu";
import { TID } from "@/lib/testIds";
import { img } from "@/lib/images";
import { ReserveCtx } from "@/lib/reserve-context";
import CategoryChips from "@/components/site/CategoryChips";

const DIETS = [
  { id: "all", label: "All", icon: null },
  { id: "veg", label: "Pure Veg", icon: Leaf, tone: "green" },
  { id: "best", label: "Bestsellers", icon: Flame, tone: "amber" },
  { id: "brew", label: "Specialty Brews", icon: Sparkles, tone: "gold" },
];

export default function MenuSection({ tab, setTab }) {
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState("all");
  const openReserve = useContext(ReserveCtx);
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MENU.filter((m) => {
      const tabOk = tab === "all" || m.category === tab;
      const qOk =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.desc.toLowerCase().includes(query);
      const dietOk =
        diet === "all" ||
        (diet === "veg" && m.pureVeg) ||
        (diet === "best" && m.bestseller) ||
        (diet === "brew" && m.specialty);
      return tabOk && qOk && dietOk;
    });
  }, [tab, q, diet]);

  const suggestions = useMemo(() => {
    if (!q.trim() || q.trim().length < 2) return [];
    const query = q.toLowerCase();
    return MENU.filter((m) => m.name.toLowerCase().includes(query)).slice(0, 5);
  }, [q]);

  return (
    <section
      id="menu"
      data-testid={TID.menu}
      className="relative py-14 sm:py-20 lg:py-32 bg-[#F7F1E8]"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Digital Menu · 100% Pure Veg</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-10">
          <h2 className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em] max-w-[720px]">
            Everything on the counter, <em className="italic text-caramel not-italic">at a glance.</em>
          </h2>
          <p className="text-espresso/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[420px]">
            Ten categories, ~75 handcrafted items. Prices in INR, inclusive of taxes.
          </p>
        </div>

        {/* Instagram-style chips */}
        <div className="mb-6 lg:mb-8">
          <CategoryChips activeTab={tab} onSelect={setTab} />
        </div>

        {/* Sticky search + filters bar */}
        <div className="sticky top-[64px] lg:top-[72px] z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3 bg-[#F7F1E8]/90 backdrop-blur-xl border-b border-borderwarm">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedwarm" />
            <input
              ref={searchRef}
              data-testid={TID.menuSearch}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search latte, sourdough, mojito…"
              className="w-full pl-11 pr-11 h-12 min-h-[44px] rounded-full bg-white border border-borderwarm outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 transition text-[14px] placeholder:text-mutedwarm/70"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full hover:bg-cream"
              >
                <X className="w-3.5 h-3.5 text-mutedwarm" />
              </button>
            )}
            {/* Autocomplete */}
            {suggestions.length > 0 && (
              <div className="absolute z-40 top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-borderwarm shadow-[0_20px_45px_-20px_rgba(31,22,20,0.35)] overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    data-testid={`menu-suggestion-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    onClick={() => {
                      setQ(s.name);
                      searchRef.current?.blur();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-cream"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-vegetal" />
                    <span className="text-[14px] text-espresso truncate flex-1">{s.name}</span>
                    <span className="text-[13px] font-semibold text-espresso">₹{s.priceRange || s.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Two-row filter rail */}
          <div className="mt-3 flex flex-col gap-2">
            {/* Dietary quick filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {DIETS.map((d) => {
                const active = diet === d.id;
                return (
                  <button
                    key={d.id}
                    data-testid={`diet-${d.id}`}
                    onClick={() => setDiet(d.id)}
                    className={`whitespace-nowrap inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-full text-[12.5px] font-medium border transition-colors ${
                      active
                        ? "bg-espresso text-cream border-espresso"
                        : "bg-white text-espresso border-borderwarm hover:border-espresso/40"
                    }`}
                  >
                    {d.icon && <d.icon className="w-3.5 h-3.5" strokeWidth={2} />}
                    {d.label}
                  </button>
                );
              })}
            </div>
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {CATEGORIES.map((c) => {
                const active = tab === c.id;
                return (
                  <button
                    key={c.id}
                    data-testid={TID.menuTab(c.id)}
                    onClick={() => setTab(c.id)}
                    className={`pill-tab whitespace-nowrap min-h-[38px] px-3.5 rounded-full text-[12.5px] font-medium border ${
                      active
                        ? "bg-caramel text-espresso border-caramel"
                        : "bg-white text-espresso border-borderwarm hover:border-espresso/40"
                    }`}
                  >
                    {c.tag && <span className="mr-1">{c.tag}</span>}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result summary */}
        <div className="mt-5 flex items-center justify-between text-[11.5px] uppercase tracking-[0.24em] text-mutedwarm">
          <span>{filtered.length} items</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm border border-vegetal grid place-items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-vegetal" />
            </span>
            Pure veg kitchen
          </span>
        </div>

        {/* Grid — 2-col mobile, 3-col desktop */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((m) => (
              <motion.article
                key={m.name}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                data-testid={TID.menuItem(m.name)}
                className="group relative bg-white border border-borderwarm rounded-2xl overflow-hidden flex flex-col hover:shadow-[0_18px_45px_-25px_rgba(31,22,20,0.35)] transition-shadow duration-500"
              >
                <div className="relative aspect-[4/3] bg-cream2 overflow-hidden">
                  {m.image ? (
                    <img
                      src={img(m.image)}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <span className="font-serif-display text-espresso/25 text-4xl italic">
                        {m.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </span>
                    </div>
                  )}
                  {m.bestseller && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7A2E12] text-[#FFE6B8] text-[10px] font-semibold">
                      <Flame className="w-2.5 h-2.5" /> Bestseller
                    </span>
                  )}
                  {m.special && !m.bestseller && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-caramel text-espresso text-[10px] font-semibold">
                      <Sparkles className="w-2.5 h-2.5" /> Special
                    </span>
                  )}
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white/95 border border-vegetal">
                    <span className="w-2 h-2 rounded-full bg-vegetal" />
                  </span>
                </div>
                <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif-display text-espresso text-[15px] sm:text-[17px] leading-tight tracking-tight line-clamp-2">
                      {m.name}
                    </h3>
                    <div className="text-espresso font-semibold text-[13px] sm:text-[14px] whitespace-nowrap">
                      ₹{m.priceRange || m.price}
                    </div>
                  </div>
                  <p className="text-mutedwarm text-[11.5px] sm:text-[12.5px] leading-snug line-clamp-2">
                    {m.desc}
                  </p>
                  <button
                    onClick={() => openReserve?.(m.name)}
                    data-testid={`menu-reserve-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 min-h-[38px] rounded-full border border-espresso/15 hover:bg-espresso hover:text-cream text-espresso text-[12px] font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Reserve
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 py-14 text-center bg-white/60 border border-borderwarm rounded-2xl">
            <p className="font-serif-display italic text-2xl text-espresso">
              Nothing matches your filters.
            </p>
            <p className="text-mutedwarm mt-2 text-sm">
              Try clearing search or switching to <button onClick={() => { setDiet('all'); setTab('all'); setQ(''); }} className="underline underline-offset-2">All</button>.
            </p>
          </div>
        )}

        {/* Add-ons drawer */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
          <div className="rounded-3xl bg-espresso text-cream p-6 lg:p-8 border border-espresso relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-caramel/20 blur-2xl" />
            <div className="eyebrow text-cream/60">Customize</div>
            <h4 className="font-serif-display text-cream text-2xl sm:text-3xl leading-tight mt-3">Flavour Add-ons</h4>
            <p className="text-cream/70 text-[13px] mt-2">
              {ADDONS.flavours.items.join(" · ")}
            </p>
            <div className="mt-5 inline-flex items-center h-9 px-4 rounded-full bg-cream text-espresso text-[12.5px] font-semibold">
              + ₹{ADDONS.flavours.price} per shot
            </div>
          </div>
          <div className="rounded-3xl bg-white text-espresso p-6 lg:p-8 border border-borderwarm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-caramel/15 blur-2xl" />
            <div className="eyebrow">Alt Milks</div>
            <h4 className="font-serif-display text-2xl sm:text-3xl leading-tight mt-3">Milk Add-ons</h4>
            <p className="text-mutedwarm text-[13px] mt-2">
              {ADDONS.milk.items.join(" · ")}
            </p>
            <div className="mt-5 inline-flex items-center h-9 px-4 rounded-full bg-espresso text-cream text-[12.5px] font-semibold">
              + ₹{ADDONS.milk.price}
            </div>
          </div>
        </div>

        <p className="mt-8 lg:mt-10 text-center text-mutedwarm text-[12.5px] italic font-serif-display">
          Desserts are available on our display shelf — ask us what&rsquo;s fresh today.
        </p>
      </div>
    </section>
  );
}
