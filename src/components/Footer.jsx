import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { BUSINESS } from "../siteConfig";
import styles from "../styles/Footer.module.css";

// Maps a social profile's label to its icon — add a case here if a new
// platform is ever added to BUSINESS.socialProfiles in siteConfig.js.
const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebook,
};

// Footer — rendered once in App.jsx, appears on every page.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Business info */}
        <div className={styles.column}>
          <p className={styles.brand}>{BUSINESS.name}</p>
          <p className={styles.text}>
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
          </p>
          <p className={styles.text}>
            {BUSINESS.streetAddress}
            <br />
            {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode}
          </p>
          <p className={styles.text}>Hours: {BUSINESS.hoursText}</p>
          {BUSINESS.socialProfiles.length > 0 && (
            <div className={styles.socialRow}>
              {BUSINESS.socialProfiles.map((profile) => {
                const Icon = SOCIAL_ICONS[profile.label];
                return (
                  <a
                    key={profile.url}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={profile.label}
                    className={styles.socialLink}
                  >
                    {Icon ? <Icon /> : profile.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Site links */}
        <div className={styles.column}>
          <p className={styles.heading}>Site</p>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/packages" className={styles.link}>Packages</Link>
          <Link to="/about" className={styles.link}>About</Link>
          <Link to="/faq" className={styles.link}>FAQ</Link>
          <Link to="/contact" className={styles.link}>Contact</Link>
        </div>

        {/* Services */}
        <div className={styles.column}>
          <p className={styles.heading}>Services</p>
          <Link to="/services/teen-driving-lessons" className={styles.link}>Teen Driving Lessons</Link>
          <Link to="/services/adult-driving-lessons" className={styles.link}>Adult Driving Lessons</Link>
          <Link to="/services/dmv-test-preparation" className={styles.link}>DMV Test Preparation</Link>
          <Link to="/services/dmv-test-car-rental" className={styles.link}>DMV Test Car Rental</Link>
          <Link to="/locations" className={styles.link}>Service Areas</Link>
        </div>

        {/* Booking CTA */}
        <div className={styles.column}>
          <p className={styles.heading}>Ready to start?</p>
          <Link to="/packages" className={styles.bookBtn}>Book Now</Link>
          <Link to="/privacy-policy" className={styles.link} style={{ marginTop: "1rem" }}>
            Privacy Policy
          </Link>
        </div>
      </div>

      <p className={styles.copyright}>© {year} {BUSINESS.name}. All rights reserved.</p>
    </footer>
  );
}
