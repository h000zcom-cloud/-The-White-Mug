import { motion } from "framer-motion";
import { Menu as MenuIcon, MapPin, Phone, CalendarClock } from "lucide-react";
import { scrollToId } from "@/hooks/useLenis";

const MAP_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=20.0063999,73.7546168";

/**
 * Fixed bottom action dock — only rendered on mobile / tablet.
 * Frosted glass, thumb-friendly 44px+ hits, primary CTA (Reserve) highlighted.
 */
export default function MobileDock({ onReserveClick }) {
  const btn =
    "flex flex-col items-center justify-center gap-1 flex-1 min-h-[52px] py-1.5 rounded-2xl active:scale-95 transition-transform";

  return (
    <motion.nav
      data-testid="mobile-dock"
      aria-label="Quick actions"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      className="lg:hidden fixed inset-x-0 bottom-0 z-[999] px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-[560px] flex items-center gap-1.5 rounded-[28px] border border-borderwarm bg-cream/85 backdrop-blur-xl shadow-[0_18px_45px_-15px_rgba(31,22,20,0.35)] px-2 py-1.5">
        <button
          data-testid="dock-menu-btn"
          onClick={() => scrollToId("menu")}
          className={`${btn} text-espresso`}
        >
          <MenuIcon className="w-4 h-4" strokeWidth={1.8} />
          <span className="text-[10.5px] font-medium tracking-tight">Menu</span>
        </button>

        <a
          data-testid="dock-directions-btn"
          href={MAP_LINK}
          target="_blank"
          rel="noreferrer"
          className={`${btn} text-espresso`}
        >
          <MapPin className="w-4 h-4" strokeWidth={1.8} />
          <span className="text-[10.5px] font-medium tracking-tight">Directions</span>
        </a>

        <a
          data-testid="dock-call-btn"
          href="tel:+919561166185"
          className={`${btn} text-espresso`}
        >
          <Phone className="w-4 h-4" strokeWidth={1.8} />
          <span className="text-[10.5px] font-medium tracking-tight">Call</span>
        </a>

        <button
          data-testid="dock-reserve-btn"
          onClick={onReserveClick}
          className="flex-1 min-h-[52px] flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl bg-espresso text-cream active:scale-95 transition-transform"
        >
          <CalendarClock className="w-4 h-4" strokeWidth={1.8} />
          <span className="text-[10.5px] font-semibold tracking-tight">Reserve</span>
        </button>
      </div>
    </motion.nav>
  );
}
