// Shared site-wide constants used by more than one page — single source of
// truth so a number/address/URL never drifts out of sync between pages.
// This file is also where SEO tags (SEOHead.jsx) and structured data
// (lib/structuredData.js) pull their business facts from — update the
// business here, not in individual page files.

export const SCHOOL_PHONE = "(510) 362-0808";
export const SCHOOL_PHONE_TEL = "+15103620808";

export const SCHOOL_ADDRESS = "966 W Winton Ave Ste B, Hayward, CA 94545";

// ─────────────────────────────────────────────────────────────
// SITE_URL — the one place the production domain is defined. Every
// canonical link, sitemap entry, and Open Graph URL derives from this,
// so switching from the current Vercel URL to www.yourbds.com later is
// a one-line change here (plus setting VITE_SITE_URL in Vercel if you
// want a non-default value for a specific deploy).
//
// - Local dev (`npm run dev`)      -> http://localhost:5173
// - Any build (preview or prod)    -> https://www.yourbds.com
//   unless VITE_SITE_URL overrides it (e.g. to point a preview
//   deploy's canonical tags at the Vercel preview URL for testing).
// ─────────────────────────────────────────────────────────────
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (import.meta.env.DEV ? "http://localhost:5173" : "https://www.yourbds.com");

// ─────────────────────────────────────────────────────────────
// Structured business info — used to build LocalBusiness/Organization
// JSON-LD (see lib/structuredData.js) and the footer. Fields marked
// TODO are left blank rather than guessed — fill in when you have the
// real value, don't invent one.
// ─────────────────────────────────────────────────────────────
export const BUSINESS = {
  name: "Best Driving School",
  legalName: "Best Driving School LLC", // confirmed via Stripe account registration
  phone: SCHOOL_PHONE,
  phoneTel: SCHOOL_PHONE_TEL,
  email: "info@yourbds.com",
  streetAddress: "966 W Winton Ave Ste B",
  addressLocality: "Hayward",
  addressRegion: "CA",
  postalCode: "94545",
  addressCountry: "US",
  url: SITE_URL,
  logo: `${SITE_URL}/best-logo.png`,
  // Cities actually served today — kept in sync with the packages data
  // in src/pages/Packages.jsx (SERVED_CITIES).
  serviceAreas: [
    "San Francisco", "Daly City", "Livermore", "Pleasanton", "Dublin",
    "San Ramon", "Danville", "Alamo", "Walnut Creek", "Pleasant Hill",
    "Concord", "Pittsburg", "Antioch", "Brentwood", "Oakland",
    "Hayward", "Fremont",
    "San Leandro", "Castro Valley", "Union City", "Newark", "Alameda", "Berkeley",
    "Emeryville", "Richmond", "El Cerrito", "Martinez", "Lafayette", "Orinda",
    "Oakley", "Corte Madera", "Vallejo", "Fairfield",
    "Sacramento", "Folsom", "Elk Grove", "Roseville", "Rancho Cordova",
    "Citrus Heights", "Rocklin",
  ],
  // TODO: business hours aren't in the codebase anywhere yet — add the
  // real hours here once confirmed (used for LocalBusiness openingHours
  // structured data, which currently omits this field rather than guess).
  hours: null,
  // Used in the footer and Organization "sameAs" structured data.
  socialProfiles: [
    { label: "Instagram", url: "https://www.instagram.com/yourbestdrivingschool/" },
    { label: "Facebook", url: "https://www.facebook.com/people/Best-Driving-School/61591633250750/" },
  ],
};
