import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu as MenuIcon, X, ArrowUpRight } from "lucide-react";
import Logo from "@/components/brand/Logo";
import VegMark from "@/components/brand/VegMark";
import useCafeStatus from "@/hooks/useCafeStatus";
import { BRAND_EASE } from "@/lib/motion";
import { TID } from "@/lib/testIds";
import { cn } from "@/lib/utils";

const PHONE = "+919561166185";

/**
 * Real URLs, so every item is a genuine link — middle-click, open-in-new-tab and
 * crawlers all work, none of which is true of a button that calls scrollTo.
 */
const LINKS = [
  { to: "/menu", label: "Menu" },
  { to: "/#story", label: "Our Story" },
  { to: "/#quiz", label: "Find My Brew" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#location", label: "Visit" },
];

/**
 * Live open/closed indicator.
 *
 * Two forms: a full pill with text where there's room, and a bare pulsing dot
 * beside the logo where there isn't. The dot alone still communicates the one
 * thing that matters at a glance — are they open — without eating 180px of a
 * phone's header.
 */
function StatusDot({ status, className }) {
  return (
    <span aria-hidden="true" className={cn("relative flex h-[7px] w-[7px]", className)}>
      {status.open && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:animate-none",
            status.closingSoon ? "bg-caramel" : "bg-vegetal",
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-[7px] w-[7px] rounded-full",
          status.closingSoon ? "bg-caramel" : status.open ? "bg-vegetal" : "bg-mutedwarm",
        )}
      />
    </span>
  );
}

/**
 * The full pill.
 *
 * Split into a state word and a qualifier rather than one flat run of text.
 * "Open" is the answer; "until 11 PM" is the detail — giving them different
 * weights lets the eye take the answer first and read the rest only if it wants
 * to. The old version set the whole string at one weight, so it scanned as a
 * label rather than a live signal.
 */
function StatusPill({ status, className }) {
  return (
    <span
      data-testid="nav-live-status"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border py-1 pl-2.5 pr-3 transition-colors duration-500",
        status.closingSoon
          ? "border-caramel/40 bg-caramel/[0.09]"
          : status.open
            ? "border-vegetal/30 bg-vegetal/[0.08]"
            : "border-borderwarm bg-cream2",
        className,
      )}
    >
      <StatusDot status={status} />
      <span className="flex items-baseline gap-1.5 whitespace-nowrap leading-none">
        <span
          className={cn(
            "text-[11.5px] font-semibold tracking-tight",
            status.closingSoon ? "text-caramel" : status.open ? "text-vegetal" : "text-mutedwarm",
          )}
        >
          {status.state}
        </span>
        <span className="text-[10.5px] tracking-tight text-mutedwarm">{status.detail}</span>
      </span>
    </span>
  );
}

