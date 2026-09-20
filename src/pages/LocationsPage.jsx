import { Link } from "react-router-dom";
import styles from "../styles/InfoPage.module.css";
import { BUSINESS } from "../siteConfig";
import SEOHead from "../components/SEOHead";
import { getCityPageByName } from "../data/cityPages";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";

// Locations hub — shown at /locations. Lists real service-area cities
// from siteConfig.js (kept in sync with Packages.jsx's SERVED_CITIES).
// Cities that have a dedicated page (src/data/cityPages.js) get a card
// that links to it; the rest stay as plain cards. A city only gets its
// own page once it has genuinely unique, real local content — never the
// same text with the city name swapped.
export default function LocationsPage() {
  return (
    <div className={styles.page}>
      <SEOHead
        title="Service Areas | Best Driving School"
        description="Best Driving School serves 20+ cities across the Bay Area and Sacramento region, including San Francisco, Oakland, Concord, Walnut Creek, Sacramento, and Folsom."
        path="/locations"
        structuredData={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/locations" },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Service Areas</p>
        <h1 className={styles.heroHeading}>
          Where We <span>Serve</span>
        </h1>
        <p className={styles.heroSub}>
          We're based in Hayward and serve 20+ cities across the Bay Area and Sacramento
          region. Enter your ZIP code on the Packages page to confirm pricing for your area.
        </p>
        <Link to="/packages" className={styles.heroBtn}>Check Pricing by ZIP Code</Link>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <h2 className={styles.sectionHeading}>Cities We Serve</h2>
        <div className={styles.grid}>
          {BUSINESS.serviceAreas.map((city) => {
            const page = getCityPageByName(city);
            const card = (
              <>
                <p className={styles.cardTitle}>{city}, CA</p>
                <p className={styles.cardText}>
                  {page
                    ? `${page.summary} Learn more →`
                    : "Behind-the-wheel driving lessons and DMV test packages available."}
                </p>
              </>
            );
            return page ? (
              <Link key={city} to={`/locations/${page.slug}`} className={styles.card}>
                {card}
              </Link>
            ) : (
              <div key={city} className={styles.card}>
                {card}
              </div>
            );
          })}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaHeading}>Don't see your city?</p>
          <p className={styles.ctaSub}>
            Enter your ZIP code on the Packages page — we may still serve your area.
          </p>
          <Link to="/packages" className={styles.heroBtn}>Check Packages &amp; Pricing</Link>
        </div>
      </div>
    </div>
  );
}
