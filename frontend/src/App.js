import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "@/App.css";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ReservationDialog from "@/components/site/ReservationDialog";
import MobileDock from "@/components/site/MobileDock";
import ChatAgent from "@/components/site/ChatAgent";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { ReserveCtx } from "@/lib/reserve-context";
import { Toaster } from "@/components/ui/sonner";
import useOpeningSequence from "@/hooks/useOpeningSequence";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import { pageTransition } from "@/lib/motion";

/**
 * Restores expected browser behaviour across route changes: a new page starts at
 * the top, but a link carrying a hash still lands on its section.
 *
 * The scroll is deferred by two frames so it happens after the incoming page has
 * committed — otherwise we'd scroll the outgoing page on its way out.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Route through the smooth-scroll instance when one exists, otherwise native
    // scrolling. Mixing the two makes them fight over the scroll position.
    const lenis = window.__lenis;

    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (!el) return;
          if (lenis) lenis.scrollTo(el, { offset: -80 });
          else el.scrollIntoView({ block: "start" });
        }),
      );
      return;
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

/**
 * Cross-fades between routes so navigating to the menu feels like one continuous
 * surface rather than a document reload.
 *
 * `mode="wait"` lets the outgoing page finish before the incoming one starts,
 * which avoids the two pages briefly overlapping and doubling the page height.
 * The exit is kept to 200ms — any longer and navigation feels sluggish, which is
 * the opposite of what a transition is for.
 */
function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  if (reduced) return routes;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
      >
        {routes}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [reserve, setReserve] = useState({ open: false, item: null });

  // Dismisses the inline opening sequence from index.html once type and the
  // first render have settled.
  useOpeningSequence();

  // Eased wheel scrolling, desktop pointers only. Loaded on demand.
  useSmoothScroll();

  const openReserve = useCallback((item = null) => setReserve({ open: true, item }), []);
  const closeReserve = useCallback(() => setReserve({ open: false, item: null }), []);

  return (
    <ReserveCtx.Provider value={openReserve}>
      <ScrollManager />

      {/* First stop in the tab order, so keyboard users can bypass the nav. */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Compositor-driven read of scroll depth. Decorative. */}
      <div className="scroll-progress" aria-hidden="true" />

      <div className="App grain relative min-h-screen bg-cream text-espresso">
        <Nav onReserveClick={() => openReserve()} />

        {/*
          No bottom padding here. Clearance for the fixed mobile dock lives
          inside the footer instead — applied on this wrapper it produced a strip
          of bare cream below the dark footer, which read as a gap at the end of
          the page.
        */}
        <div>
          <AnimatedRoutes />
          <Footer />
        </div>

        <MobileDock onReserveClick={() => openReserve()} />
        <ReservationDialog open={reserve.open} onClose={closeReserve} prefillItem={reserve.item} />
        <ChatAgent />
        <Toaster />
      </div>
    </ReserveCtx.Provider>
  );
}