export default function Nav({ onReserveClick }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const status = useCafeStatus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, hash]);

  // Hold the page still and let Escape dismiss while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onMenuRoute = pathname === "/menu";

  return (
    <>
      <header
        data-testid={TID.nav}
        className={cn(
          // duration-400 is not on Tailwind's duration scale either, so it was
          // also emitting nothing. 300 is the nearest real step.
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-brand",
          /*
           * Opaque enough to read against anything. At 88% the logo and status
           * pill washed out whenever a dark photograph scrolled underneath —
           * the header has to stay legible over the whole page, not just the
           * cream sections.
           */
          /*
           * Opacity values use bracket syntax on purpose.
           *
           * `bg-cream/97` and `bg-cream/92` looked correct but generated nothing:
           * Tailwind only emits multiples of five for that scale, so the header
           * ended up with no background at all and went fully transparent over
           * dark sections. Bracket values are always generated.
           */
          scrolled
            ? "border-b border-borderwarm bg-cream/[0.97] shadow-[0_1px_0_0_rgba(25,23,20,0.04),0_12px_28px_-26px_rgba(25,23,20,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-cream/[0.9]"
            : "border-b border-transparent bg-cream/[0.72] backdrop-blur-md supports-[backdrop-filter]:bg-cream/[0.5]",
        )}
      >
        {/*
          justify-between places the three groups deliberately: logo left, nav
          centred, actions right. On mobile the nav is display:none, so the same
          rule collapses cleanly to logo-left / actions-right.
        */}
        <div
          className="mx-auto flex max-w-shell items-center justify-between gap-3 px-3.5 sm:px-6 lg:px-10"
          style={{ height: "var(--header-h)" }}
        >
          <Link
            to="/"
            data-testid={TID.navLogo}
            aria-label="The White Mug — home"
            className="flex shrink-0 items-center gap-2 rounded-lg"
          >
            <Logo compact />
            {/* Below xl the pill doesn't fit; the dot carries the signal. */}
            <StatusDot status={status} className="ml-0.5 lg:hidden" />
          </Link>

          {/*
            Centre nav. The hover/active state is a pill rather than an
            underline: at this compact height an underline sits awkwardly close
            to the header edge, and a pill gives a bigger, more forgiving
            pointer target.
          */}
          <nav aria-label="Main" className="hidden items-center lg:flex">
            {LINKS.map((l) => {
              const active = l.to === "/menu" && onMenuRoute;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={TID.navLink(l.label.toLowerCase().replace(/\s+/g, "-"))}
                  className={cn(
                    "group relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-300",
                    active ? "text-espresso" : "text-espresso/75 hover:text-espresso",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-espresso/[0.07]"
                      transition={{ duration: 0.3, ease: BRAND_EASE }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 scale-90 rounded-full bg-espresso/0 transition-all duration-300 ease-brand group-hover:scale-100 group-hover:bg-espresso/[0.05]"
                  />
                  {l.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Shown from lg rather than xl, so it isn't present on one desktop
                width and missing on the next. */}
            <StatusPill status={status} className="hidden lg:inline-flex" />

            <a
              data-testid={TID.navCall}
              href={`tel:${PHONE}`}
              aria-label="Call the cafe"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-borderwarm bg-white/60 px-3 text-[12.5px] font-medium text-espresso transition-colors hover:bg-white sm:inline-flex"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Call</span>
            </a>

            <button
              type="button"
              data-testid={TID.navReserve}
              onClick={onReserveClick}
              className="btn-glow group hidden h-9 items-center gap-1.5 rounded-full bg-espresso pl-4 pr-3 text-[12.5px] font-medium text-cream transition-colors hover:bg-espresso2 lg:inline-flex"
            >
              Reserve
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-px group-hover:-translate-y-px"
              />
            </button>

            <button
              type="button"
              data-testid={TID.navMobileToggle}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-9 w-9 place-items-center rounded-full border border-borderwarm bg-white/70 text-espresso backdrop-blur-md transition-colors hover:bg-white lg:hidden"
            >
              {open ? (
                <X aria-hidden="true" className="h-4 w-4" />
              ) : (
                <MenuIcon aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            data-testid={TID.navMobileDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: BRAND_EASE }}
            /*
             * Above everything, including the bottom dock, and fully opaque.
             *
             * Two things were wrong before. It was translucent, so the page
             * behind bled through and the whole panel read as murky. And because
             * it covered the site header, it covered the close button with it —
             * leaving no visible way out. The drawer now carries its own header
             * row with the logo and a close button, so it is self-contained.
             */
            className="fixed inset-0 z-[1000] flex flex-col bg-cream lg:hidden"
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-borderwarm px-3.5 sm:px-6"
              style={{ height: "var(--header-h)" }}
            >
              <Link to="/" aria-label="The White Mug - home" onClick={() => setOpen(false)}>
                <Logo compact interactive={false} />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                data-testid="nav-mobile-close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-borderwarm bg-white text-espresso"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-3"
              style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            >
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.36, ease: BRAND_EASE }}
                >
                  <Link
                    to={l.to}
                    className="flex items-center justify-between gap-3 border-b border-borderwarm py-3.5 text-[22px] font-light tracking-[-0.02em] text-espresso"
                  >
                    {l.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-mutedwarm" />
                  </Link>
                </motion.div>
              ))}

              {/*
                Sits directly under the links rather than being pushed to the
                floor with mt-auto, which left a large dead gap in the middle of
                the panel on a tall phone.
              */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.36, ease: BRAND_EASE }}
                className="mt-6"
              >
                <StatusPill status={status} />

                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-espresso/20 bg-white text-[14px] font-medium text-espresso"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4" />
                    Call
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onReserveClick?.();
                    }}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-espresso text-[14px] font-semibold text-cream"
                  >
                    Reserve
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-snug text-mutedwarm">
                  <VegMark className="mt-px h-3.5 w-3.5" />
                  100% pure vegetarian kitchen · Mahatma Nagar Road, Nashik
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
