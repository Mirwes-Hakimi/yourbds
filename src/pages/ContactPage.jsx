import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import infoStyles from "../styles/InfoPage.module.css";
import styles from "../styles/Contact.module.css";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_CONTACT_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  SCHOOL_NOTIFY_EMAIL,
} from "../emailjs.config";
import { SCHOOL_PHONE, SCHOOL_PHONE_TEL, SCHOOL_ADDRESS, BUSINESS } from "../siteConfig";
import SEOHead from "../components/SEOHead";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";

// Contact page — shown at /contact
export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sends the message directly via EmailJS — no email app required on
  // the visitor's end. Reply-To is set on the template itself so the
  // school can just hit "reply" to respond to the visitor directly.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        {
          to_email: SCHOOL_NOTIFY_EMAIL,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form send failed:", err);
      alert("Could not send your message. Please try again, or email us directly at " + SCHOOL_NOTIFY_EMAIL);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={infoStyles.page}>
      <SEOHead
        title="Contact Us | Best Driving School"
        description="Get in touch with Best Driving School — call, email, or send a message. Serving the Bay Area and Sacramento region with pick-up and drop-off driving lessons."
        path="/contact"
        structuredData={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className={infoStyles.hero}>
        <p className={infoStyles.heroEyebrow}>Get In Touch</p>
        <h1 className={infoStyles.heroHeading}>
          Contact <span>Best Driving School</span>
        </h1>
        <p className={infoStyles.heroSub}>
          Questions about lessons, pricing, or scheduling? Reach out and
          we'll get back to you, or book a session directly.
        </p>
        <Link to="/packages" className={infoStyles.heroBtn}>Book a Session</Link>
      </section>

      {/* ── Content ── */}
      <div className={infoStyles.content}>

        <div className={infoStyles.grid}>
          <div className={infoStyles.card}>
            <span className={infoStyles.cardIcon}>✉️</span>
            <p className={infoStyles.cardTitle}>Email Us</p>
            <p className={infoStyles.cardText}>
              <a href={`mailto:${SCHOOL_NOTIFY_EMAIL}`}>{SCHOOL_NOTIFY_EMAIL}</a>
              <br />We typically respond within one business day.
            </p>
          </div>

          <div className={infoStyles.card}>
            <span className={infoStyles.cardIcon}>📞</span>
            <p className={infoStyles.cardTitle}>Call Us</p>
            <p className={infoStyles.cardText}>
              <a href={`tel:${SCHOOL_PHONE_TEL}`}>{SCHOOL_PHONE}</a>
              <br />Call or text with any questions.
            </p>
          </div>

          <div className={infoStyles.card}>
            <span className={infoStyles.cardIcon}>🏢</span>
            <p className={infoStyles.cardTitle}>Visit Us</p>
            <p className={infoStyles.cardText}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SCHOOL_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SCHOOL_ADDRESS}
              </a>
            </p>
          </div>

          <div className={infoStyles.card}>
            <span className={infoStyles.cardIcon}>🕗</span>
            <p className={infoStyles.cardTitle}>Hours</p>
            <p className={infoStyles.cardText}>{BUSINESS.hoursText}</p>
          </div>

          <div className={infoStyles.card}>
            <span className={infoStyles.cardIcon}>📍</span>
            <p className={infoStyles.cardTitle}>Areas We Serve</p>
            <p className={infoStyles.cardText}>
              The greater Bay Area (San Francisco, Oakland, Walnut Creek,
              Concord, and more) and the Sacramento region, including
              Sacramento, Folsom, Elk Grove, Roseville, and Rancho Cordova.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.fieldLabel}>
              Name:
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.fieldLabel}>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.fieldLabel}>
              Message:
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className={styles.submitBtn} disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
            {sent ? (
              <p className={styles.note}>
                Message sent! We'll get back to you within one business day.
              </p>
            ) : (
              <p className={styles.note}>
                Sends directly to us, no email app needed.
              </p>
            )}
          </form>
          <p className={styles.legalLink}>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
