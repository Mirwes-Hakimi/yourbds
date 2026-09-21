import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firestore";
import { getAttribution } from "../lib/attribution";
import SEOHead from "../components/SEOHead";
import infoStyles from "../styles/InfoPage.module.css";

// ─────────────────────────────────────────────────────────────
// GoRedirect — shown at /go/:slug. Logs that a visitor was sent to a
// partner site (e.g. Bay Pass Driving School's online course), then
// forwards them there.
//
// This exists because the partner site has no referral/tracking field
// of its own to update — we can't make their backend recognize
// anything, so this only gives BEST DRIVING SCHOOL visibility into how
// many customers we're sending them (via the outboundClicks Firestore
// collection), not something the partner receives automatically.
// ─────────────────────────────────────────────────────────────

// Add a new entry here for each partner link that should be tracked —
// visiting /go/<key> logs a click and redirects to `url`.
const DESTINATIONS = {
  "teen-online-course": {
    label: "Bay Pass Driving School — Teen Online Driver's Ed Course",
    url: "https://www.baypassdrivingschool.com/ed-course.html",
  },
  "adult-online-course": {
    label: "Bay Pass Driving School — Adult Online Driver's Ed Course",
    url: "https://www.baypassdrivingschool.com/california-online-driver-test.html?quiz_parent_id=21",
  },
};

export default function GoRedirect() {
  const { slug } = useParams();
  const destination = DESTINATIONS[slug];
  const [status, setStatus] = useState("redirecting"); // "redirecting" | "not-found"

  useEffect(() => {
    if (!destination) {
      setStatus("not-found");
      return;
    }

    let cancelled = false;

    const logAndRedirect = async () => {
      try {
        await addDoc(collection(db, "outboundClicks"), {
          slug,
          label: destination.label,
          url: destination.url,
          ...getAttribution(),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        // Logging is best-effort — never let a failed log block the
        // actual redirect the visitor is waiting for.
        console.error("Failed to log outbound click:", err);
      }
      if (!cancelled) {
        window.location.href = destination.url;
      }
    };

    logAndRedirect();
    return () => {
      cancelled = true;
    };
  }, [slug, destination]);

  if (status === "not-found") {
    return (
      <div className={infoStyles.page}>
        <SEOHead
          title="Page Not Found | Best Driving School"
          description="This link is no longer valid."
          path={`/go/${slug}`}
          noindex
        />
        <section className={infoStyles.hero}>
          <h1 className={infoStyles.heroHeading}>Link Not Found</h1>
          <p className={infoStyles.heroSub}>
            This redirect link doesn't exist. Head back to the homepage to keep browsing.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className={infoStyles.page}>
      <SEOHead
        title="Redirecting… | Best Driving School"
        description="Redirecting you to our partner's online course."
        path={`/go/${slug}`}
        noindex
      />
      <section className={infoStyles.hero}>
        <h1 className={infoStyles.heroHeading}>Redirecting…</h1>
        <p className={infoStyles.heroSub}>
          Taking you to {destination.label}. If nothing happens,{" "}
          <a href={destination.url}>click here</a>.
        </p>
      </section>
    </div>
  );
}
