import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
import { SCHOOL_ADDRESS, BUSINESS } from "../siteConfig";
import {
  FaArrowRight,
  FaGoogle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCar,
} from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import QuickBookCard from "../components/QuickBookCard";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "../lib/structuredData";
import { faqs } from "../data/faq";

// Links straight to this business's real Google Maps listing, where the
// reviews below can be independently verified — real quotes, but shown as
// styled cards on our own site, so a skeptical visitor has no way to tell
// that from a fabricated/AI-written testimonial without this link. Same
// query pattern as the "Get Directions" link on ContactPage.jsx.
const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name} ${SCHOOL_ADDRESS}`
)}`;

// Reusable animation: fade up from below as element enters view
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ── "Our Driving School Covers" tiles in the hero. Each links to that
// city's own page (src/data/cityPages.js — keep these slugs in sync).
// Sacramento has no dedicated page yet, so it points at the full
// service-area list. cityPages.js isn't imported here on purpose: it's
// ~40 KB of city copy that would otherwise get bundled into the landing
// page's first load.
const coverageCities = [
  { name: "San Francisco", to: "/locations/san-francisco" },
  { name: "Oakland",       to: "/locations/oakland" },
  { name: "Hayward",       to: "/locations/hayward" },
  { name: "Concord",       to: "/locations/concord" },
  { name: "San Ramon",     to: "/locations/san-ramon" },
  { name: "Pleasanton",    to: "/locations/pleasanton" },
  { name: "Dublin",        to: "/locations/dublin" },
  { name: "Sacramento",    to: "/locations" },
];

// Decorative Golden Gate-style bridge silhouette drawn in SVG (not a photo,
// so no stock/AI imagery). Cable curves are quadratic Bézier curves; the
// vertical hangers are computed along each curve so they land exactly on
// the cable.
const BRIDGE_SPANS = [
  { p: [[0, 198], [170, 172], [330, 44]], hangers: 9 },
  { p: [[330, 44], [600, 256], [870, 44]], hangers: 30 },
  { p: [[870, 44], [1030, 172], [1200, 198]], hangers: 9 },
];
const BRIDGE_DECK_Y = 208;
const bridgePoint = ([p0, p1, p2], t) => ({
  x: (1 - t) * (1 - t) * p0[0] + 2 * t * (1 - t) * p1[0] + t * t * p2[0],
  y: (1 - t) * (1 - t) * p0[1] + 2 * t * (1 - t) * p1[1] + t * t * p2[1],
});

// Returns [ref, shown]: `shown` flips to true the first time the element
// scrolls into view (then stops observing). Used to play the trust bar /
// city tile entrance animation when people actually reach them, not on load.
function useRevealOnScroll() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, shown];
}

