import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Instagram, ExternalLink } from "lucide-react";
import { TID } from "@/lib/testIds";

const MAP_LINK = "https://maps.app.goo.gl/xF1oL7z2xZ8oPKPq9";
const MAP_EMBED =
  "https://www.google.com/maps?q=The+White+Mug+Cafe+Mahatma+Nagar+Nashik&hl=en&z=17&output=embed";

export default function Location({ onReserveClick }) {
  return (
    <section
      id="location"
      data-testid={TID.location}
      className="relative py-24 lg:py-32 bg-cream"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-espresso/40" />
              <span className="eyebrow">Location · Timings · Reservations</span>
            </div>
            <h2 className="font-serif-display text-espresso text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.02em]">
              Find us on Mahatma Nagar Road. <em className="italic text-caramel not-italic">Stay a while.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="col-span-12 lg:col-span-7 relative rounded-3xl overflow-hidden border border-borderwarm bg-white min-h-[440px]"
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
              href={MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-espresso text-cream text-[13px] font-medium hover:bg-espresso2 transition-colors"
            >
              <MapPin className="w-4 h-4" /> Open in Google Maps
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </motion.div>

          {/* Info stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-4"
          >
            <div className="rounded-3xl border border-borderwarm bg-white p-7">
              <div className="eyebrow">Address</div>
              <p className="mt-3 font-serif-display text-espresso text-[22px] leading-snug tracking-tight">
                Shop 4, 5 &amp; 6, 8 Building, Mahatma Nagar Road,
                Veer Sawarkar Nagar, College Road, Nashik,
                Maharashtra 422005
              </p>
            </div>

            <div className="rounded-3xl border border-borderwarm bg-white p-7 grid grid-cols-2 gap-6">
              <div>
                <div className="eyebrow flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Timings
                </div>
                <p className="mt-3 text-espresso text-[15px] font-medium">Every Day</p>
                <p className="text-mutedwarm text-[13px]">9:30 AM – 11:00 PM</p>
              </div>
              <div>
                <div className="eyebrow flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Reach us
                </div>
                <a
                  data-testid={TID.locationCall}
                  href="tel:+919561166185"
                  className="mt-3 block text-espresso text-[15px] font-medium hover:text-caramel transition-colors"
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

            <div className="rounded-3xl border border-espresso bg-espresso text-cream p-7 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-caramel/25 blur-2xl" />
              <div className="eyebrow text-cream/60">Reservations</div>
              <h4 className="font-serif-display text-2xl mt-3">Save your table in 10 seconds.</h4>
              <p className="text-cream/70 text-[13.5px] mt-2">
                Send us your date &amp; guest count on WhatsApp — we confirm within minutes.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  data-testid={TID.reserveOpen}
                  onClick={onReserveClick}
                  className="btn-glow inline-flex items-center gap-2 h-11 px-5 rounded-full bg-cream text-espresso text-[13px] font-semibold hover:bg-white transition-colors"
                >
                  Reserve a Table
                  <span>↗</span>
                </button>
                <a
                  data-testid={TID.locationInsta}
                  href="https://www.instagram.com/thewhitemugcafe"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-cream/25 text-cream text-[13px] font-medium hover:bg-cream/10 transition-colors"
                >
                  <Instagram className="w-4 h-4" /> @thewhitemugcafe
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
