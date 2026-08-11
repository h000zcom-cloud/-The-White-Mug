import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Flame,
  Sparkles,
  LayoutGrid,
  Rows3,
  ArrowLeft,
  Leaf,
  ListFilter,
  Check,
  ChevronDown,
} from "lucide-react";
import { CATEGORIES, MENU, ADDONS } from "@/data/menu";
import MenuCard, { VegMark } from "@/components/menu/MenuCard";
import MenuItemSheet from "@/components/menu/MenuItemSheet";
import { Steam } from "@/components/brand/Logo";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import useActiveSection from "@/hooks/useActiveSection";
import { ReserveCtx } from "@/lib/reserve-context";
import { BRAND_EASE } from "@/lib/motion";
import { TID } from "@/lib/testIds";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "Everything", icon: null },
  { id: "best", label: "Bestsellers", icon: Flame },
  { id: "special", label: "House specials", icon: Sparkles },
  { id: "brew", label: "Specialty brews", icon: Leaf },
];

const ORDERED = CATEGORIES.filter((c) => c.id !== "all");

function useDebounced(value, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const openReserve = useContext(ReserveCtx);

  const query = params.get("q") ?? "";
  const filter = params.get("show") ?? "all";
  const view = params.get("view") === "list" ? "list" : "grid";

  const [draft, setDraft] = useState(query);
  const debounced = useDebounced(draft);
  const [activeItem, setActiveItem] = useState(null);
  const [catSheet, setCatSheet] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debounced) next.set("q", debounced);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [debounced, setParams]);

  const setParam = useCallback(
    (key, value, fallback) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === fallback) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.filter((m) => {
      const qOk = !q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
      const fOk =
        filter === "all" ||
        (filter === "best" && m.bestseller) ||
        (filter === "special" && m.special) ||
        (filter === "brew" && m.specialty);
      return qOk && fOk;
    });
  }, [query, filter]);

  const grouped = useMemo(
    () =>
      ORDERED.map((c) => ({ ...c, items: matches.filter((m) => m.category === c.id) })).filter(
        (g) => g.items.length > 0,
      ),
    [matches],
  );

  const groupIds = useMemo(() => grouped.map((g) => g.id), [grouped]);
  const activeCat = useActiveSection(groupIds, 150);
  const activeLabel = grouped.find((g) => g.id === activeCat)?.label;

  const isFiltered = Boolean(query.trim()) || filter !== "all";

  return (
    <div className="min-h-screen bg-cream">
      <MenuHeader count={matches.length} total={MENU.length} isFiltered={isFiltered} />

      <div
        /* Bracket value: /88 is not on Tailwind's opacity scale and emitted nothing. */
        className="sticky z-30 border-b border-borderwarm bg-cream/[0.97] backdrop-blur-xl supports-[backdrop-filter]:bg-cream/[0.9]"
        style={{ top: "var(--header-h)" }}
      >
        <div className="mx-auto max-w-wide px-3.5 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          {/* Row one: search gets the full width it needs to be usable. */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mutedwarm sm:left-4"
              />
              <input
                ref={searchRef}
                data-testid={TID.menuSearch}
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search the menu…"
                aria-label="Search the menu"
                className="h-11 w-full rounded-full border border-borderwarm bg-white pl-10 pr-10 text-step-0 outline-none transition-[border-color] placeholder:text-mutedwarm/70 focus:border-espresso/40 sm:h-12 sm:pl-11 sm:pr-11"
              />
              {draft && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-mutedwarm hover:bg-cream2"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Layout"
              className="hidden shrink-0 items-center gap-1 rounded-full border border-borderwarm bg-white p-1 sm:flex"
            >
              {[
                { id: "grid", Icon: LayoutGrid, label: "Grid" },
                { id: "list", Icon: Rows3, label: "List" },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setParam("view", id, "grid")}
                  aria-pressed={view === id}
                  title={`${label} view`}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full transition-colors duration-300",
                    view === id ? "bg-espresso text-cream" : "text-mutedwarm hover:bg-cream2",
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">{label} view</span>
                </button>
              ))}
            </div>
          </div>

          {/*
            Row two: the category button is pinned at the start and the filters
            scroll beside it. Sharing row one with the search squeezed the button
            down to "Specialty Co…" — unreadable, and the thing it labels is the
            reader's current position, which is worth showing properly.
          */}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCatSheet(true)}
              data-testid="menu-category-sheet-open"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-espresso/20 bg-white pl-3 pr-2.5 text-[12.5px] font-medium text-espresso lg:hidden"
            >
              <ListFilter aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="max-w-[132px] truncate">{activeLabel ?? "Categories"}</span>
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-mutedwarm" />
            </button>

            <div
              aria-hidden="true"
              className="hidden h-6 w-px shrink-0 bg-borderwarm sm:block lg:hidden"
            />

            <div className="no-scrollbar edge-fade -my-1 flex flex-1 items-center gap-2 overflow-x-auto py-1">
              {FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    data-testid={`menu-filter-${f.id}`}
                    onClick={() => setParam("show", f.id, "all")}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-medium transition-colors duration-300",
                      on
                        ? "border-espresso bg-espresso text-cream"
                        : "border-borderwarm bg-white text-espresso hover:border-espresso/40",
                    )}
                  >
                    {f.icon && <f.icon aria-hidden="true" className="h-3.5 w-3.5" />}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dock clearance is handled once, on the app shell in App.js. */}
      <div className="mx-auto max-w-wide px-3.5 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
        <div className="lg:grid lg:grid-cols-[214px_1fr] lg:gap-9 xl:grid-cols-[236px_1fr] xl:gap-12">
          <CategoryRail groups={grouped} active={activeCat} />

          <main id="menu-results">
            <div
              aria-live="polite"
              className="mb-4 flex items-center justify-between gap-3 text-[11.5px] uppercase tracking-wide text-mutedwarm"
            >
              <span>
                {matches.length} {matches.length === 1 ? "item" : "items"}
                {isFiltered && ` of ${MENU.length}`}
              </span>
              {isFiltered && (
                <Link
                  to="/menu"
                  onClick={() => setDraft("")}
                  className="font-medium normal-case tracking-normal text-espresso underline underline-offset-4"
                >
                  Clear
                </Link>
              )}
            </div>

            {grouped.length === 0 ? (
              <EmptyState query={query} onClear={() => setDraft("")} />
            ) : (
              <div className="flex flex-col gap-9 sm:gap-11 lg:gap-14">
                {grouped.map((group) => (
                  <section
                    key={group.id}
                    id={`cat-${group.id}`}
                    aria-labelledby={`h-${group.id}`}
                    /* Clears the header AND the sticky filter bar on jump. */
                    className="scroll-target"
                  >
                    <Reveal
                      as="div"
                      className="mb-3.5 flex items-baseline justify-between gap-3 border-b border-borderwarm pb-2.5 sm:mb-4"
                    >
                      <h2
                        id={`h-${group.id}`}
                        className="text-step-2 font-medium tracking-[-0.01em] text-espresso"
                      >
                        {group.label}
                      </h2>
                      <span className="shrink-0 text-[11.5px] uppercase tracking-wide text-mutedwarm">
                        {group.items.length}
                      </span>
                    </Reveal>

                    {/*
                      `key` includes the view mode so switching grid/list
                      remounts and replays the stagger, rather than snapping.
                    */}
                    <RevealGroup
                      key={`${group.id}-${view}`}
                      className={cn(
                        view === "grid"
                          ? // Capped at four. Five across pushed each card below
                            // the width its photograph and two lines of text
                            // need, so the extra column cost more than it gained.
                            "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 xl:grid-cols-4 xl:gap-4"
                          : "flex flex-col gap-2.5",
                      )}
                    >
                      {group.items.map((item) => (
                        <RevealItem key={item.name} className={view === "grid" ? "h-full" : ""}>
                          <MenuCard item={item} layout={view} onOpen={setActiveItem} />
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  </section>
                ))}
              </div>
            )}

            <AddOnsBand />

            <p className="mt-8 text-center text-step--1 text-mutedwarm">
              Prices in INR, inclusive of taxes. Desserts rotate daily — ask us what&rsquo;s fresh
              on the shelf.
            </p>
          </main>
        </div>
      </div>

      <MenuItemSheet
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onReserve={openReserve}
      />

      <CategorySheet
        open={catSheet}
        groups={grouped}
        active={activeCat}
        onClose={() => setCatSheet(false)}
      />
    </div>
  );
}

function MenuHeader({ count, total, isFiltered }) {
  return (
    <header className="border-b border-borderwarm bg-mist/45">
      <div className="mx-auto max-w-wide px-3.5 pb-7 pt-24 sm:px-6 lg:px-8 lg:pb-9 lg:pt-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-step--1 font-medium text-mutedwarm transition-colors hover:text-espresso"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-4 flex flex-col gap-5 lg:mt-5 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow">Digital Menu</p>
            <h1 className="mt-2.5 flex flex-wrap items-center gap-x-4 text-step-4 font-normal tracking-[-0.015em] text-espresso">
              <span className="font-sign !tracking-[0.12em]">The Menu</span>
              <Steam className="mb-2 h-6 w-10 text-caramel/60" />
            </h1>
            <p className="mt-3.5 max-w-prose text-step-0 text-pretty text-mutedwarm">
              {total} items across nine kitchens and one coffee bar — every one of them
              photographed, searchable, and prepared in a fully vegetarian kitchen.
            </p>
          </Reveal>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="chip">
              <VegMark />
              <span className="font-semibold text-vegetal">100% Pure Veg</span>
            </span>
            <span className="chip tabular-nums">{isFiltered ? `${count} shown` : `${total} items`}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Desktop category navigation, highlighting whichever section you're reading.
 * The moving indicator is a single shared element animated between rows, so it
 * glides rather than blinking on and off.
 */
function CategoryRail({ groups, active }) {
  return (
    <nav aria-label="Menu categories" className="hidden lg:block">
      {/*
        Offset is derived, not guessed. It was a hard-coded 108px, which was
        shorter than the sticky filter bar actually is — so the "Jump to" heading
        parked underneath it. Both this and the section scroll offsets now key
        off --menubar-h, so they can't drift apart.
      */}
      <div
        className="sticky"
        style={{ top: "calc(var(--header-h) + var(--menubar-h) + 24px)" }}
      >
        <p className="eyebrow mb-3">Jump to</p>
        <ul className="flex flex-col border-l border-borderwarm">
          {groups.map((g) => {
            const on = g.id === active;
            return (
              <li key={g.id} className="relative">
                {on && (
                  <motion.span
                    layoutId="rail-indicator"
                    aria-hidden="true"
                    className="absolute -left-px top-0 h-full w-[2px] bg-caramel"
                    transition={{ duration: 0.32, ease: BRAND_EASE }}
                  />
                )}
                <a
                  href={`#cat-${g.id}`}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex items-baseline justify-between gap-2 py-1.5 pl-3.5 text-step--1 transition-colors duration-300",
                    on ? "font-medium text-espresso" : "text-mutedwarm hover:text-espresso",
                  )}
                >
                  <span>{g.label}</span>
                  <span className="text-[10.5px] tabular-nums text-mutedwarm/70">
                    {g.items.length}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Mobile category picker. Native <dialog> again, for the same reasons as the
 * item sheet: real focus trapping, Escape, and inert background for free.
 */
function CategorySheet({ open, groups, active, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onClose?.();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label="Jump to a category"
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
      className="m-0 h-full max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-0 backdrop:bg-espresso/55 backdrop:backdrop-blur-sm open:flex lg:hidden"
    >
      <div className="w-full rounded-t-3xl bg-cream pb-[max(16px,env(safe-area-inset-bottom))] shadow-lift-lg">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <p className="eyebrow">Jump to</p>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-borderwarm bg-white text-espresso"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-[62dvh] overflow-y-auto overscroll-contain px-3 pb-2">
          {groups.map((g) => {
            const on = g.id === active;
            return (
              <li key={g.id}>
                <a
                  href={`#cat-${g.id}`}
                  onClick={() => ref.current?.close()}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex min-h-[52px] items-center justify-between gap-3 rounded-2xl px-3.5 text-step-0 transition-colors",
                    on ? "bg-white font-semibold text-espresso" : "text-espresso/85",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {on ? (
                      <Check aria-hidden="true" className="h-4 w-4 text-caramel" />
                    ) : (
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-borderwarm" />
                    )}
                    {g.label}
                  </span>
                  <span className="text-step--1 tabular-nums text-mutedwarm">{g.items.length}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={query}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: BRAND_EASE }}
        className="rounded-3xl border border-borderwarm bg-white/70 px-6 py-14 text-center sm:py-16"
      >
        <p className="font-serif-display text-step-2 italic text-espresso">
          Nothing matches {query ? `“${query}”` : "those filters"}.
        </p>
        <p className="mx-auto mt-3 max-w-prose text-step-0 text-mutedwarm">
          Try a shorter word, or browse everything from the top.
        </p>
        <Link
          to="/menu"
          onClick={onClear}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-espresso px-6 text-step--1 font-semibold text-cream transition-colors hover:bg-espresso2"
        >
          Show the whole menu
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

function AddOnsBand() {
  return (
    <section aria-labelledby="addons-h" className="mt-11 lg:mt-16">
      <h2 id="addons-h" className="eyebrow mb-3">
        Make it yours
      </h2>
      <RevealGroup className="grid gap-3 sm:grid-cols-2" each={0.08}>
        <RevealItem>
          <div className="on-ink relative h-full overflow-hidden rounded-3xl border border-espresso bg-espresso p-6 text-cream lg:p-8">
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-caramel/25 blur-2xl"
            />
            <p className="text-[10.5px] uppercase tracking-sign text-cream/60">Flavour shots</p>
            <p className="mt-3 text-step-2 font-medium">+₹{ADDONS.flavours.price}</p>
            <p className="mt-2 text-step--1 leading-relaxed text-cream/75">
              {ADDONS.flavours.items.join(" · ")}
            </p>
          </div>
        </RevealItem>
        <RevealItem>
          <div className="relative h-full overflow-hidden rounded-3xl border border-borderwarm bg-white p-6 lg:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-caramel/15 blur-2xl"
            />
            <p className="text-[10.5px] uppercase tracking-sign text-mutedwarm">
              Alternative milks
            </p>
            <p className="mt-3 text-step-2 font-medium text-espresso">+₹{ADDONS.milk.price}</p>
            <p className="mt-2 text-step--1 leading-relaxed text-mutedwarm">
              {ADDONS.milk.items.join(" · ")}
            </p>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