function HeroBridge() {
  return (
    <svg
      className={styles.heroBridge}
      viewBox="0 0 1200 270"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {BRIDGE_SPANS.map(({ p, hangers }, i) => (
          <g key={i}>
            <path
              className={styles.bridgeCable}
              pathLength="1"
              d={`M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}`}
              strokeWidth="3"
            />
            {Array.from({ length: hangers }, (_, k) => {
              const pt = bridgePoint(p, (k + 1) / (hangers + 1));
              return (
                <line
                  key={k}
                  className={styles.bridgeHanger}
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={BRIDGE_DECK_Y}
                  strokeWidth="1.2"
                />
              );
            })}
          </g>
        ))}
        <line
          className={styles.bridgeDeck}
          pathLength="1"
          x1="0"
          y1={BRIDGE_DECK_Y}
          x2="1200"
          y2={BRIDGE_DECK_Y}
          strokeWidth="7"
        />
        {[330, 870].map((x) => (
          <g key={x} className={styles.bridgeTower} strokeWidth="5">
            <line x1={x - 9} y1="40" x2={x - 9} y2="270" />
            <line x1={x + 9} y1="40" x2={x + 9} y2="270" />
            {[62, 104, 146].map((y) => (
              <line key={y} x1={x - 9} y1={y} x2={x + 9} y2={y} strokeWidth="4" />
            ))}
            <line x1={x - 11} y1="40" x2={x + 11} y2="40" strokeWidth="6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── Why Choose Us cards ──
const features = [
  {
    icon: "🎓",
    title: "Certified Instructors",
    desc: "All our instructors are DMV-certified with years of professional teaching experience.",
  },
  {
    icon: "📍",
    title: "Pick-Up & Drop-Off",
    desc: "We come to you. Pick-up and drop-off included from your home or school.",
  },
  {
    icon: "🚗",
    title: "Real Road Practice",
    desc: "Learn on real streets, not simulators. We cover highways, intersections, and parking.",
  },
  {
    icon: "📋",
    title: "DMV Test Ready",
    desc: "Our longer packages include the DMV-required certificate for teen drivers.",
  },
  {
    icon: "📅",
    title: "No Waiting List",
    desc: "Unlike other schools, we don't make you wait weeks for an opening. Instructors are available now, book a session on your schedule this week.",
  },
  {
    icon: "📍",
    title: `${BUSINESS.serviceAreas.length}+ Cities Covered`,
    desc: "Serving the Bay Area and the Sacramento region, from San Francisco to Elk Grove.",
  },
];

// ── How It Works steps ──
const steps = [
  {
    number: "01",
    title: "Choose a Package",
    desc: "Browse our driving packages and mock/DMV tests, from 2 hours up to a full combo course.",
  },
  {
    number: "02",
    title: "Pick Your City & Time",
    desc: "Enter your ZIP or select your city, then schedule your session dates.",
  },
  {
    number: "03",
    title: "Hit the Road",
    desc: "Your instructor arrives at your door. Start driving with confidence.",
  },
];

// ── Stats ──
const stats = [
  { value: "500+", label: "Students Trained" },
  { value: `${BUSINESS.serviceAreas.length}+`, label: "Cities Served" },
  { value: "5★",   label: "Average Rating" },
  { value: "100%", label: "DMV Pass Rate" },
];

// ── Featured packages (preview — full list + city pricing on /packages) ──
// Matches the promo on the Packages page — $20 off every package
const DISCOUNT = 20;

const featuredPackages = [
  { title: "Two-Hour Driving Lesson", price: 180, blurb: "A single focused session to build core skills." },
  { title: "DMV Drive Test", price: 240, blurb: "Your behind-the-wheel road test, done with us." },
  { title: "Mock Test", price: 210, blurb: "A simulated road test with feedback before the real thing." },
  { title: "Eight-Hour Driving Lesson", price: 640, blurb: "Our most complete training package." },
];

// ── Testimonials — real reviews from our Google Business listing ──
const testimonials = [
  {
    quote: "My instructor was very calm and understood the areas I had to learn. I got my license and definitely recommend Best Driving School.",
    name: "Niranjan T.",
    source: "Google review",
  },
  {
    quote: "Thanks to Hakimi, I passed my drive test at Oakland DMV. He was great and patient. Totally recommend this school and also the service to rent the car for the drive test.",
    name: "Andres Baez",
    source: "Google review",
  },
  {
    quote: "Passed first time at SF DMV thanks to Hakimi's preparation. Thank you!",
    name: "Ian McGregor",
    source: "Google review",
  },
  {
    quote: "I passed my driving test at the Petaluma DMV! A huge thank you to Hakimi for being so patient, supportive, and for helping me build my confidence behind the wheel. I'm so grateful we found him!",
    name: "Lucia Fiss",
    source: "Google review",
  },
];

// ── Real student pass-day photos — see public/student-successes/.
// No names/locations are attached since none were given for these specific
// photos (unlike the text testimonials above, which came with names) — only
// honest, generic alt text. Each links to the full-size photo in a new tab.
const studentPhotos = Array.from({ length: 7 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `/student-successes/pass-${n}.jpg`, key: n };
});

// FAQ content now lives in src/data/faq.js, shared with the full /faq page

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [trustRef, trustShown] = useRevealOnScroll();
  const [coverageRef, coverageShown] = useRevealOnScroll();

  return (
    <div className={styles.page}>
      {/* Per-page SEO tags (title/description/canonical/OG/structured data) — see SEOHead.jsx */}
      <SEOHead
        title="Best Driving School | Driving Lessons in the Bay Area & Sacramento, CA"
        description="Behind-the-wheel driving lessons and DMV road test packages in the Bay Area and Sacramento region. Certified instructors, pick-up and drop-off included, pay online or at your session."
        path="/"
        structuredData={[buildLocalBusinessSchema(), buildOrganizationSchema(), buildWebSiteSchema()]}
      />

      {/* ════════════════════════════════
           HERO SECTION
          ════════════════════════════════ */}
      <section className={styles.hero}>
        <HeroBridge />

        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroLeft}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* Two pills on desktop; on phones the CSS merges them into one
                compact status bar (and swaps in the shorter availability text). */}
            <div className={styles.heroStatus}>
              <p className={styles.heroLocationBadge}>
                <FaMapMarkerAlt aria-hidden="true" /> Bay Area &amp; Sacramento
              </p>
              {/* No-waiting-list callout — instructors have real openings,
                  unlike schools that put new students on a waitlist. */}
              <div className={styles.availabilityBadge}>
                <span className={styles.availabilityDot} aria-hidden="true" />
                <span className={styles.badgeLong}>No waiting list, instructors available now</span>
                <span className={styles.badgeShort}>No waiting list</span>
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              Drive with Confidence.<br />
              <span className={styles.heroAccent}>Learn the Right Way.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              The Bay Area and Sacramento region's trusted driving school,
              with certified instructors, flexible scheduling, and
              pick-up from your door.
            </p>

            <ul className={styles.heroChips}>
              <li>
                <FaShieldAlt aria-hidden="true" />
                <span>Certified<br />Instructors</span>
              </li>
              <li>
                <FaCalendarAlt aria-hidden="true" />
                <span>Flexible<br />Scheduling</span>
              </li>
              <li>
                <FaCar aria-hidden="true" />
                <span>Door-to-Door<br />Pick-up</span>
              </li>
            </ul>

            {/* Secondary on purpose: the Quick Book card is the main
                conversion action, so this is just a way to browse everything.
                Hidden on phones, where the card sits right below the copy. */}
            <Link to="/packages" className={styles.btnGhost}>
              View packages &amp; pricing <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.aside
            className={styles.heroAside}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <QuickBookCard />
          </motion.aside>
        </div>

        {/* Trust bar — real claims only. (The mockup this was modeled on
            said "Most Affordable in the East Bay"; that's an unverifiable
            superlative, so it's the no-waiting-list point instead.) */}
        <div
          ref={trustRef}
          className={`${styles.trustBar} ${trustShown ? styles.revealShown : styles.revealHidden}`}
        >
          <div className={styles.trustItem}>
            <FaGoogle className={styles.trustGoogle} aria-hidden="true" />
            <div>
              <strong>5.0 Rating</strong>
              <span>
                <span className={styles.trustStars} aria-hidden="true">★★★★★</span> 500+ Happy Students
              </span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <FaShieldAlt className={styles.trustIcon} aria-hidden="true" />
            <div>
              <strong>DMV-Approved</strong>
              <span>Certified Instructors</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <FaCalendarCheck className={styles.trustIcon} aria-hidden="true" />
            <div>
              <strong>No Waiting List</strong>
              <span>Instructors available now</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <FaMapMarkerAlt className={styles.trustIconOrange} aria-hidden="true" />
            <div>
              <strong>Serving {BUSINESS.serviceAreas.length}+ Cities</strong>
              <span>Bay Area &amp; Sacramento</span>
            </div>
          </div>
        </div>

        {/* "Our Driving School Covers" — links to real city pages */}
        <div
          ref={coverageRef}
          className={`${styles.coverage} ${coverageShown ? styles.revealShown : styles.revealHidden}`}
        >
          <h2 className={styles.coverageTitle}>Our Driving School Covers</h2>
          <div className={styles.coverageGrid}>
            {coverageCities.map((c) => (
              <Link key={c.name} to={c.to} className={styles.coverageTile}>
                <span className={styles.coveragePin}>
                  <FaMapMarkerAlt aria-hidden="true" />
                </span>
                {c.name}
              </Link>
            ))}
          </div>
          <Link to="/locations" className={styles.coverageAll}>
            See all {BUSINESS.serviceAreas.length} service areas →
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════
           STATS BAR
          ════════════════════════════════ */}
      <section className={styles.statsBar}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ════════════════════════════════
           FEATURED PACKAGES
          ════════════════════════════════ */}
      <section className={styles.section}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.sectionLabel}>Pricing</p>
          <h2 className={styles.sectionTitle}>Popular Packages</h2>
        </motion.div>

        <div className={styles.packagesGrid}>
          {featuredPackages.map((p, i) => (
            <motion.div
              key={p.title}
              className={styles.packageCard}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className={styles.packageTitle}>{p.title}</h3>
              <p className={styles.packagePrice}>
                <span className={styles.packagePriceOriginal}>${p.price}</span>
                ${p.price - DISCOUNT}
              </p>
              <p className={styles.packageBlurb}>{p.blurb}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.packagesCtaWrap}
        >
          <Link to="/packages" className={styles.btnPrimary}>
            See All Packages & Pricing
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════
           WHY CHOOSE US
          ════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}        // animate only once as it scrolls into view
        >
          <p className={styles.sectionLabel}>Why Choose Us</p>
          <h2 className={styles.sectionTitle}>Everything You Need to Pass</h2>
        </motion.div>

        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.featureCard}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} // stagger each card slightly
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
           HOW IT WORKS
          ════════════════════════════════ */}
      <section className={styles.section}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.sectionLabel}>Simple Process</p>
          <h2 className={styles.sectionTitle}>How It Works</h2>
        </motion.div>

        <div className={styles.stepsRow}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className={styles.stepCard}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Big step number in the background */}
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
           TESTIMONIALS
          ════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.sectionLabel}>Testimonials</p>
          <h2 className={styles.sectionTitle}>What Our Students Say</h2>
          <p className={styles.sectionSubtitle}>
            Real reviews from our Google Business Profile —{" "}
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              see them on Google
            </a>{" "}
            to verify them yourself.
          </p>
        </motion.div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.testimonialCard}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <p className={styles.testimonialStars}>★★★★★</p>
              <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
              <p className={styles.testimonialName}>
                {t.name}{" "}
                <span className={styles.testimonialCity}>
                  · <FaGoogle aria-hidden="true" className={styles.testimonialGoogleIcon} /> {t.source}
                </span>
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.testimonialsCtaWrap}
        >
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
          >
            <FaGoogle aria-hidden="true" /> Read All Our Reviews on Google
          </a>
        </motion.div>
      </section>

      {/* ════════════════════════════════
           REAL STUDENT PASS-DAY PHOTOS
          ════════════════════════════════ */}
      <section className={styles.section}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.sectionLabel}>Proof, Not Promises</p>
          <h2 className={styles.sectionTitle}>Real Students, Real Pass Certificates</h2>
          <p className={styles.sectionSubtitle}>
            Actual photos from our students' test day.
          </p>
        </motion.div>

        <div className={styles.photoGrid}>
          {studentPhotos.map((p, i) => (
            <motion.a
              key={p.key}
              href={p.src}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.photoCard}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <img
                src={p.src}
                alt="Best Driving School student holding their DMV pass certificate"
                loading="lazy"
              />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
           FAQ
          ════════════════════════════════ */}
      <section className={styles.section}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.sectionLabel}>Questions</p>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        </motion.div>

        <div className={styles.faqList}>
          {/* Teaser — just the first few; the full list lives at /faq */}
          {faqs.slice(0, 5).map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={item.q} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className={styles.faqCaret}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            );
          })}
        </div>
        <p className={styles.faqMoreLink}>
          <Link to="/faq">View all FAQs →</Link>
        </p>
      </section>

      {/* ════════════════════════════════
           FINAL CTA BANNER
          ════════════════════════════════ */}
      <section className={styles.ctaBanner}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>Ready to Get Behind the Wheel?</h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of students who passed their test with Best Driving School.
          </p>
          <Link to="/packages" className={styles.btnPrimary}>
            Book a Session
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
