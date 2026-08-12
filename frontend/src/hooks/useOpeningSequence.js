import { useEffect } from "react";

/**
 * Dismisses the inline opening sequence in public/index.html.
 *
 * The loader itself is markup + CSS in the document, so it paints on the first
 * frame and animates without JavaScript. This hook only decides *when* it
 * leaves, which needs three competing constraints balanced:
 *
 *  1. Never flash. On a warm cache the app can mount in 200ms; tearing the
 *     loader down that fast reads as a glitch, not as speed. So there's a floor.
 *  2. Never outstay. Once the app is genuinely ready, get out of the way.
 *  3. Never strand. If fonts hang or a request stalls, leave anyway. A loading
 *     screen that can't exit is worse than no loading screen. (index.html also
 *     carries an independent 7s failsafe in case this bundle never runs at all.)
 *
 * The sequence plays on every page load. Because the site is a single-page app,
 * that means first arrival and hard refreshes only — moving between / and /menu
 * is resolved in the browser and never replays it.
 */

/**
 * Long enough for the whole sequence to land.
 *
 * Timeline: the mark finishes drawing at ~1.8s, the coffee finishes rising at
 * ~2.5s, the ripples fire at 2.25s and 2.45s, and the location line finishes
 * fading in at ~2.8s. A 2.5s floor cut the ending off on a fast connection, so
 * the sequence looked inconsistent — sometimes complete, sometimes clipped.
 *
 * 3.3s lets every beat finish, including the ripple, before the exit begins.
 */
const MIN_VISIBLE_MS = 3300;

/** Hard ceiling regardless of what's still in flight. */
const MAX_VISIBLE_MS = 6500;

/** Matches the tw-wipe exit duration in index.html. */
const EXIT_MS = 820;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useOpeningSequence() {
  useEffect(() => {
    const loader = document.getElementById("tw-loader");
    if (!loader) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const floor = reduced ? 250 : MIN_VISIBLE_MS;

    // Measure from navigation start, not from mount, so a slow bundle doesn't
    // add its parse time on top of the floor.
    const elapsed = performance.now();
    const remaining = Math.max(0, floor - elapsed);

    let cancelled = false;

    /** Resolves when the things that cause visible reflow are settled. */
    const appReady = Promise.all([
      // Web fonts are the big one: swapping Jost in after paint shifts every
      // heading. Waiting for them means the reveal lands on final type.
      document.fonts?.ready ?? Promise.resolve(),
      // One frame after mount, so React has committed the first render.
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    ]);

    const run = async () => {
      await Promise.race([
        Promise.all([appReady, wait(remaining)]),
        wait(Math.max(0, MAX_VISIBLE_MS - elapsed)),
      ]);
      if (cancelled) return;

      loader.classList.add("is-leaving");

      // Let the exit finish, then take the node out of the tree so it can't
      // intercept pointer events or sit in the accessibility tree.
      await wait(reduced ? 220 : EXIT_MS);
      if (!cancelled) loader.remove();
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);
}
