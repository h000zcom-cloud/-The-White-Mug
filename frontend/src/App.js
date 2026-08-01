import { useState } from "react";
import "@/App.css";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import EditorialMarquee from "@/components/site/Marquee";
import Story from "@/components/site/Story";
import SignatureBrews from "@/components/site/SignatureBrews";
import MenuSection from "@/components/site/Menu";
import Ambiance from "@/components/site/Ambiance";
import Reviews from "@/components/site/Reviews";
import Location from "@/components/site/Location";
import Footer from "@/components/site/Footer";
import ReservationDialog from "@/components/site/ReservationDialog";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const [reserveOpen, setReserveOpen] = useState(false);
  useLenis();

  return (
    <div className="App relative min-h-screen bg-cream text-espresso grain">
      <Nav onReserveClick={() => setReserveOpen(true)} />
      <main>
        <Hero />
        <EditorialMarquee />
        <Story />
        <SignatureBrews />
        <MenuSection />
        <Ambiance />
        <Reviews />
        <Location onReserveClick={() => setReserveOpen(true)} />
      </main>
      <Footer />
      <ReservationDialog open={reserveOpen} onClose={() => setReserveOpen(false)} />
      <Toaster />
    </div>
  );
}
