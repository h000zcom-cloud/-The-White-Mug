/**
 * One motion vocabulary for the whole site.
 *
 * The previous build hand-rolled easings and durations at every call site, so
 * nothing quite matched anything else — a card settled on one curve, a section
 * on another. Motion reads as "designed" rather than "added" when everything
 * shares a curve and a small set of durations, the same way a type scale beats
 * arbitrary font sizes.
 *
 * Timings are deliberately short. Long animations feel luxurious exactly once,
 * then they feel slow, and a menu is something people use repeatedly.
 */

/** The house curve: quick out of the gate, long settle. Matches ease-brand. */
export const BRAND_EASE = [0.22, 0.75, 0.18, 1];

/** For things leaving. Slightly more abrupt, so exits don't linger. */
export const EXIT_EASE = [0.4, 0, 1, 1];

export const DUR = {
  fast: 0.22,
  base: 0.42,
  slow: 0.68,
  reveal: 0.78,
};

/** Section and card entrances. */
export const riseIn = {
  hidden: { opacity: 0, y: 22 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: BRAND_EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DUR.slow, ease: BRAND_EASE } },
};

/**
 * Parent for staggered lists. `staggerChildren` is small on purpose: with 20+
 * menu cards a 0.1s stagger means the last card arrives two seconds late.
 */
export const stagger = (each = 0.035, delay = 0) => ({
  hidden: {},
  shown: {
    transition: { staggerChildren: each, delayChildren: delay },
  },
});

/** Child of a `stagger` parent. */
export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: BRAND_EASE },
  },
};

/** Shared viewport config so every reveal triggers at the same point. */
export const VIEWPORT = { once: true, margin: "-12% 0px -8% 0px" };

/** Route-level transition. Short — a page change should feel instant, not cinematic. */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease: BRAND_EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: EXIT_EASE } },
};
