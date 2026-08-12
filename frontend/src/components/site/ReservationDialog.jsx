import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { TID } from "@/lib/testIds";

const PHONE = "919561166185"; // wa.me format (no +)

export default function ReservationDialog({ open, onClose, prefillItem }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: today,
    time: "19:00",
    guests: "2",
    notes: "",
  });
  const [error, setError] = useState("");

  // When opened with a menu item, seed the "Special Requests" field
  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        notes: prefillItem ? `Interested in trying: ${prefillItem}` : f.notes,
      }));
    }
  }, [open, prefillItem]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
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
    const lines = [
      `Hi The White Mug team, I'd like to reserve a table.`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Date: ${form.date}`,
      `Time: ${form.time}`,
      `Guests: ${form.guests}`,
    ];
    if (form.notes.trim()) lines.push(`Special requests: ${form.notes.trim()}`);
    lines.push("", "Please confirm my table. Thank you!");
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
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
            className="fixed inset-0 z-[1070] bg-espresso/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            data-testid={TID.reserveDialog}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            /*
             * Centred with `inset-x-0` + `mx-auto`, NOT with `left-1/2` and
             * `-translate-x-1/2`.
             *
             * This is the important part: framer-motion animates `y` and
             * `scale`, and it writes those as an *inline* `transform` style.
             * An inline style beats a class, so motion's transform silently
             * replaced Tailwind's `-translate-x-1/2` entirely. The panel kept
             * `left: 50%` with no correction, so its left edge sat at the
             * middle of the screen and the whole dialog hung off the right.
             *
             * With a definite width and `margin-inline: auto` the box centres
             * through layout instead of through a transform, so motion is free
             * to own `transform` without fighting it. The sideways-pan bug this
             * replaced was actually caused by `min-width: auto` on the grid
             * children, which `min-w-0` on `inputCls` and `Field` fixes.
             *
             * `dvh` not `vh`: on mobile, `vh` ignores the browser's own chrome,
             * so a 90vh panel gets its bottom cut off.
             */
            className="fixed inset-x-0 bottom-3 z-[1071] mx-auto flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-[540px] flex-col overflow-hidden rounded-[28px] border border-borderwarm bg-cream shadow-[0_40px_80px_-30px_rgba(31,22,20,0.5)] sm:bottom-auto sm:top-[6vh]"
          >
            <div className="overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow">Reservation · WhatsApp</div>
                  <h3 className="mt-2 font-serif-display text-espresso text-[26px] sm:text-3xl leading-tight tracking-tight">
                    Save your table.
                  </h3>
                  <p className="mt-2 text-mutedwarm text-[13px]">
                    We&rsquo;ll open WhatsApp with everything prefilled — send and we&rsquo;ll confirm within minutes.
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-10 h-10 min-h-[44px] min-w-[44px] shrink-0 grid place-items-center rounded-full border border-borderwarm hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {prefillItem && (
                <div className="mt-5 flex items-center gap-2 rounded-full bg-caramel/15 border border-caramel/30 pl-3 pr-2 py-2">
                  <Sparkles className="w-3.5 h-3.5 text-caramel" strokeWidth={2.2} />
                  <span className="text-[12.5px] text-espresso truncate">
                    You&rsquo;re reserving for <strong>{prefillItem}</strong>
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-3.5">
                <Field label="Name" className="col-span-2">
                  <input
                    data-testid={TID.reserveName}
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone" className="col-span-2">
                  <input
                    data-testid={TID.reservePhone}
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98XXXXXXXX"
                    inputMode="tel"
                    className={inputCls}
                  />
                </Field>
                <Field label="Date">
                  <input
                    data-testid={TID.reserveDate}
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={set("date")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Time">
                  <input
                    data-testid={TID.reserveTime}
                    type="time"
                    value={form.time}
                    onChange={set("time")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Guests" className="col-span-2">
                  <select
                    data-testid={TID.reserveGuests}
                    value={form.guests}
                    onChange={set("guests")}
                    className={inputCls}
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8+"].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === "1" ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Special Requests · optional" className="col-span-2">
                  <textarea
                    data-testid="reserve-input-notes"
                    value={form.notes}
                    onChange={set("notes")}
                    rows={2}
                    placeholder="Window seat · Birthday · Anniversary · Party inquiry…"
                    className={`${inputCls} !h-auto py-3 resize-none`}
                  />
                </Field>

                {error && (
                  <p className="col-span-2 text-[13px] text-red-700" data-testid="reserve-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  data-testid={TID.reserveSubmit}
                  className="col-span-2 btn-glow inline-flex items-center justify-center gap-2 min-h-[48px] h-12 px-6 rounded-full bg-espresso text-cream text-[14px] font-medium hover:bg-espresso2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send on WhatsApp
                </button>

                <p className="col-span-2 text-center text-[11px] text-mutedwarm">
                  Prefer to call?{" "}
                  <a href="tel:+919561166185" className="text-espresso underline underline-offset-2">
                    +91 95611 66185
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * `min-w-0` is the important one.
 *
 * Native date, time and select controls carry a large intrinsic minimum width —
 * on Android Chrome a date input refuses to render below roughly 140px. Grid and
 * flex children default to `min-width: auto`, which means "never shrink below
 * your content's minimum", so the two-column row could not fit and pushed the
 * whole dialog wider than the screen. That is what made the form pan sideways.
 */
const inputCls =
  "mt-1 h-11 min-h-[44px] w-full min-w-0 max-w-full rounded-xl border border-borderwarm bg-white px-3.5 text-[14px] outline-none focus:border-espresso/40 focus:ring-2 focus:ring-caramel/30";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block truncate text-[11px] uppercase tracking-[0.22em] text-mutedwarm">
        {label}
      </span>
      {children}
    </label>
  );
}
