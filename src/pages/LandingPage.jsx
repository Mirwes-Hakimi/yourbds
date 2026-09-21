import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
import { useAuth } from "../components/AuthContext";
import { SCHOOL_PHONE, SCHOOL_PHONE_TEL } from "../siteConfig";
import { FaCarSide, FaArrowRight } from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "../lib/structuredData";
import { faqs } from "../data/faq";

// Reusable animation: fade up from below as element enters view
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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
    title: "20+ Cities Covered",
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
  { value: "20+",  label: "Cities Served" },
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

// FAQ content now lives in src/data/faq.js, shared with the full /faq page

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const { user } = useAuth();

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
        {/* Subtle grid texture + gradient backdrop — purely decorative */}
        <div className={styles.heroGridTexture} />
        <div className={styles.heroGlow} />

        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroLeft}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className={styles.heroTitle}>
              Drive with Confidence.<br />
              <span className={styles.heroAccent}>Learn the Right Way.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              The Bay Area and Sacramento region's trusted driving school,
              with certified instructors, flexible scheduling, and
              pick-up from your door.
            </p>

            {/* No-waiting-list callout — instructors have real openings,
                unlike schools that put new students on a waitlist. */}
            <div className={styles.availabilityBadge}>
              <span className={styles.availabilityDot} aria-hidden="true" />
              No waiting list, instructors available now
            </div>

            {/* CTA buttons */}
            <div className={styles.heroBtns}>
              <Link to="/packages" className={styles.btnPrimary}>
                Explore Packages
              </Link>
              {!user && (
                <Link to="/signup" className={styles.btnSecondary}>
                  Create Account
                </Link>
              )}
            </div>

            {/* Click-to-call — easy to spot for anyone who'd rather just phone in */}
            <a href={`tel:${SCHOOL_PHONE_TEL}`} className={styles.heroCallLink}>
              <span aria-hidden="true">📞</span> Call us: {SCHOOL_PHONE}
            </a>

            {/* Social proof badge */}
            <div className={styles.socialProof}>
              <div className={styles.socialProofAvatars} aria-hidden="true">
                <span className={styles.avatar} style={{ background: "#ea580c" }}>J</span>
                <span className={styles.avatar} style={{ background: "#0891b2" }}>M</span>
                <span className={styles.avatar} style={{ background: "#7c3aed" }}>A</span>
                <span className={styles.avatar} style={{ background: "#16a34a" }}>S</span>
              </div>
              <span className={styles.socialProofStars} aria-hidden="true">★★★★★</span>
              <span>5.0 Rating &nbsp;|&nbsp; 500+ Students Trained in the Bay Area & Sacramento</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroRight}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <div className={styles.heroCard}>
              <div className={styles.heroCardBadge}>
                <FaCarSide />
              </div>
              <h3 className={styles.heroCardTitle}>Your First Lesson</h3>
              <ul className={styles.heroCardList}>
                <li>
                  <span className={styles.heroCardCheck}>✓</span>
                  Certified, DMV-approved instructors
                </li>
                <li>
                  <span className={styles.heroCardCheck}>✓</span>
                  Pick-up &amp; drop-off included
                </li>
                <li>
                  <span className={styles.heroCardCheck}>✓</span>
                  No waiting list, flexible scheduling 7 days a week
                </li>
                <li>
                  <span className={styles.heroCardCheck}>✓</span>
                  Pay later or online, your choice
                </li>
              </ul>
              <Link to="/packages" className={styles.heroCardCta}>
                Quick Book, Save $20 <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
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
                {t.name} <span className={styles.testimonialCity}>· {t.source}</span>
              </p>
            </motion.div>
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
