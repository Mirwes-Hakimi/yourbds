// ─────────────────────────────────────────────────────────────
// middleware.js — Vercel Routing Middleware (runs at the edge, before
// the SPA is served). See https://vercel.com/docs/routing-middleware
//
// WHY THIS EXISTS: this is a client-rendered SPA (no server-side
// rendering), so the per-page title/description/canonical/Open Graph
// tags set by src/components/SEOHead.jsx only exist after React mounts
// and runs its useEffect. That's fine for Google (Googlebot executes
// JavaScript), but anything that reads raw HTML WITHOUT running JS —
// Facebook/Twitter/LinkedIn/Slack link-preview crawlers, some SEO
// tools — would otherwise see the homepage's static index.html tags
// for every single page.
//
// This middleware only intervenes for known bot/crawler user agents on
// known public pages, returning a small pre-rendered HTML document with
// the correct tags for that path. Real visitors are untouched — `next()`
// passes them straight through to the normal React app, identical to
// before this file existed.
//
// Keep PAGES below in sync with the title/description props passed to
// <SEOHead> in each src/pages/*.jsx file — this is a duplicate list by
// necessity (middleware can't import React components), not a second
// source of truth to edit independently.
// ─────────────────────────────────────────────────────────────

import { next } from "@vercel/functions";
import { CITY_PAGES } from "./src/data/cityPages.js";

const SITE_URL = "https://www.yourbds.com";
const DEFAULT_IMAGE = `${SITE_URL}/bestDrivingSchoo.png`;

// Only real, public marketing pages — matches public/sitemap.xml.
// Account/transactional pages (login, booking, dashboard, admin) are
// intentionally left out; bots hitting those just get the normal SPA.
const PAGES = {
  "/": {
    title: "Best Driving School | Driving Lessons in the Bay Area & Sacramento, CA",
    description:
      "Behind-the-wheel driving lessons and DMV road test packages in the Bay Area and Sacramento region. Certified instructors, pick-up and drop-off included, pay online or at your session.",
  },
  "/packages": {
    title: "Driving Lesson Packages & Pricing | Best Driving School",
    description:
      "Compare behind-the-wheel training packages, DMV road test packages, and mock test pricing across the Bay Area and Sacramento region. Enter your ZIP code to see pricing near you.",
  },
  "/services": {
    title: "Driving Lessons & DMV Test Services | Best Driving School",
    description:
      "Teen and adult driving lessons, DMV road test preparation, and DMV test car rental across the Bay Area and Sacramento region.",
  },
  "/services/teen-driving-lessons": {
    title: "Teen Driving Lessons | Best Driving School",
    description:
      "Behind-the-wheel driving lessons for teens ages 15½ and up, with certified instructors, in the Bay Area and Sacramento region.",
  },
  "/services/adult-driving-lessons": {
    title: "Adult Driving Lessons | Best Driving School",
    description:
      "Behind-the-wheel driving lessons for adult beginners and drivers returning to the road, with certified instructors, in the Bay Area and Sacramento region.",
  },
  "/services/dmv-test-preparation": {
    title: "DMV Behind-the-Wheel Road Test Prep | Best Driving School",
    description:
      "What the California DMV road test covers, how our DMV package helps you prepare, and how to book a certified vehicle and instructor for test day.",
  },
  "/services/dmv-test-car-rental": {
    title: "DMV Test Car Rental | Best Driving School",
    description:
      "Use our fully insured, DMV-approved training vehicle for your California DMV behind-the-wheel road test — no need to bring your own car.",
  },
  "/locations": {
    title: "Service Areas | Best Driving School",
    description:
      "Best Driving School serves 20+ cities across the Bay Area and Sacramento region, including San Francisco, Oakland, Concord, Walnut Creek, Sacramento, and Folsom.",
  },
  "/new-drivers": {
    title: "New Driver's Guide | Best Driving School",
    description:
      "A step-by-step roadmap for new drivers in California, from getting your learner's permit to holding your driver's license.",
  },
  "/practice": {
    title: "California Permit Test Practice Tips | Best Driving School",
    description:
      "How to prepare for the California DMV written knowledge test, including what's covered and how many questions you need to get right.",
  },
  "/education": {
    title: "Driver Education Tips | Best Driving School",
    description:
      "Essential driving concepts, safety tips, and skills every new driver should know before getting behind the wheel.",
  },
  "/about": {
    title: "About Us | Best Driving School",
    description:
      "Best Driving School provides behind-the-wheel driving lessons and DMV road test packages across the Bay Area and Sacramento region.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Best Driving School",
    description:
      "Answers to common questions about pricing, packages, DMV test preparation, scheduling, rescheduling, and payment at Best Driving School.",
  },
  "/contact": {
    title: "Contact Us | Best Driving School",
    description:
      "Get in touch with Best Driving School — call, email, or send a message. Serving the Bay Area and Sacramento region with pick-up and drop-off driving lessons.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Best Driving School",
    description: "How Best Driving School collects, uses, and protects your personal information.",
  },
};

// City pages are generated from the same data file the React page uses
// (src/data/cityPages.js), so their tags can never drift out of sync.
for (const city of CITY_PAGES) {
  PAGES[`/locations/${city.slug}`] = {
    title: city.title,
    description: city.description,
  };
}

// Matches known crawlers that read raw HTML without executing
// JavaScript — social link-preview bots and some search/SEO tools.
// Googlebot/Bingbot execute JS and don't strictly need this, but
// including them costs nothing and guarantees correct tags either way.
const BOT_USER_AGENT =
  /bot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|pinterest|embedly|quora link preview|w3c_validator|redditbot|skypeuripreview/i;

export const config = {
  // Skip static assets (anything with a file extension, e.g. .js/.css/.png)
  // and let those serve normally — only run on page-like paths.
  matcher: ["/((?!.*\\.).*)"],
};

export default function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_USER_AGENT.test(userAgent)) {
    return next(); // real visitors — no change, normal SPA loads
  }

  const url = new URL(request.url);
  const page = PAGES[url.pathname];
  if (!page) {
    return next(); // not a page we have metadata for — pass through
  }

  const canonicalUrl = `${SITE_URL}${url.pathname}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${page.title}</title>
<meta name="description" content="${page.description}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Best Driving School" />
<meta property="og:title" content="${page.title}" />
<meta property="og:description" content="${page.description}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${DEFAULT_IMAGE}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${page.title}" />
<meta name="twitter:description" content="${page.description}" />
<meta name="twitter:image" content="${DEFAULT_IMAGE}" />
</head>
<body>
<h1>${page.title}</h1>
<p>${page.description}</p>
<p><a href="${canonicalUrl}">${canonicalUrl}</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
