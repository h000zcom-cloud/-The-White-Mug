import { cn } from "@/lib/utils";

/**
 * The green square-and-dot vegetarian symbol.
 *
 * This is the mark mandated on packaged food in India, so it's the one Indian
 * customers actually read — recognised instantly and without translation, which
 * a generic leaf icon is not. Worth using consistently given a fully vegetarian
 * kitchen is one of the cafe's main selling points.
 *
 * `tone` switches to the light variant for dark surfaces, where the standard
 * green on near-black falls below a readable contrast ratio.
 */
export default function VegMark({ className, tone = "default" }) {
  const light = tone === "light";

  return (
    <span
      className={cn(
        "grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border",
        light ? "border-[#8FBF9A] bg-transparent" : "border-vegetal bg-white/95",
        className,
      )}
      title="Pure vegetarian"
    >
      <span className="sr-only">Pure vegetarian</span>
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          light ? "bg-[#8FBF9A]" : "bg-vegetal",
        )}
      />
    </span>
  );
}
