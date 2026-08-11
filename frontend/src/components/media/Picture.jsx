import { useState } from "react";
import manifest from "@/data/imageManifest.json";
import { cn } from "@/lib/utils";

/**
 * Responsive, layout-stable image.
 *
 * Everything it needs comes from the build-time manifest produced by
 * `npm run images`, which means:
 *
 *  - AVIF first, WebP second, JPEG last, so modern browsers get the ~25 KB
 *    encode and old ones still get a picture.
 *  - Intrinsic width/height are always emitted, so the browser reserves the
 *    right box before the bytes land. This is what keeps CLS at zero, and it
 *    is the thing hand-written <img> tags almost always miss.
 *  - A 20px blurred placeholder is inlined as a data URI and cross-faded out
 *    on decode, so a slow tile reads as a photo arriving rather than a hole.
 *
 * `sizes` matters as much as `srcset`: without it the browser assumes the image
 * fills the viewport and happily downloads the 1200px rung for a 96px avatar.
 * Callers should pass the CSS width the image actually occupies.
 */
export default function Picture({
  slug,
  alt,
  sizes = "100vw",
  className,
  imgClassName,
  priority = false,
  aspect,
  objectPosition,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const meta = manifest[slug];

  if (!meta) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<Picture slug="${slug}"> has no manifest entry. Run: npm run images`);
    }
    return null;
  }

  const srcset = (format) =>
    meta.widths.map((w) => `${meta[format][w]} ${w}w`).join(", ");

  return (
    <span
      className={cn("relative block overflow-hidden isolate", className)}
      style={{
        // Reserve the box up front. `aspect` lets a caller crop to a different
        // ratio than the source (e.g. a 16/9 band from a 4/3 photo).
        aspectRatio: aspect ?? meta.aspectRatio,
        backgroundColor: meta.color,
      }}
    >
      {/* Placeholder sits underneath and fades out once the real image paints. */}
      <img
        src={meta.blur}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700 motion-reduce:transition-none",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{ objectPosition }}
      />

      <picture>
        <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
        <img
          src={meta.fallback}
          alt={alt}
          width={meta.width}
          height={meta.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={cn(
            "relative h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          style={{ objectPosition }}
          {...rest}
        />
      </picture>
    </span>
  );
}

/** Intrinsic aspect ratio for a slug, for callers doing their own layout. */
export const ratioOf = (slug) => manifest[slug]?.aspectRatio ?? 1;

/** Average colour for a slug, useful as a section backdrop tint. */
export const colorOf = (slug) => manifest[slug]?.color ?? "#EDE4D9";
