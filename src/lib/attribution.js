// ─────────────────────────────────────────────────────────────
// attribution.js — captures where a visitor came from (Google Ads,
// ChatGPT/OpenAI ads, Facebook/Meta ads, Yelp ads, organic, etc.) so it
// can be saved on the booking record later, even if they browse several
// pages before actually booking.
//
// Reads two kinds of URL parameters on landing:
//  1. Standard utm_source / utm_medium / utm_campaign — only present if
//     WE put them on the ad's destination URL ourselves.
//  2. Ad-platform click IDs, which each platform appends AUTOMATICALLY to
//     every ad click with no setup needed on our side:
//       - gclid   — Google Ads
//       - fbclid  — Facebook/Instagram (Meta) Ads
//       - ylpcid  — Yelp Ads (see https://docs.developer.yelp.com/docs/conversions-api)
//       - oppref  — OpenAI/ChatGPT Ads (see
//         https://help.openai.com/en/articles/20001409-conversion-measurement)
//
// If utm_source is missing but a platform's click ID is present, we fill
// in a sensible source/medium ourselves (e.g. fbclid -> "facebook") so a
// booking still shows the right source in the admin page even when the ad
// platform's own URL didn't carry a utm_source tag.
//
// Everything is remembered in localStorage for 30 days (matching the
// lifetime of these platforms' own first-party attribution cookies).
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "bds_attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Click-ID params that get a source/medium filled in automatically when
// utm_source isn't already set. Order matters only if more than one
// somehow appears on the same URL (shouldn't happen in practice).
const CLICK_ID_SOURCES = [
  { param: "gclid", source: "google", medium: "cpc" },
  { param: "fbclid", source: "facebook", medium: "paid_social" },
  { param: "ylpcid", source: "yelp", medium: "cpc" },
];

// Call once when the app loads. If the current URL has any tracking
// params, they become the new stored attribution (last-touch) —
// otherwise, whatever was already stored is left alone so navigating
// to a second page doesn't erase it.
export function captureAttributionFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    let source = params.get("utm_source");
    let medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const oppref = params.get("oppref");
    const gclid = params.get("gclid");
    const fbclid = params.get("fbclid");
    const ylpcid = params.get("ylpcid");

    // Fill in source/medium from whichever platform's click ID showed up,
    // but only if the URL didn't already say utm_source itself — an
    // explicit utm_source always wins.
    if (!source) {
      const match = CLICK_ID_SOURCES.find(({ param }) => params.get(param));
      if (match) {
        source = match.source;
        medium = medium || match.medium;
      }
    }

    if (!source && !medium && !campaign && !oppref && !gclid && !fbclid && !ylpcid) {
      return; // nothing new in this URL — keep whatever's already stored
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        source: source || null,
        medium: medium || null,
        campaign: campaign || null,
        oppref: oppref || null,
        // Click IDs are kept as-is (not just folded into source/medium) in
        // case we later add each platform's server-side Conversions API,
        // which needs the exact original ID to match a conversion back to
        // the ad click that caused it.
        gclid: gclid || null,
        fbclid: fbclid || null,
        ylpcid: ylpcid || null,
        capturedAt: Date.now(),
      })
    );
  } catch (err) {
    // localStorage can throw in private-browsing/blocked-storage cases —
    // attribution is a nice-to-have, never worth breaking the site over.
    console.error("Failed to capture attribution:", err);
  }
}

const EMPTY_ATTRIBUTION = {
  source: null,
  medium: null,
  campaign: null,
  oppref: null,
  gclid: null,
  fbclid: null,
  ylpcid: null,
};

// Call when a booking (or any other conversion) happens, to get the
// fields to save alongside it. Returns nulls if nothing was ever
// captured, or if the stored value is older than MAX_AGE_MS.
export function getAttribution() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_ATTRIBUTION;

    const stored = JSON.parse(raw);
    if (Date.now() - stored.capturedAt > MAX_AGE_MS) {
      return EMPTY_ATTRIBUTION;
    }

    return {
      source: stored.source,
      medium: stored.medium,
      campaign: stored.campaign,
      oppref: stored.oppref,
      gclid: stored.gclid ?? null,
      fbclid: stored.fbclid ?? null,
      ylpcid: stored.ylpcid ?? null,
    };
  } catch (err) {
    console.error("Failed to read attribution:", err);
    return EMPTY_ATTRIBUTION;
  }
}
