import { motion } from "framer-motion";
import { Phone, Menu as MenuIcon, X, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { TID } from "@/lib/testIds";
import { scrollToId } from "@/hooks/useLenis";

const LINKS = [
  { id: "top", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "menu", label: "Menu" },
  { id: "quiz", label: "Find My Brew" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

export default function Nav({ onReserveClick }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToId(id === "top" ? "hero" : id);
  };

  return (
    <>
      <motion.header
        data-testid={TID.nav}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-[background,border,box-shadow] duration-500 ${
          scrolled
            ? "bg-cream/85 backdrop-blur-xl border-b border-borderwarm shadow-[0_10px_30px_-25px_rgba(31,22,20,0.25)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-[64px] lg:h-[72px]">
          {/* Logo */}
          <button
            data-testid={TID.navLogo}
            onClick={() => go("top")}
            className="flex items-center gap-2.5 group"
          >
            <MugIcon />
            <div className="leading-none text-left">
              <div className="font-serif-display text-espresso text-[15px] sm:text-[19px] tracking-tight">
                THE WHITE MUG
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.36em] sm:tracking-[0.4em] text-mutedwarm mt-1">
                cafe · nashik
              </div>
            </div>
          </button>

          {/* Center links */}
          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={TID.navLink(l.id)}
                onClick={() => go(l.id)}
                className="group relative text-[13px] font-medium text-espresso/85 hover:text-espresso transition-colors"
              >
                <span>{l.label}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-caramel scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </button>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="chip hidden sm:inline-flex !py-1.5 !px-3 !text-[11.5px]"
              data-testid="nav-veg-badge"
            >
              <Leaf className="w-3.5 h-3.5 text-vegetal" strokeWidth={2.4} />
              <span className="text-vegetal font-semibold">Pure Veg</span>
            </span>

            <a
              data-testid={TID.navCall}
              href="tel:+919561166185"
              className="hidden sm:inline-flex items-center gap-2 h-10 min-h-[44px] px-4 rounded-full border border-borderwarm text-espresso hover:bg-white transition-colors text-[13px] font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>

            <button
              data-testid={TID.navReserve}
              onClick={onReserveClick}
              className="btn-glow hidden lg:inline-flex items-center gap-2 h-10 min-h-[44px] px-5 rounded-full bg-espresso text-cream text-[13px] font-medium hover:bg-espresso2 transition-colors"
            >
              Reserve Table
              <span className="opacity-70">↗</span>
            </button>

            <button
              data-testid={TID.navMobileToggle}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-11 h-11 min-h-[44px] grid place-items-center rounded-full border border-borderwarm bg-white/70 backdrop-blur-md"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <motion.div
        data-testid={TID.navMobileDrawer}
        initial={false}
        animate={open ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed inset-0 z-40 bg-cream/95 backdrop-blur-xl pt-20 px-6 overflow-y-auto pb-32"
      >
        <div className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <motion.button
              key={l.id}
              onClick={() => go(l.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
              className="text-left py-4 border-b border-borderwarm font-serif-display text-3xl text-espresso"
            >
              {l.label}
            </motion.button>
          ))}
          <motion.button
            onClick={() => {
              setOpen(false);
              onReserveClick?.();
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-6 h-14 min-h-[48px] w-full rounded-full bg-espresso text-cream font-medium"
          >
            Reserve a Table →
          </motion.button>
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="chip">
              <Leaf className="w-3.5 h-3.5 text-vegetal" strokeWidth={2.4} />
              <span className="text-vegetal font-semibold">Pure Veg</span>
            </span>
            <a href="tel:+919561166185" className="chip">
              <Phone className="w-3.5 h-3.5" /> +91 95611 66185
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function MugIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="sm:w-[34px] sm:h-[34px]">
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#FFFFFF" stroke="#EDE4D9" />
      <path
        d="M12 15h13a2 2 0 0 1 2 2v7a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5v-7a2 2 0 0 1 2-2Z"
        stroke="#1F1614"
        strokeWidth="1.6"
      />
      <path d="M27 18h1.5a2.5 2.5 0 0 1 0 5H27" stroke="#1F1614" strokeWidth="1.6" />
      <path d="M16 11c1 1 1 2 0 3M20 11c1 1 1 2 0 3" stroke="#C89D66" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
