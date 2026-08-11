import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The cup-and-leaf mark from the shopfront sign.
 *
 * Traced from a close-up of the sign, so the details are the real ones:
 *
 *   · the rim is a straight line that overhangs the bowl on both sides
 *   · the bowl is a true semicircle
 *   · the handle is a small ring on the LEFT
 *   · the stem runs from above the rim all the way DOWN to the base of the
 *     bowl, crossing the rim to form a cross inside the cup — this is the
 *     detail that makes the mark recognisable, and it's easy to miss
 *   · the leaf sits on the RIGHT of the stem, tipped up and outward
 *   · a separate saucer line sits below the cup, detached
 *
 * Drawn on a 0–100 grid for precision. Every path carries `pathLength="1"`,
 * which normalises its length to 1 regardless of geometry — that's what lets one
 * `stroke-dasharray: 1` draw-on animation work across all six strokes without
 * measuring any of them in JavaScript.
 */

export const MARK_PATHS = [
  { key: "rim", d: "M16 46H84" },
  { key: "bowl", d: "M22 46a28 28 0 0 0 56 0" },
  { key: "handle", d: "M19.5 55a6.5 6.5 0 1 0-13 0 6.5 6.5 0 1 0 13 0" },
  { key: "stem", d: "M50 12v62" },
  { key: "leaf", d: "M50 41c5-13 14-21 23-24-2 10-10 20-23 24Z", leaf: true },
  { key: "saucer", d: "M22 88H78" },
];

/** The bowl as a closed shape, used to clip the coffee fill. */
export const BOWL_CLIP = "M22 46a28 28 0 0 0 56 0Z";

/**
 * Stroke width is in viewBox units, so it scales with the rendered size. That's
 * faithful to the sign, where the line is roughly 1/50th of the mark's width —
 * but it means a small render needs a proportionally heavier stroke to stay
 * visible. At 32px, the sign-accurate 2.2 works out to 0.7 device pixels and
 * all but disappears. These defaults are tuned for where each variant is used.
 */
export function MugMark({
  className,
  strokeWidth = 4.5,
  draw = false,
  interactive = false,
  ...rest
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn("h-8 w-8 overflow-visible", draw && "mark-draw", className)}
      role="img"
      aria-label="The White Mug"
      {...rest}
    >
      {MARK_PATHS.map(({ d, key, leaf }, i) => (
        <path
          key={key}
          d={d}
          pathLength="1"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            `mark-p${i + 1}`,
            // The leaf is the mark's one accent. On hover it warms to the plant
            // green, tying the logo to the greenery along the shopfront.
            leaf && interactive && "transition-colors duration-500 group-hover:text-vegetal",
          )}
        />
      ))}
    </svg>
  );
}

/**
 * Full lockup: the mark plus the wide-tracked caps of the sign.
 */
export default function Logo({ className, compact = false, draw = false, interactive = true }) {
  return (
    <span className={cn("group inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <MugMark
        draw={draw}
        interactive={interactive}
        className={cn(
          compact ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9",
          "shrink-0 text-espresso",
          interactive && "transition-transform duration-500 ease-brand group-hover:-translate-y-px",
        )}
      />

      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-display font-normal uppercase text-espresso",
            compact
              ? "text-[12px] tracking-[0.16em]"
              : "text-[12.5px] tracking-[0.18em] sm:text-[15px] sm:tracking-[0.26em]",
          )}
        >
          The White Mug
        </span>
        {!compact && (
          <span className="mt-1 hidden text-[9.5px] uppercase tracking-[0.34em] text-mutedwarm sm:block">
            cafe · nashik
          </span>
        )}
      </span>
    </span>
  );
}

/**
 * Decorative steam. Ornamental only, so it's hidden from assistive tech.
 */
export function Steam({ className }) {
  return (
    <svg
      viewBox="0 0 48 18"
      aria-hidden="true"
      className={cn("steam h-5 w-12 text-espresso/30", className)}
    >
      <path pathLength="1" d="M19 16c-2-3 2-5 0-8s1-5 1-5" />
      <path pathLength="1" d="M24 16c-2-3.5 2-5.5 0-9s1-5.5 1-5.5" />
      <path pathLength="1" d="M29 16c-2-3 2-5 0-8s1-5 1-5" />
    </svg>
  );
}

/**
 * The mark, drawing itself the first time it scrolls into view.
 *
 * Uses framer-motion's `pathLength` rather than the CSS `.mark-draw` class
 * because CSS scroll-driven animations still aren't in Safari or Firefox, and
 * this is a deliberate moment rather than a background flourish — it needs to
 * land everywhere. framer-motion is already bundled for the section reveals.
 */
export function DrawOnViewMark({ className, strokeWidth = 3.4 }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="The White Mug"
      className={cn("h-10 w-10 overflow-visible", className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      {MARK_PATHS.map(({ d, key }, i) => (
        <motion.path
          key={key}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { delay: 0.1 + i * 0.11, duration: 0.65, ease: [0.65, 0, 0.35, 1] },
                opacity: { delay: 0.1 + i * 0.11, duration: 0.1 },
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}
