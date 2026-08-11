import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, Phone, CalendarClock } from "lucide-react";
import { BRAND_EASE } from "@/lib/motion";

const MAP_LINK = "https://www.google.com/maps/dir/?api=1&destination=20.0063999,73.7546168";
const PHONE = "+919561166185";

/**
 * Fixed bottom action bar, mobile and tablet only.
 *
 * Rebuilt more compact. The previous version used 52px tall stacked
 * icon-over-label buttons inside a generously padded floating pill, which took
 * around 80px off an already short phone viewport and sat heavily over the
 * content. This trims to 44px rows, smaller glyphs and tighter chrome, so it
 * reads as a slim utility bar rather than a second navigation.
 *
 * Reserve keeps the filled treatment because it's the one action worth money,
 * but no longer claims extra width, which was making the group look lopsided.
 */
export default function MobileDock({ onReserveClick }) {
  const item =
    "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-espresso transition-transform duration-200 active:scale-95";

  return (
    <motion.nav
      data-testid="mobile-dock"
      aria-label="Quick actions"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: BRAND_EASE }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[999] px-2.5 pt-1.5 lg:hidden"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      {/*
        Solid background, not translucent glass.
        `bg-cream/92` generated no rule at all (Tailwind only emits multiples of
        five on that scale), so the dock had no background and its near-black
        icons vanished against the dark footer. A bottom action bar sits over
        arbitrary content for the whole session, so it needs to be legible
        against all of it — which is also why platform tab bars are opaque.
      */}
      <div className="pointer-events-auto mx-auto flex max-w-[460px] items-stretch gap-1 rounded-2xl border border-borderwarm bg-cream px-1.5 py-1.5 shadow-[0_8px_28px_-12px_rgba(25,23,20,0.35)]">
        <Link data-testid="dock-menu-btn" to="/menu" className={item}>
          <UtensilsCrossed aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.7} />
          <span className="text-[9.5px] font-medium leading-none tracking-tight">Menu</span>
        </Link>

        <a
          data-testid="dock-directions-btn"
          href={MAP_LINK}
          target="_blank"
          rel="noreferrer"
          className={item}
        >
          <MapPin aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.7} />
          <span className="text-[9.5px] font-medium leading-none tracking-tight">Directions</span>
        </a>

        <a data-testid="dock-call-btn" href={`tel:${PHONE}`} className={item}>
          <Phone aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.7} />
          <span className="text-[9.5px] font-medium leading-none tracking-tight">Call</span>
        </a>

        <button
          type="button"
          data-testid="dock-reserve-btn"
          onClick={onReserveClick}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-espresso py-1 text-cream transition-transform duration-200 active:scale-95"
        >
          <CalendarClock aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.7} />
          <span className="text-[9.5px] font-semibold leading-none tracking-tight">Reserve</span>
        </button>
      </div>
    </motion.nav>
  );
}
