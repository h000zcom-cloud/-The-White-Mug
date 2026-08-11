/**
 * In-page scroll helper.
 *
 * Kept at this path so existing imports stay valid. The smooth-scroll instance
 * itself is set up by `useSmoothScroll`, which only engages on desktop pointers.
 */

/** Retained as a no-op; smooth scrolling is initialised in useSmoothScroll. */
export default function useLenis() {}

/**
 * Scroll an element into view, accounting for the fixed header.
 *
 * Routes through the smooth-scroll instance when one exists, so an anchor jump
 * uses the same easing as a wheel scroll instead of the two fighting each other.
 * Falls back to native behaviour, where `scroll-padding-top` on <html> supplies
 * the header offset.
 */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) {
    window.location.hash = `#${id}`;
    return;
  }

  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "64",
    10,
  );

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -(headerH + 16), duration: 1 });
  } else {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  // Move focus as well as the viewport, for keyboard and screen-reader users.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
