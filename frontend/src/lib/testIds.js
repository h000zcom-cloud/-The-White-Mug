/**
 * Test IDs used across the site. Keeping them in one place keeps
 * playwright/testing agents reliable.
 */
export const TID = {
  // Nav
  nav: "site-nav",
  navLogo: "nav-logo",
  navLink: (id) => `nav-link-${id}`,
  navReserve: "nav-reserve-btn",
  navCall: "nav-call-btn",
  navMobileToggle: "nav-mobile-toggle",
  navMobileDrawer: "nav-mobile-drawer",

  // Hero
  hero: "hero-section",
  heroCtaMenu: "hero-cta-menu",
  heroCtaDirections: "hero-cta-directions",

  // Story
  story: "story-section",
  storyChapter: (n) => `story-chapter-${n}`,

  // Menu
  menu: "menu-section",
  menuSearch: "menu-search-input",
  menuTab: (id) => `menu-tab-${id}`,
  menuItem: (name) => `menu-item-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,

  // Signature
  signature: "signature-section",

  // Ambiance
  ambiance: "ambiance-section",
  ambianceCard: (id) => `ambiance-card-${id}`,

  // Reviews
  reviews: "reviews-section",
  reviewCard: (n) => `review-card-${n}`,

  // Location
  location: "location-section",
  locationDirections: "location-directions-btn",
  locationCall: "location-call-btn",
  locationInsta: "location-instagram-link",

  // Reservation
  reserveOpen: "reserve-open-btn",
  reserveDialog: "reserve-dialog",
  reserveName: "reserve-input-name",
  reservePhone: "reserve-input-phone",
  reserveDate: "reserve-input-date",
  reserveTime: "reserve-input-time",
  reserveGuests: "reserve-input-guests",
  reserveSubmit: "reserve-submit-btn",

  // Footer
  footer: "site-footer",
  footerInsta: "footer-instagram-link",
};
