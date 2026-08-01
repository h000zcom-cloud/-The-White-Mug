import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, MENU, ADDONS } from "@/data/menu";
import { TID } from "@/lib/testIds";
import { img } from "@/lib/images";

export default function MenuSection() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MENU.filter((m) => {
      const tabOk = tab === "all" || m.category === tab;
      const qOk =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.desc.toLowerCase().includes(query);
      return tabOk && qOk;
    });
  }, [tab, q]);

  return (
    <section
      id="menu"
      data-testid={TID.menu}
      className="relative py-24 lg:py-32 bg-[#F7F1E8]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-espresso/40" />
              <span className="eyebrow">Digital Menu · Fully Vegetarian</span>
            </div>
            <h2 className="font-serif-display text-espresso text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.02em]">
              Everything on the counter, <em className="italic text-caramel not-italic">at a glance.</em>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 flex items-end">
            <p className="text-espresso/70 leading-relaxed">
              Ten categories. ~80 handcrafted items. Prices in INR — inclusive of taxes.
              Tap any category or type to find your next favourite.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="sticky top-[72px] z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-[#F7F1E8]/85 backdrop-blur-xl border-b border-borderwarm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative w-full lg:max-w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedwarm" />
              <input
                data-testid={TID.menuSearch}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for latte, sourdough, mojito…"
                className="w-full pl-11 pr-4 h-12 rounded-full bg-white border border-borderwarm outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 transition text-[14px] placeholder:text-mutedwarm/70"
              />
            </div>

            {/* Category pills */}
            <div className="flex-1 overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="inline-flex items-center gap-2 pb-1">
                {CATEGORIES.map((c) => {
                  const active = tab === c.id;
                  return (
                    <button
                      key={c.id}
                      data-testid={TID.menuTab(c.id)}
                      onClick={() => setTab(c.id)}
                      className={`pill-tab whitespace-nowrap h-10 px-4 rounded-full text-[13px] font-medium border ${
                        active
                          ? "bg-espresso text-cream border-espresso"
                          : "bg-white text-espresso border-borderwarm hover:border-espresso/40"
                      }`}
                    >
                      {c.tag && <span className="mr-1.5">{c.tag}</span>}
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between text-[12px] uppercase tracking-[0.28em] text-mutedwarm">
          <span>{filtered.length} items</span>
          <span className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-vegetal" /> pure veg kitchen
          </span>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((m) => (
              <motion.article
                key={m.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                data-testid={TID.menuItem(m.name)}
                className="group relative bg-white border border-borderwarm rounded-2xl p-5 flex gap-4 items-start hover:shadow-[0_20px_50px_-30px_rgba(31,22,20,0.35)] transition-shadow duration-500"
              >
                {m.image && (
                  <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-borderwarm">
                    <img
                      src={img(m.image)}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif-display text-espresso text-[19px] leading-tight tracking-tight">
                      {m.name}
                    </h3>
                    <div className="text-espresso font-semibold text-[15px] whitespace-nowrap">
                      ₹{m.priceRange || m.price}
                    </div>
                  </div>
                  {m.special && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10.5px] uppercase tracking-[0.28em] text-caramel font-semibold">
                      <Sparkles className="w-3 h-3" /> Chef&rsquo;s Special
                    </span>
                  )}
                  <p className="text-mutedwarm text-[13px] leading-relaxed mt-2 line-clamp-3">
                    {m.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 py-16 text-center bg-white/60 border border-borderwarm rounded-2xl">
            <p className="font-serif-display italic text-2xl text-espresso">
              Nothing matches &quot;{q}&quot;.
            </p>
            <p className="text-mutedwarm mt-2 text-sm">
              Try &quot;latte&quot;, &quot;sourdough&quot; or &quot;mojito&quot;.
            </p>
          </div>
        )}

        {/* Add-ons banner */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-espresso text-cream p-8 border border-espresso relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-caramel/20 blur-2xl" />
            <div className="eyebrow text-cream/60">Customize</div>
            <h4 className="font-serif-display text-3xl leading-tight mt-3">Flavour Add-ons</h4>
            <p className="text-cream/70 text-[13.5px] mt-2">
              {ADDONS.flavours.items.join(" · ")}
            </p>
            <div className="mt-6 inline-flex items-center h-9 px-4 rounded-full bg-cream text-espresso text-[12.5px] font-semibold">
              + ₹{ADDONS.flavours.price} per shot
            </div>
          </div>
          <div className="rounded-3xl bg-white text-espresso p-8 border border-borderwarm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-caramel/15 blur-2xl" />
            <div className="eyebrow">Alt Milks</div>
            <h4 className="font-serif-display text-3xl leading-tight mt-3">Milk Add-ons</h4>
            <p className="text-mutedwarm text-[13.5px] mt-2">
              {ADDONS.milk.items.join(" · ")}
            </p>
            <div className="mt-6 inline-flex items-center h-9 px-4 rounded-full bg-espresso text-cream text-[12.5px] font-semibold">
              + ₹{ADDONS.milk.price}
            </div>
          </div>
        </div>

        {/* Display counter note */}
        <p className="mt-10 text-center text-mutedwarm text-[13px] italic font-serif-display">
          Desserts are available on our display shelf — ask us what&rsquo;s fresh today.
        </p>
      </div>
    </section>
  );
}
