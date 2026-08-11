import { useEffect, useRef } from "react";
import { X, Flame, Sparkles, Phone } from "lucide-react";
import Picture from "@/components/media/Picture";
import { imageFor } from "@/data/menuImages";
import { ADDONS, CATEGORIES } from "@/data/menu";
import { VegMark } from "@/components/menu/MenuCard";

const PHONE = "+919561166185";

/**
 * Detail view for a single menu item.
 *
 * Built on the native <dialog> element rather than a div-with-role. The platform
 * gives us focus trapping, focus restoration on close, Escape handling, inert
 * background content and the top layer for free — all things a hand-rolled
 * modal usually gets subtly wrong.
 */
export default function MenuItemSheet({ item, onClose, onReserve }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (item && !el.open) el.showModal();
    if (!item && el.open) el.close();
  }, [item]);

  // `close` fires for Escape and for the backdrop-click path below, so this is
  // the single place that reports dismissal upward.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onClose?.();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  // Lock background scrolling while open.
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  const photo = item ? imageFor(item) : null;
  const category = item ? CATEGORIES.find((c) => c.id === item.category) : null;
  const isDrink = item
    ? ["specialty", "manual", "cold", "coolers"].includes(item.category)
    : false;

  return (
    <dialog
      ref={ref}
      data-testid="menu-item-sheet"
      aria-labelledby="menu-sheet-title"
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself, outside the panel)
        // dismisses. Clicks inside the panel stop at the panel.
        if (e.target === ref.current) ref.current.close();
      }}
      className="m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-espresso/55 backdrop:backdrop-blur-sm open:flex h-full w-full items-end justify-center open:animate-rise-in sm:items-center"
    >
      {item && (
        <div className="relative flex w-full max-w-[720px] max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-cream text-left shadow-lift-lg sm:max-h-[86dvh] sm:rounded-3xl">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-borderwarm bg-cream/90 text-espresso backdrop-blur transition-colors hover:bg-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>

          <div className="overflow-y-auto overscroll-contain">
            <Picture
              slug={photo.slug}
              alt={item.name}
              aspect={16 / 10}
              objectPosition={photo.focus}
              priority
              sizes="(min-width: 720px) 720px, 100vw"
            />

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow !text-[10px]">{category?.label}</span>
                {item.bestseller && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-espresso px-2 py-0.5 text-[10px] font-semibold text-cream">
                    <Flame aria-hidden="true" className="h-2.5 w-2.5" /> Bestseller
                  </span>
                )}
                {item.special && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-caramel px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Sparkles aria-hidden="true" className="h-2.5 w-2.5" /> House Special
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <h2
                  id="menu-sheet-title"
                  className="text-step-2 font-medium leading-tight tracking-[-0.01em] text-espresso"
                >
                  {item.name}
                </h2>
                <div className="whitespace-nowrap text-step-2 font-semibold text-espresso">
                  ₹{item.priceRange || item.price}
                </div>
              </div>

              <p className="mt-3 max-w-prose text-step-0 text-pretty text-mutedwarm">{item.desc}</p>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-vegetal/25 bg-vegetal/5 px-3 py-2.5">
                <VegMark />
                <span className="text-step--1 font-medium text-vegetal">
                  Prepared in a 100% pure vegetarian kitchen
                </span>
              </div>

              {isDrink && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <AddOn
                    title="Flavour shots"
                    price={ADDONS.flavours.price}
                    items={ADDONS.flavours.items}
                  />
                  <AddOn title="Alternative milks" price={ADDONS.milk.price} items={ADDONS.milk.items} />
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    ref.current?.close();
                    onReserve?.(item.name);
                  }}
                  className="btn-glow inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-espresso px-6 text-step--1 font-semibold text-cream transition-colors hover:bg-espresso2"
                >
                  Reserve a table for this
                </button>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-espresso/20 px-6 text-step--1 font-medium text-espresso transition-colors hover:border-espresso hover:bg-white"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call to order
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function AddOn({ title, price, items }) {
  return (
    <div className="rounded-xl border border-borderwarm bg-white p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-step--1 font-semibold text-espresso">{title}</span>
        <span className="whitespace-nowrap text-step--1 font-semibold text-caramel">+₹{price}</span>
      </div>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-mutedwarm">{items.join(" · ")}</p>
    </div>
  );
}
