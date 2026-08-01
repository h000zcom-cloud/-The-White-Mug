import { CHIP_CATEGORIES } from "@/data/menu";
import { img } from "@/lib/images";
import { scrollToId } from "@/hooks/useLenis";

/**
 * Instagram-style circular "story highlight" chips.
 * Horizontal-scroll on mobile, wrap on desktop.
 * Tap → switches the menu tab (via onSelect) and smooth-scrolls to the menu.
 */
export default function CategoryChips({ activeTab, onSelect }) {
  const handle = (id) => {
    onSelect?.(id);
    // Small delay so React can update state before scroll
    setTimeout(() => scrollToId("menu"), 60);
  };

  return (
    <div
      data-testid="category-chips"
      className="-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-start gap-4 sm:gap-5 pb-2 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-center">
        {CHIP_CATEGORIES.map((c) => {
          const active = activeTab === c.id;
          return (
            <button
              key={c.id}
              data-testid={`chip-${c.id}`}
              onClick={() => handle(c.id)}
              className="group flex flex-col items-center gap-2 min-w-[68px] active:scale-95 transition-transform"
            >
              <span
                className={`relative block rounded-full p-[2.5px] transition-all ${
                  active
                    ? "bg-gradient-to-tr from-caramel via-caramel2 to-caramel"
                    : "bg-gradient-to-tr from-borderwarm to-cream2 group-hover:from-caramel/60 group-hover:to-caramel2/60"
                }`}
              >
                <span className="block bg-cream rounded-full p-[3px]">
                  <span className="block w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden bg-cream2">
                    <img
                      src={img(c.image)}
                      alt={c.label}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-[12px] font-medium text-espresso/85 leading-tight text-center max-w-[80px]">
                <span aria-hidden="true">{c.emoji}</span>
                <span className="truncate">{c.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
