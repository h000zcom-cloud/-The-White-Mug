import { Link } from "react-router-dom";
import { MugMark } from "@/components/brand/Logo";

export default function NotFoundPage() {
  return (
    <main id="main" className="mx-auto flex max-w-prose flex-col items-center px-6 py-32 text-center lg:py-44">
      <MugMark className="h-12 w-12 text-espresso/30" />
      <p className="eyebrow mt-8">Page not found</p>
      <h1 className="mt-4 text-step-3 font-normal tracking-[-0.015em] text-espresso">
        This one&rsquo;s off the menu.
      </h1>
      <p className="mt-4 text-step-0 text-pretty text-mutedwarm">
        The page you were after doesn&rsquo;t exist. The coffee still does.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[48px] items-center rounded-full bg-espresso px-6 text-step--1 font-semibold text-cream transition-colors hover:bg-espresso2"
        >
          Back to home
        </Link>
        <Link
          to="/menu"
          className="inline-flex min-h-[48px] items-center rounded-full border border-espresso/20 px-6 text-step--1 font-medium text-espresso transition-colors hover:border-espresso hover:bg-white"
        >
          See the menu
        </Link>
      </div>
    </main>
  );
}
