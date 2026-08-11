import { Flame, Sparkles } from "lucide-react";
import Picture from "@/components/media/Picture";
import VegMark from "@/components/brand/VegMark";
import { imageFor } from "@/data/menuImages";
import { TID } from "@/lib/testIds";
import { cn } from "@/lib/utils";

// Re-exported so existing imports from this module keep working.
export { VegMark };

/**
 * One menu item.
 *
 * Rebuilt to stop the photograph and the text competing.
 *
 * Previously a badge and the veg symbol were both floated on top of the image,
 * which meant every tile carried two overlays fighting the food for attention,
 * and on a phone at roughly 170px wide there wasn't room for any of it. Both now
 * live in the text block: the veg mark sits inline with the name where Indian
 * menus conventionally put it, and the badge is a quiet label under the price.
 *
 * The name and price are the two things people scan for, so they get the first
 * line to themselves and the strongest weight on the card.
 */
export default function MenuCard({ item, onOpen, layout = "grid" }) {
  const photo = imageFor(item);
  const price = item.priceRange ? `₹${item.priceRange}` : `₹${item.price}`;
  const badge = item.bestseller ? "bestseller" : item.special ? "special" : null;

  if (layout === "list") {
    return (
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        data-testid={TID.menuItem(item.name)}
        className="group flex w-full items-center gap-3.5 rounded-2xl border border-borderwarm bg-white p-2.5 text-left transition-[border-color,box-shadow] duration-300 hover:border-espresso/25 hover:shadow-lift sm:p-3"
      >
        <Picture
          slug={photo.slug}
          alt={item.name}
          aspect={1}
          objectPosition={photo.focus}
          sizes="(min-width: 640px) 96px, 80px"
          className="w-20 shrink-0 rounded-xl sm:w-24"
          imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
        />

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-start justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5">
              <VegMark className="h-3.5 w-3.5" />
              <span className="truncate text-[15px] font-semibold leading-snug text-espresso">
                {item.name}
              </span>
            </span>
            <span className="shrink-0 text-[15px] font-semibold tabular-nums text-espresso">
              {price}
            </span>
          </span>
          <span className="line-clamp-2 text-[12.5px] leading-snug text-mutedwarm">{item.desc}</span>
          {badge && <Badge kind={badge} />}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      data-testid={TID.menuItem(item.name)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borderwarm bg-white text-left transition-[border-color,box-shadow,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:border-espresso/25 hover:shadow-lift"
    >
      <Picture
        slug={photo.slug}
        alt={item.name}
        aspect={4 / 3}
        objectPosition={photo.focus}
        sizes="(min-width: 1280px) 340px, (min-width: 1024px) 27vw, (min-width: 640px) 31vw, 46vw"
        imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
      />

      <span className="flex flex-1 flex-col p-3 sm:p-3.5">
        <span className="flex items-start justify-between gap-2.5">
          <span className="flex min-w-0 items-start gap-1.5">
            <VegMark className="mt-[3px] h-3.5 w-3.5" />
            <span className="line-clamp-2 text-[14px] font-semibold leading-snug text-espresso sm:text-[15px]">
              {item.name}
            </span>
          </span>
          <span className="shrink-0 text-[14px] font-semibold tabular-nums text-espresso sm:text-[15px]">
            {price}
          </span>
        </span>

        <span className="mt-1.5 line-clamp-2 text-[11.5px] leading-snug text-mutedwarm sm:text-[12.5px]">
          {item.desc}
        </span>

        {badge && (
          <span className="mt-2.5">
            <Badge kind={badge} />
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * A quiet text label rather than a coloured sticker on the photograph. There are
 * only two states worth calling out, so they don't need to shout.
 */
function Badge({ kind }) {
  const isBest = kind === "bestseller";
  const Icon = isBest ? Flame : Sparkles;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em]",
        isBest ? "bg-espresso/[0.06] text-espresso" : "bg-caramel/[0.12] text-caramel",
      )}
    >
      <Icon aria-hidden="true" className="h-2.5 w-2.5" />
      {isBest ? "Bestseller" : "House special"}
    </span>
  );
}
