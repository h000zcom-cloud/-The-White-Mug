import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Instagram, ExternalLink, Navigation } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { TID } from "@/lib/testIds";
import { ReserveCtx } from "@/lib/reserve-context";

const NAV_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=20.0063999,73.7546168";
const PLACE_LINK = "https://www.google.com/maps/place/20.0063999,73.7546168";
const MAP_EMBED =
  "https://www.google.com/maps?q=20.0063999,73.7546168&hl=en&z=17&output=embed";

// Compute open/close status in IST regardless of client timezone.
function useLiveStatus() {
  const [state, setState] = useState({ open: true, label: "Open Now until 11:00 PM" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const mins = ist.getHours() * 60 + ist.getMinutes();
      const open = 9 * 60 + 30; // 9:30
      const close = 23 * 60; // 23:00
      const isOpen = mins >= open && mins < close;
      setState({
        open: isOpen,
        label: isOpen ? "Open Now until 11:00 PM" : "Closed · Opens 9:30 AM",
      });
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  return state;
}

export default function Location() {
  const status = useLiveStatus();
  const openReserve = useContext(ReserveCtx);

  return (
    <section
      id="location"
      data-testid={TID.location}
      className="relative py-14 sm:py-20 lg:py-32 bg-cream"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-espresso/40" />
          <span className="eyebrow">Location · Timings · Reservations</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-14">
          <h2 className="font-serif-display text-espresso text-[34px] leading-[1.05] sm:text-5xl lg:text-[64px] tracking-[-0.02em] max-w-[820px]">
            Find us on Mahatma Nagar Road. <em className="italic text-caramel not-italic">Stay a while.</em>
          </h2>
          <div
            data-testid="live-status"
            className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-[12.5px] font-medium border ${
              status.open
                ? "bg-vegetal/10 border-vegetal/30 text-vegetal"
                : "bg-borderwarm/50 border-borderwarm text-mutedwarm"
            }`}
          >
            <span className="relative flex w-2.5 h-2.5">
              {status.open && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vegetal opacity-60" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  status.open ? "bg-vegetal" : "bg-mutedwarm"
                }`}
              />
            </span>
            {status.label}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="col-span-12 lg:col-span-7 relative rounded-3xl overflow-hidden border border-borderwarm bg-white min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]"
          >
            <iframe
              title="The White Mug – Location Map"
              src={MAP_EMBED}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              data-testid={TID.locationDirections}
              href={NAV_LINK}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-espresso text-cream text-[13px] font-medium hover:bg-espresso2 transition-colors"
            >
              <Navigation className="w-4 h-4" /> Navigate via Google Maps
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </motion.div>

          {/* Info stack */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-3 lg:gap-4"
          >
            <div className="rounded-3xl border border-borderwarm bg-white p-6 lg:p-7">
              <div className="eyebrow flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Address
              </div>
              <p className="mt-3 font-serif-display text-espresso text-[19px] sm:text-[22px] leading-snug tracking-tight">
                Shop 4, 5 &amp; 6, 8 Building, Mahatma Nagar Road, Veer Sawarkar Nagar,
                College Road, Nashik, Maharashtra 422005
              </p>
              <a
                href={PLACE_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-caramel hover:text-espresso"
              >
                20.0063999, 73.7546168 <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="rounded-3xl border border-borderwarm bg-white p-6 lg:p-7 grid grid-cols-2 gap-4 lg:gap-6">
              <div>
                <div className="eyebrow flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Timings
                </div>
                <p className="mt-3 text-espresso text-[14.5px] font-medium">Every Day</p>
                <p className="text-mutedwarm text-[13px]">9:30 AM – 11:00 PM</p>
              </div>
              <div>
                <div className="eyebrow flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Reach us
                </div>
                <a
                  data-testid={TID.locationCall}
                  href="tel:+919561166185"
                  className="mt-3 block text-espresso text-[14.5px] font-medium hover:text-caramel transition-colors"
                >
                  +91 95611 66185
                </a>
                <a
                  href="tel:7861004444"
                  className="text-mutedwarm text-[13px] hover:text-espresso transition-colors"
                >
                  786 100 4444
                </a>
              </div>
            </div>

            {/* One-tap action row */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={NAV_LINK}
                target="_blank"
                rel="noreferrer"
                data-testid="one-tap-navigate"
                className="flex flex-col items-center justify-center gap-1 min-h-[64px] rounded-2xl border border-borderwarm bg-white hover:bg-cream2 text-espresso transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-[11.5px] font-medium">Navigate</span>
              </a>
              <a
                href="tel:+919561166185"
                data-testid="one-tap-call"
                className="flex flex-col items-center justify-center gap-1 min-h-[64px] rounded-2xl border border-borderwarm bg-white hover:bg-cream2 text-espresso transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-[11.5px] font-medium">Call Cafe</span>
              </a>
              <a
                href="https://www.instagram.com/thewhitemugcafe"
                target="_blank"
                rel="noreferrer"
                data-testid={TID.locationInsta}
                className="flex flex-col items-center justify-center gap-1 min-h-[64px] rounded-2xl border border-borderwarm bg-white hover:bg-cream2 text-espresso transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-[11.5px] font-medium">Follow</span>
              </a>
            </div>

            <div className="rounded-3xl border border-espresso bg-espresso text-cream p-6 lg:p-7 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-caramel/25 blur-2xl" />
              <div className="eyebrow text-cream/60">Reservations · Party Inquiries</div>
              <h4 className="font-serif-display text-cream text-2xl mt-3">Save your table in 10 seconds.</h4>
              <p className="text-cream/70 text-[13px] mt-2">
                Includes birthday, anniversary and small-party requests — sent directly on WhatsApp.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  data-testid={TID.reserveOpen}
                  onClick={() => openReserve?.()}
                  className="btn-glow inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-cream text-espresso text-[13px] font-semibold hover:bg-white transition-colors"
                >
                  Reserve a Table
                  <span>↗</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
