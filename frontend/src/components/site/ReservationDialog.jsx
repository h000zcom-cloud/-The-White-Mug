import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { TID } from "@/lib/testIds";

const PHONE = "919561166185"; // wa.me format (no +)

export default function ReservationDialog({ open, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: today,
    time: "19:00",
    guests: "2",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone.");
      return;
    }
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    const msg = encodeURIComponent(
      `Hi The White Mug! I'd like to reserve a table.\n\n` +
        `Name: ${form.name}\n` +
        `Phone: ${form.phone}\n` +
        `Date: ${form.date}\n` +
        `Time: ${form.time}\n` +
        `Guests: ${form.guests}\n\n` +
        `Please confirm my table. Thank you!`
    );
    const url = `https://wa.me/${PHONE}?text=${msg}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-espresso/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            data-testid={TID.reserveDialog}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed z-[71] inset-x-4 top-[8vh] mx-auto max-w-[520px] bg-cream border border-borderwarm rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(31,22,20,0.5)]"
          >
            <div className="p-7 lg:p-9">
              <div className="flex items-start justify-between">
                <div>
                  <div className="eyebrow">Reservation · WhatsApp</div>
                  <h3 className="mt-2 font-serif-display text-espresso text-3xl leading-tight tracking-tight">
                    Save your table.
                  </h3>
                  <p className="mt-2 text-mutedwarm text-[13.5px]">
                    We&rsquo;ll open WhatsApp with your details prefilled — send it and we&rsquo;ll confirm.
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-9 h-9 grid place-items-center rounded-full border border-borderwarm hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.28em] text-mutedwarm">Name</label>
                  <input
                    data-testid={TID.reserveName}
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your full name"
                    className="mt-1 w-full h-11 px-4 rounded-xl border border-borderwarm bg-white outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 text-[14px]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.28em] text-mutedwarm">Phone</label>
                  <input
                    data-testid={TID.reservePhone}
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98XXXXXXXX"
                    inputMode="tel"
                    className="mt-1 w-full h-11 px-4 rounded-xl border border-borderwarm bg-white outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.28em] text-mutedwarm">Date</label>
                  <input
                    data-testid={TID.reserveDate}
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={set("date")}
                    className="mt-1 w-full h-11 px-4 rounded-xl border border-borderwarm bg-white outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.28em] text-mutedwarm">Time</label>
                  <input
                    data-testid={TID.reserveTime}
                    type="time"
                    value={form.time}
                    onChange={set("time")}
                    className="mt-1 w-full h-11 px-4 rounded-xl border border-borderwarm bg-white outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 text-[14px]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.28em] text-mutedwarm">Guests</label>
                  <select
                    data-testid={TID.reserveGuests}
                    value={form.guests}
                    onChange={set("guests")}
                    className="mt-1 w-full h-11 px-4 rounded-xl border border-borderwarm bg-white outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30 text-[14px]"
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8+"].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === "1" ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="col-span-2 text-[13px] text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  data-testid={TID.reserveSubmit}
                  className="col-span-2 btn-glow inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-espresso text-cream text-[14px] font-medium hover:bg-espresso2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send on WhatsApp
                </button>

                <p className="col-span-2 text-center text-[11px] text-mutedwarm">
                  Prefer to call? <a href="tel:+919561166185" className="text-espresso underline underline-offset-2">+91 95611 66185</a>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
