/**
 * Compose a URL to a cached AI-generated image served by the
 * FastAPI backend. Images live at /api/images/{slug}.png.
 */
const BACKEND = process.env.REACT_APP_BACKEND_URL || "";

export const img = (slug) => `${BACKEND}/api/images/${slug}.png`;
