import { useEffect } from "react";

/**
 * Eased wheel scrolling on desktop.
 *
 * Smooth scrolling gets a bad reputation because it's usually applied to
 * everything, and that's where it does damage. This is deliberately narrow:
 *
 *  · Desktop pointers only. A mouse wheel moves in coarse, notched jumps, so
 *    interpolating between them genuinely helps. A touchscreen already has
 *    excellent native momentum tuned by the OS, and overriding it produces the
 *    laggy, rubbery feel people associate with "smooth scroll" libraries. Touch
 *    is left completely alone.
 *  · Off when the visitor asks for reduced motion.
 *  · Short. A 0.9s ease reads as polish; the 1.15s the earlier build used read
 *    as syrup, and made find-in-page and keyboard paging feel broken.
 *  · Disabled while a modal is open, so the page behind a dialog can't drift.
 *
 * Loaded on demand rather than bundled, so the ~3 kB never reaches the phones
 * that won't use it.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wideEnough = window.innerWidth >= 1024;

    if (reduced || !finePointer || !wideEnough) return;

    let lenis;
    let rafId;
    let cancelled = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;

        lenis = new Lenis({
          duration: 0.9,
          // Long, gentle tail. Reaches ~99% quickly then settles, so it feels
          // responsive rather than floaty.
          easing: (t) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          // The important one: do not touch touch scrolling.
          syncTouch: false,
          touchMultiplier: 1,
          wheelMultiplier: 1,
        });

        // Exposed so scrollToId and anchor clicks route through the same
        // instance instead of fighting it with native scrollIntoView.
        window.__lenis = lenis;

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {
        /* Smooth scrolling is a nicety; native scrolling already works. */
      });

    /**
     * A native <dialog> makes the background inert to clicks but not to wheel
     * events, so pause the instance whenever one is open.
     */
    const observer = new MutationObserver(() => {
      if (!lenis) return;
      const modalOpen = document.querySelector("dialog[open]");
      if (modalOpen) lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["open"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        delete window.__lenis;
      }
    };
  }, []);
}
