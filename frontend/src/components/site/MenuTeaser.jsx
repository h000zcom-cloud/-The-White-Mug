import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { CATEGORIES, MENU } from "@/data/menu";
import { imageFor } from "@/data/menuImages";
import Picture from "@/components/media/Picture";

const ORDERED = CATEGORIES.filter((c) => c.id !== "all");

/** One representative, photogenic item per category for the preview strip. */
const PREVIEW = [
  "Spanish Latte",
  "Chemex",
  "Avocado Toast",
  "Butter Croissant",
  "TWM Special Pizza",
  "Blueberry Cheesecake",
];

/**
 * Home-page gateway to the full menu.
 *
 * Deliberately not a menu: six photographs, the category list with counts, and
 * one route out. The job here is to make someone want to open the menu, not to
 * make them read 75 rows before they reach the story below.
 */
export default function MenuTeaser() {
  const items = PREVIEW.map((name) => MENU.find((m) => m.name === name)).filter(Boolean);
  const counts = ORDERED.map((c) => ({
    ...c,
    n: MENU.filter((m) => m.category === c.id).length,
  }));

  return (
    <section id="menu" aria-labelledby="menu-teaser-h" className="bg-mist/40 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-espresso/40" />
          <p className="eyebrow">The Menu · 100% Pure Veg</p>
        </div>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="menu-teaser-h"
            className="max-w-[760px] text-step-4 font-normal tracking-[-0.015em] text-balance text-espresso"
          >
            {MENU.length} things worth crossing town for.
          </h2>
          <p className="max-w-prose text-step-0 text-pretty text-mutedwarm">
            Specialty coffee, single-origin manual brews, sourdough open toasts, fresh croissants,
            wood-fired style pizzas and a dessert shelf that changes daily.
          </p>
        </div>

        {/* Preview strip. Scrolls on mobile, six across on desktop. */}
        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:mt-10 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible">
          {items.map((item) => {
            const photo = imageFor(item);
            return (
              <li key={item.name} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
                <Link
                  to={`/menu?q=${encodeURIComponent(item.name)}`}
                  className="group block overflow-hidden rounded-2xl border border-borderwarm bg-white transition-[border-color,box-shadow,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:border-espresso/25 hover:shadow-lift"
                >
                  <Picture
                    slug={photo.slug}
                    alt={item.name}
                    aspect={1}
                    objectPosition={photo.focus}
                    sizes="(min-width: 1024px) 210px, 44vw"
                    imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.07]"
                  />
                  <span className="flex items-baseline justify-between gap-2 p-3">
                    <span className="line-clamp-1 text-step--1 font-semibold text-espresso">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-step--1 font-semibold text-espresso">
                      ₹{item.priceRange || item.price}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/*
          Category chips. These were a wrapped run of inline text with the count
          tucked against the label, which read as one long messy sentence across
          two lines. Discrete pills with the count in its own badge scan in a
          glance and give each category a proper tap target on a phone.
        */}
        <ul className="mt-7 flex flex-wrap gap-1.5 sm:gap-2 lg:mt-9">
          {counts.map((c) => (
            <li key={c.id}>
              <Link
                to={`/menu#cat-${c.id}`}
                className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-borderwarm bg-white/70 pl-3 pr-1.5 text-[12.5px] font-medium text-espresso/85 transition-[border-color,background-color,color] duration-300 hover:border-espresso/30 hover:bg-white hover:text-espresso"
              >
                {c.label}
                <span className="rounded-full bg-cream2 px-1.5 py-0.5 text-[10.5px] tabular-nums text-mutedwarm transition-colors duration-300 group-hover:bg-caramel/15 group-hover:text-caramel">
                  {c.n}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <Link
            to="/menu"
            data-testid="menu-teaser-cta"
            className="btn-glow group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-espresso px-6 text-[14px] font-semibold text-cream transition-colors hover:bg-espresso2"
          >
            Open the full menu
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            to="/menu?show=best"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-espresso/20 px-5 text-[14px] font-medium text-espresso transition-colors hover:border-espresso hover:bg-white"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            See bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
