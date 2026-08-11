import { useEffect, useRef, useState } from "react";

/**
 * Reports which section is currently the reader's focus.
 *
 * Drives the highlight in the menu's category rail. Without this the rail is a
 * static list and you have no idea where you are in a 74-item menu; with it the
 * page feels like it's tracking you.
 *
 * IntersectionObserver rather than a scroll listener: the browser does the
 * geometry off the main thread and only calls back when a boundary is actually
 * crossed, instead of firing on every one of hundreds of scroll events.
 *
 * @param ids       section ids to watch, in document order
 * @param offsetTop px of fixed chrome at the top of the viewport
 */
export default function useActiveSection(ids, offsetTop = 140) {
  const [active, setActive] = useState(ids[0] ?? null);
  const ratios = useRef(new Map());

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(`cat-${id}`))
      .filter(Boolean);

    if (!elements.length) return;

    ratios.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace(/^cat-/, "");
          ratios.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        // Pick the most-visible section. When several are equally visible —
        // common with short categories — the first in document order wins, so
        // the highlight moves predictably downward rather than flickering.
        let best = null;
        let bestRatio = 0;
        for (const id of ids) {
          const r = ratios.current.get(id) ?? 0;
          if (r > bestRatio + 0.001) {
            bestRatio = r;
            best = id;
          }
        }

        if (best) setActive(best);
      },
      {
        // Discount the sticky header and control bar so a section only counts as
        // active once it's actually in the readable area.
        rootMargin: `-${offsetTop}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // `ids` is a stable join key so re-filtering the menu re-binds the observer.
  }, [ids.join("|"), offsetTop]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
