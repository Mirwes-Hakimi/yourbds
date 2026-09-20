import { Link, useParams } from "react-router-dom";
import styles from "../styles/InfoPage.module.css";
import SEOHead from "../components/SEOHead";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";
import { CITY_PAGES, getCityPage, getCityPageByName, DMV_LOCATIONS_URL } from "../data/cityPages";
import NotFound from "./NotFound";

// City landing page — shown at /locations/:citySlug (e.g. /locations/concord).
//
// ONE template, MANY cities: all the text lives in src/data/cityPages.js.
// This file only decides the layout, so every city gets the same
// structure but its own intro, DMV information, nearby cities and FAQs.
// To add a city, add an entry to that data file — no changes needed here.
export default function CityPage() {
  const { citySlug } = useParams();
  const city = getCityPage(citySlug);

  // Unknown slug (e.g. /locations/atlantis) → the normal 404 page,
  // rather than an empty page that search engines might index.
  if (!city) return <NotFound />;

  const path = `/locations/${city.slug}`;

  // FAQPage structured data. Valid only because these exact questions
  // and answers are shown on the page below (Google requires a match).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  // Other cities that have their own page — used for the "also serving"
  // links at the bottom so visitors (and crawlers) can move between them.
  const otherCityPages = CITY_PAGES.filter((c) => c.slug !== city.slug);

  return (
    <div className={styles.page}>
      <SEOHead
        title={city.title}
        description={city.description}
        path={path}
        structuredData={[
          buildLocalBusinessSchema(),
          faqSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/locations" },
            { name: city.name, path },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>{city.name}, CA</p>
        <h1 className={styles.heroHeading}>
          Driving Lessons in <span>{city.name}</span>
        </h1>
        <p className={styles.heroSub}>{city.summary}</p>
        <Link to="/packages" className={styles.heroBtn}>Check Pricing by ZIP Code</Link>
      </section>

      <div className={styles.content}>
        {/* ── Intro (unique per city) ── */}
        <h2 className={styles.sectionHeading}>Learning to Drive in {city.name}</h2>
        {city.paragraphs.map((text) => (
          <p key={text} className={styles.cardText} style={{ marginBottom: "1rem" }}>
            {text}
          </p>
        ))}

        {/* ── DMV information ── */}
        <h2 className={styles.sectionHeading}>DMV Offices Near {city.name}</h2>
        <div className={styles.infoBox}>
          <p>{city.dmv.body}</p>
        </div>
        <div className={styles.grid}>
          {city.dmv.offices.map((office) => (
            <div key={office.name} className={styles.card}>
              <p className={styles.cardTitle}>{office.name}</p>
              <p className={styles.cardText}>{office.address}</p>
              <p className={styles.cardText}>
                <a href={office.url} target="_blank" rel="noopener noreferrer">
                  Hours &amp; details on dmv.ca.gov
                </a>
              </p>
            </div>
          ))}
        </div>
        <p className={styles.cardText} style={{ marginTop: "0.75rem" }}>
          DMV offices change their hours and services from time to time, so always confirm on the{" "}
          <a href={DMV_LOCATIONS_URL} target="_blank" rel="noopener noreferrer">
            DMV website
          </a>{" "}
          before you go.
        </p>

        {/* ── Services ── */}
        <h2 className={styles.sectionHeading}>Lessons Available in {city.name}</h2>
        <div className={styles.grid}>
          <Link to="/services/teen-driving-lessons" className={styles.card}>
            <p className={styles.cardTitle}>Teen Driving Lessons</p>
            <p className={styles.cardText}>Behind-the-wheel training for teens ages 15½ and up.</p>
          </Link>
          <Link to="/services/adult-driving-lessons" className={styles.card}>
            <p className={styles.cardTitle}>Adult Driving Lessons</p>
            <p className={styles.cardText}>For first-time, returning, and new-to-California drivers.</p>
          </Link>
          <Link to="/services/dmv-test-preparation" className={styles.card}>
            <p className={styles.cardTitle}>DMV Road Test Prep</p>
            <p className={styles.cardText}>A warm-up drive and a certified vehicle for test day.</p>
          </Link>
        </div>

        {/* ── City-specific FAQs ── */}
        <h2 className={styles.sectionHeading}>{city.name} Driving Lesson FAQs</h2>
        <div className={styles.grid}>
          {city.faqs.map((item) => (
            <div key={item.q} className={styles.card}>
              <p className={styles.cardTitle}>{item.q}</p>
              <p className={styles.cardText}>{item.a}</p>
            </div>
          ))}
        </div>

        {/* ── Nearby cities ── each links to its own page if one exists ── */}
        <h2 className={styles.sectionHeading}>Also Serving Nearby</h2>
        <p className={styles.cardText}>
          {city.nearby.map((name, i) => {
            const page = getCityPageByName(name);
            return (
              <span key={name}>
                {i > 0 && ", "}
                {page ? <Link to={`/locations/${page.slug}`}>{name}</Link> : name}
              </span>
            );
          })}
          .{" "}
          <Link to="/locations">See all service areas</Link>
          {otherCityPages.length > 0 && (
            <>
              {" · "}
              {otherCityPages.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && ", "}
                  <Link to={`/locations/${c.slug}`}>{c.name}</Link>
                </span>
              ))}
            </>
          )}
        </p>

        {/* ── CTA ── */}
        <div className={styles.cta}>
          <p className={styles.ctaHeading}>Ready to book in {city.name}?</p>
          <p className={styles.ctaSub}>
            Enter your ZIP code on the Packages page to see pricing. Pick-up and drop-off are
            included in every session.
          </p>
          <Link to="/packages" className={styles.heroBtn}>View Packages &amp; Pricing</Link>
        </div>
      </div>
    </div>
  );
}
