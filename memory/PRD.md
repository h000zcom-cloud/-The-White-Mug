# The White Mug – Cafe · PRD

## Overview
Award-worthy marketing website for **The White Mug**, a specialty coffee house and
100% pure vegetarian cafe in Mahatma Nagar, College Road, Nashik.

Design direction: **Warm Minimalist Luxe, editorial, cinematic**, framer-motion
scroll reveals, Lenis smooth-scrolling, AI-generated photography, kinetic
masked line-by-line hero reveal, numbered manifesto, editorial marquee.

## Stack
- **Frontend**: React 19, Tailwind CSS 3, framer-motion, react-fast-marquee, Lenis
- **Backend**: FastAPI + MongoDB (Motor) — currently serves AI-generated cafe images
  from `/api/images/{slug}.png` and exposes `/api/health`, `/api/images/manifest`
- **Images**: 16 hero-quality photographs generated with **Gemini Nano Banana**
  (`gemini-3.1-flash-image-preview`) via the Emergent LLM key. Cached to
  `/app/backend/static/images/`. Regenerate with `python /app/backend/generate_images.py`.

## Sections implemented (single-page)
1. Sticky glass **Nav** (logo, links, Pure Veg badge, Call, Reserve CTA, mobile drawer)
2. **Hero** — kinetic word-by-word masked reveal, parallax gallery (Spanish Latte
   arched frame, sourdough, croissant), floating Signature card, badges, CTAs
3. **Editorial Marquee** — slow single marquee (Playfair italic)
4. **Story & Craft** — 4 numbered manifesto chapters + sticky barista image
5. **Signature Brews** — bento grid (5 picks, hover zoom, dark gradient overlays)
6. **Interactive Menu** — 10 category tabs + live search, ~75 items across 9 categories,
   image thumbs on top picks, add-ons banner (flavours ₹29, alt milks ₹89)
7. **Ambiance** — 4 pillars (Coffee Bar, Sourdough, Pure Veg, Work & Chill)
8. **Reviews** — 3 static Google reviews slider with autoplay + arrow nav + dots
9. **Location & Contact** — Google Maps embed, address card, timings, phone,
   dark Reservation card + WhatsApp deep-link modal
10. **Footer** — big wordmark, quick links, contact, Instagram, credit line

## Reservation flow (per user choice)
Modal collects Name, Phone, Date, Time, Guests → opens WhatsApp deep link
(`https://wa.me/919561166185`) with a prefilled message. **No backend storage.**

## Reviews (per user choice)
3 static Google reviews from the brief — no DB.

## Test IDs
All interactive/critical elements have `data-testid` — see `/app/frontend/src/lib/testIds.js`.

## What's next / backlog
- P1: Real Instagram feed integration (currently static link)
- P2: Reservation → MongoDB persistence + admin dashboard
- P2: Live Google Reviews via Places API
- P2: Multi-language (English/Marathi/Hindi)

## Change log
- **2026-08-01** — MVP complete: kinetic hero, story, marquee, signature bento,
  filterable menu, ambiance, reviews slider, location + WhatsApp reservation,
  footer. AI-generated cafe photography (16 images) cached from Gemini Nano Banana.
