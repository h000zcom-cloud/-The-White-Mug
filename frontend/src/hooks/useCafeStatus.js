import { useEffect, useState } from "react";

/** Opening hours, every day. */
export const OPEN_MIN = 9 * 60 + 30; // 09:30
export const CLOSE_MIN = 23 * 60; // 23:00

/**
 * Is the cafe open right now?
 *
 * Evaluated in Asia/Kolkata regardless of the visitor's own timezone, so
 * someone browsing from abroad still sees Nashik's clock. The previous version
 * of this logic was inlined in the Location section; it lives here so the nav
 * and the location card can never disagree.
 *
 * Re-checks on a 30s interval and again whenever the tab regains focus, because
 * a backgrounded tab's timers are throttled and can drift a long way.
 */
export default function useCafeStatus() {
  const [state, setState] = useState(() => compute());

  useEffect(() => {
    const tick = () => setState(compute());
    tick();

    const id = setInterval(tick, 30_000);
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return state;
}

function compute() {
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const mins = nowIST.getHours() * 60 + nowIST.getMinutes();
  const open = mins >= OPEN_MIN && mins < CLOSE_MIN;

  // "Closing soon" is the useful signal in the last hour — it changes whether
  // someone sets off now or tomorrow.
  const closingSoon = open && CLOSE_MIN - mins <= 60;

  /*
   * Split into a state word and a qualifier so the UI can weight them
   * differently — the state is the answer, the qualifier is the detail.
   * `label` stays available as a single flat string for aria and compact spots.
   */
  let state;
  let detail;

  if (closingSoon) {
    state = "Closing soon";
    detail = `${CLOSE_MIN - mins} min left`;
  } else if (open) {
    state = "Open";
    detail = "until 11 PM";
  } else {
    state = "Closed";
    detail = mins < OPEN_MIN ? "opens 9:30 AM" : "opens 9:30 AM tomorrow";
  }

  return { open, closingSoon, state, detail, label: `${state} · ${detail}`, minutes: mins };
}
