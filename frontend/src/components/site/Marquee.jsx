import Marquee from "react-fast-marquee";

const ITEMS = [
  "Artisanal Coffee",
  "Fresh Sourdough",
  "100% Pure Veg",
  "Single Origin",
  "Slow Brewed",
  "Nashik · Mahatma Nagar",
  "Warm Third Space",
  "Baked Fresh Daily",
];

export default function EditorialMarquee() {
  return (
    <section
      id="marquee"
      aria-hidden="true"
      className="relative marquee-fade border-y border-borderwarm bg-cream py-8"
    >
      <Marquee gradient={false} speed={22} pauseOnHover>
        {ITEMS.concat(ITEMS).map((t, i) => (
          <span
            key={i}
            className="mx-10 font-serif-display italic text-[7vw] sm:text-[64px] leading-none text-espresso/90"
          >
            {t}
            <span className="mx-10 text-caramel not-italic font-sans font-normal">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
