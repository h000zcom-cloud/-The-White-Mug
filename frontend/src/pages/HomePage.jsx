import Hero from "@/components/site/Hero";
import EditorialMarquee from "@/components/site/Marquee";
import ChefSpecials from "@/components/site/ChefSpecials";
import BrewQuiz from "@/components/site/BrewQuiz";
import Story from "@/components/site/Story";
import MenuTeaser from "@/components/site/MenuTeaser";
import AmbianceGallery from "@/components/site/AmbianceGallery";
import Reviews from "@/components/site/Reviews";
import Location from "@/components/site/Location";

/**
 * The home page sells the room; the menu page does the reference work.
 *
 * The full 75-item menu used to live inline here, which made the landing page
 * heavy and buried the story sections underneath a wall of cards. It now lives
 * at /menu, and the home page carries a teaser that routes there.
 */
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <EditorialMarquee />
      <ChefSpecials />
      <MenuTeaser />
      <BrewQuiz />
      <Story />
      <AmbianceGallery />
      <Reviews />
      <Location />
    </main>
  );
}
