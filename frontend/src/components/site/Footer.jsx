import { Link } from "react-router-dom";
import { Instagram, Shield } from "lucide-react";
import { TID } from "@/lib/testIds";
import { DrawOnViewMark } from "@/components/brand/Logo";
import VegMark from "@/components/brand/VegMark";

const LINKS = [
  { to: "/menu", label: "Full Menu" },
  { to: "/menu?show=best", label: "Bestsellers" },
  { to: "/#story", label: "Our Story" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#location", label: "Visit Us" },
];

export default function Footer() {
  return (
    <footer
      data-testid={TID.footer}
      className="on-ink relative overflow-hidden bg-espresso pt-14 text-cream sm:pt-20"
      /*
       * The footer absorbs the mobile dock's clearance, so the dark background
       * runs all the way behind it. Putting this padding on an unstyled wrapper
       * left a pale band under the footer.
       */
      style={{ paddingBottom: "calc(var(--dock-h) + 2.25rem)" }}
    >
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-10">
          <div className="col-span-12 lg:col-span-6">
            {/* Draws itself as the footer scrolls in — the closing beat that
                answers the opening sequence. */}
            <DrawOnViewMark className="h-16 w-16 text-cream/90" strokeWidth={2.6} />

            {/*
              The wordmark is the brand, so it must never break badly. Previously
              a viewport-relative size let it wrap to "THE WHITE / MUG" at desktop
              widths, splitting the name in half. It's now one unbreakable line,
              sized by clamp against the container so it scales instead of wraps.
            */}
            <div
              className="mt-7 whitespace-nowrap font-sign leading-[1.02] text-cream"
              style={{ fontSize: "clamp(1.7rem, 6.2vw, 3.55rem)", letterSpacing: "0.1em" }}
            >
              The White Mug
            </div>
            <div className="mt-3 h-px w-16 bg-caramel/70" aria-hidden="true" />
            <p className="mt-3 text-[10.5px] uppercase tracking-[0.34em] text-cream/50">
              Cafe · Nashik
            </p>
            <p className="mt-4 sm:mt-6 text-cream/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[520px]">
              A specialty coffee house and pure vegetarian cafe in Mahatma Nagar, Nashik. Open every
              day 9:30 AM – 11:00 PM.
            </p>
            {/*
              These chips were near-invisible: the brand green on a near-black
              panel measures around 2:1. The veg symbol and its label now use the
              light variant, which clears AA on this surface.
            */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.07] px-3 py-1.5 text-[12px] font-medium text-cream/90">
                <VegMark tone="light" className="h-3.5 w-3.5" />
                100% Pure Veg Kitchen
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.07] px-3 py-1.5 text-[12px] font-medium text-cream/90">
                <Shield aria-hidden="true" className="h-3.5 w-3.5 text-caramel2" />
                Verified · Nashik
              </span>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-3">
            <div className="eyebrow text-cream/50">Explore</div>
            <ul className="mt-5 space-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[14px] text-cream/85 transition-colors hover:text-caramel"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-3">
            <div className="eyebrow text-cream/50">Contact</div>
            <ul className="mt-5 space-y-3 text-[14px]">
              <li>
                <a href="tel:+919561166185" className="text-cream/85 hover:text-caramel transition-colors">
                  +91 95611 66185
                </a>
              </li>
              <li>
                <a href="tel:7861004444" className="text-cream/60 hover:text-caramel transition-colors">
                  786 100 4444
                </a>
              </li>
              <li>
                <a
                  data-testid={TID.footerInsta}
                  href="https://www.instagram.com/thewhitemugcafe"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-cream/85 hover:text-caramel transition-colors"
                >
                  <Instagram className="w-4 h-4" /> @thewhitemugcafe
                </a>
              </li>
              <li className="text-cream/60 leading-relaxed">
                Shop 4, 5 &amp; 6, 8 Building, Mahatma Nagar Rd, Veer Sawarkar Nagar,
                College Road, Nashik – 422005
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-[12px] text-cream/60">
          <div>
            © {new Date().getFullYear()} The White Mug · Cafe · Nashik. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by <span className="text-cream">Ready2UP</span></span>
            <span className="opacity-40">·</span>
            <span>Designed by <span className="text-cream">Dragosaurabh</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
