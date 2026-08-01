import { Instagram, Leaf, Shield } from "lucide-react";
import { TID } from "@/lib/testIds";
import { scrollToId } from "@/hooks/useLenis";

const LINKS = [
  { id: "story", label: "Our Story" },
  { id: "menu", label: "Menu" },
  { id: "signature", label: "Signature Brews" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

export default function Footer() {
  return (
    <footer
      data-testid={TID.footer}
      className="relative bg-espresso text-cream pt-14 sm:pt-20 pb-8 sm:pb-10 overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-10">
          <div className="col-span-12 lg:col-span-6">
            <div className="font-serif-display text-[15vw] leading-[0.95] sm:text-7xl lg:text-[104px] tracking-[-0.03em]">
              The White Mug<span className="text-caramel">.</span>
            </div>
            <p className="mt-4 sm:mt-6 text-cream/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[520px]">
              A specialty coffee house and pure vegetarian cafe in Mahatma Nagar, Nashik. Open every
              day 9:30 AM – 11:00 PM.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="chip !bg-cream/10 !border-cream/15 !text-cream">
                <Leaf className="w-3.5 h-3.5 text-vegetal" /> <span className="text-vegetal">Pure Veg Kitchen</span>
              </span>
              <span className="chip !bg-cream/10 !border-cream/15 !text-cream">
                <Shield className="w-3.5 h-3.5 text-caramel" /> Verified · Nashik
              </span>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-3">
            <div className="eyebrow text-cream/50">Explore</div>
            <ul className="mt-5 space-y-3">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="text-cream/85 hover:text-caramel transition-colors text-[14px]"
                  >
                    {l.label}
                  </button>
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
