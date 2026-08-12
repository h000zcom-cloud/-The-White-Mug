import { useEffect } from "react";

const SITE = "https://the-white-mug.vercel.app";

/**
 * Sets per-page title, description and canonical URL.
 *
 * A single-page app serves one index.html for every route, so without this both
 * `/` and `/menu` share the home page's title and description. Search engines
 * then have nothing to distinguish them, and the menu page — the one most likely
 * to be searched for, since people look for "the white mug nashik menu" — ranks
 * on generic copy.
 *
 * Google renders JavaScript, so tags applied on mount are picked up. Social
 * scrapers mostly do not, which is why Open Graph tags stay in index.html: a
 * shared link previews as the cafe either way, which is the right fallback.
 *
 * Deliberately not react-helmet. Two effects and a cleanup do the same job
 * without another dependency.
 */
export default function useDocumentMeta({ title, description, path }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const setMeta = (name, content) => {
      if (!content) return null;
      let el = document.querySelector(`meta[name="${name}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      const previous = el.getAttribute("content");
      el.setAttribute("content", content);
      return () => {
        if (created) el.remove();
        else if (previous !== null) el.setAttribute("content", previous);
      };
    };

    const restoreDescription = setMeta("description", description);

    let canonicalRestore = null;
    if (path) {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) {
        const previous = link.getAttribute("href");
        link.setAttribute("href", `${SITE}${path}`);
        canonicalRestore = () => link.setAttribute("href", previous);
      }
    }

    return () => {
      document.title = previousTitle;
      restoreDescription?.();
      canonicalRestore?.();
    };
  }, [title, description, path]);
}
