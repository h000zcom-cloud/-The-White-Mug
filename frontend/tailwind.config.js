/** @type {import('tailwindcss').Config} */

/**
 * Palette drawn from the actual storefront rather than a generic "cafe brown".
 *
 * The shop reads white and airy: a white sign with near-black lettering, a pale
 * blue-grey facade, warm amber pendant light spilling through glass, and a lot
 * of greenery. The previous palette was espresso-brown led, which is a heavier,
 * darker room than the one that exists.
 *
 * Token names are unchanged so every existing component picks up the new values
 * without edits.
 */
const palette = {
  // Paper. The sign white, very slightly warm so it doesn't read clinical.
  cream: "#FBFAF8",
  cream2: "#F1EFEA",

  // Lettering. Near-black, neutral rather than brown.
  espresso: "#191714",
  espresso2: "#2A2622",

  // The pendant lights behind the glass. This is the one warm accent.
  caramel: "#C1873F",
  caramel2: "#D9A44E",

  ivory: "#FFFFFF",
  borderwarm: "#E7E3DB",

  // Body copy. 6.5:1 on paper, so it clears AA at small sizes.
  mutedwarm: "#5F5A54",

  // The plants, and the leaf in the logo mark.
  vegetal: "#47694E",

  // The building facade. Gives cool sections to alternate against the warm ones.
  mist: "#E6EBED",
  mist2: "#D3DCDF",
};

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ...palette,

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted-hsl))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      fontFamily: {
        // The sign is a wide-tracked geometric sans, not a display serif.
        display: ['"Jost"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        // Kept for the editorial pull-quotes, now used sparingly.
        editorial: ['"Playfair Display"', "Georgia", "serif"],
      },

      /**
       * Fluid type. One clamp per step means headings scale continuously with
       * the viewport instead of jumping at breakpoints, which is what makes a
       * layout feel resolved at 380px and 1440px alike.
       */
      fontSize: {
        "step--1": ["clamp(0.80rem, 0.78rem + 0.10vw, 0.86rem)", { lineHeight: "1.5" }],
        "step-0": ["clamp(0.94rem, 0.90rem + 0.18vw, 1.05rem)", { lineHeight: "1.6" }],
        "step-1": ["clamp(1.13rem, 1.05rem + 0.35vw, 1.38rem)", { lineHeight: "1.45" }],
        "step-2": ["clamp(1.38rem, 1.22rem + 0.70vw, 1.95rem)", { lineHeight: "1.25" }],
        "step-3": ["clamp(1.70rem, 1.40rem + 1.30vw, 2.85rem)", { lineHeight: "1.15" }],
        "step-4": ["clamp(2.05rem, 1.55rem + 2.20vw, 4.10rem)", { lineHeight: "1.05" }],
        "step-5": ["clamp(2.45rem, 1.60rem + 3.70vw, 5.90rem)", { lineHeight: "0.98" }],
      },

      letterSpacing: {
        // The signage tracking. Used for the wordmark and eyebrow labels.
        sign: "0.30em",
        wide: "0.14em",
      },

      maxWidth: {
        shell: "1400px",
        /*
         * Wider than the editorial shell so the menu grid gets real breathing
         * room, but not so wide that four columns stretch into slabs. 1560 keeps
         * each card in the 330-360px range on a large display, which is where
         * the photograph and two lines of text sit comfortably.
         */
        wide: "1560px",
        prose: "68ch",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },

      boxShadow: {
        lift: "0 1px 2px -1px rgba(25,23,20,0.10), 0 12px 32px -18px rgba(25,23,20,0.22)",
        "lift-lg": "0 2px 4px -2px rgba(25,23,20,0.10), 0 32px 64px -32px rgba(25,23,20,0.30)",
      },

      transitionTimingFunction: {
        // A single easing curve used site-wide keeps motion feeling like one hand.
        brand: "cubic-bezier(0.22, 0.75, 0.18, 1)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "none" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rise-in": "rise-in 0.7s cubic-bezier(0.22,0.75,0.18,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
