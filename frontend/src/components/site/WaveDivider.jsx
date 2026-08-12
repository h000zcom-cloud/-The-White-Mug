import { cn } from "@/lib/utils";

/**
 * A poured-liquid boundary between two sections.
 *
 * Rendered as the first child *inside* the lower section and filled with the
 * colour of the section *above* it. That inverted approach matters: the shape
 * paints the upper colour down over the lower section's top edge, so the wave
 * works even when the section has `overflow: hidden` — which both the reviews
 * band and the footer do. Positioning it above the boundary instead would get
 * clipped away.
 *
 * Two paths: a faint caramel crest slightly out of phase behind the main fill,
 * which reads as the surface of a pour rather than a flat decorative curve.
 *
 * Purely decorative, so it is hidden from assistive technology.
 */
export default function WaveDivider({ from, className, flip = false, accent = true }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 block leading-none",
        flip && "rotate-180",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className="block h-[42px] w-full sm:h-[64px] lg:h-[86px]"
        focusable="false"
      >
        {accent && (
          /* Offset crest, warm and low-opacity, for a hint of depth. */
          <path
            d="M0 0H1440V54C1290 88 1160 30 1010 46 860 62 740 96 580 82 420 68 300 26 150 40 96 45 46 52 0 46Z"
            fill="var(--caramel)"
            fillOpacity="0.16"
          />
        )}
        <path
          d="M0 0H1440V40C1284 78 1152 20 996 38 840 56 726 90 564 74 402 58 282 16 132 32 84 37 40 44 0 38Z"
          fill={from}
        />
      </svg>
    </span>
  );
}
