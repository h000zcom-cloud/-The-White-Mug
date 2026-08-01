import { useCallback, useState } from "react";
import "@/App.css";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import EditorialMarquee from "@/components/site/Marquee";
import ChefSpecials from "@/components/site/ChefSpecials";
import BrewQuiz from "@/components/site/BrewQuiz";
import Story from "@/components/site/Story";
import MenuSection from "@/components/site/Menu";
import AmbianceGallery from "@/components/site/AmbianceGallery";
import Reviews from "@/components/site/Reviews";
import Location from "@/components/site/Location";
import Footer from "@/components/site/Footer";
import ReservationDialog from "@/components/site/ReservationDialog";
import MobileDock from "@/components/site/MobileDock";
import { ReserveCtx } from "@/lib/reserve-context";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  useLenis();
  const [reserve, setReserve] = useState({ open: false, item: null });
  const [menuTab, setMenuTab] = useState("all");

  // Any child can open the dialog (optionally with a menu item name)
  const openReserve = useCallback((item = null) => {
    setReserve({ open: true, item });
  }, []);
  const closeReserve = useCallback(() => setReserve({ open: false, item: null }), []);

  return (
    <ReserveCtx.Provider value={openReserve}>
      <div className="App relative min-h-screen bg-cream text-espresso grain">
        <Nav onReserveClick={() => openReserve()} />
        <div className="pb-24 lg:pb-0">
          <main>
            <Hero />
            <EditorialMarquee />
            <ChefSpecials />
            <BrewQuiz />
            <Story />
            <MenuSection tab={menuTab} setTab={setMenuTab} />
            <AmbianceGallery />
            <Reviews />
            <Location />
          </main>
          <Footer />
        </div>
        <MobileDock onReserveClick={() => openReserve()} />
        <ReservationDialog open={reserve.open} onClose={closeReserve} prefillItem={reserve.item} />
        <Toaster />
      </div>
    </ReserveCtx.Provider>
  );
}
