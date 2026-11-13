import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { PACKAGES, DISCOUNT, SERVED_CITIES } from "../data/packages";
import { zipToCity } from "../data/locations";
import { SCHOOL_PHONE, SCHOOL_PHONE_TEL } from "../siteConfig";
import styles from "../styles/QuickBookCard.module.css";

// Landing-page quick-start widget. The visitor picks a service and enters a
// ZIP (or picks a city), sees their real price, and goes straight to the
// booking form with the same navigation state the Packages page sends
// (selectedPackage / selectedCity / price after the promo) — so the booking
// flow itself needs no changes. Prices come from src/data/packages.js, the
// same source the Packages page uses.

// Short, readable names for the dropdown, in the order they're listed.
// Keyed by the exact package title in src/data/packages.js; a package that
// isn't listed here still shows up (under its full title) at the end.
const LABELS = {
  "Behind The Wheel Training Package: 2 Hours": "Driving lessons · 2 hours",
  "Behind The Wheel Training Package: 4 Hours": "Driving lessons · 4 hours ★ popular",
  "Behind The Wheel Training Package: 6 Hours": "Driving lessons · 6 hours",
  "Behind The Wheel Training Package: 8 Hours": "Driving lessons · 8 hours",
  "DMV Behind-The-Wheel Road Test (2 Hours)": "DMV road test + car rental",
  "Mock Test (2 Hours)": "Mock road test · 2 hours",
  "3-Hour Combo Package": "Practice + DMV test combo",
};
const LABEL_ORDER = Object.keys(LABELS);
const rank = (title) => {
  const i = LABEL_ORDER.indexOf(title);
  return i === -1 ? LABEL_ORDER.length : i;
};

const OPTIONS = PACKAGES.map((pkg) => ({ pkg, label: LABELS[pkg.title] || pkg.title })).sort(
  (a, b) => rank(a.pkg.title) - rank(b.pkg.title)
);
const DEFAULT_TITLE = (PACKAGES.find((p) => p.popular) || PACKAGES[0]).title;
const CITY_OPTIONS = [...SERVED_CITIES].sort((a, b) => a.localeCompare(b));

export default function QuickBookCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const zipRef = useRef(null);

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const pkg = PACKAGES.find((p) => p.title === title) || PACKAGES[0];
  const basePrice = city ? pkg.cities[city] : undefined;

  // Digits only, max 5. A recognised ZIP fills in the city; a full 5 digits
  // we don't serve explains why instead of silently doing nothing.
  const handleZip = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZip(value);
    const match = zipToCity[value];
    if (match) {
      setCity(match);
      setError("");
    } else {
      setCity("");
      setError(
        value.length === 5 ? "We don't serve that ZIP yet. Call us and we'll check your area." : ""
      );
    }
  };

  // Picking a city replaces whatever ZIP was typed, so the two never disagree.
  const handleCity = (e) => {
    setCity(e.target.value);
    setZip("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city) {
      setError("Enter your ZIP code or pick your city to see your price.");
      zipRef.current?.focus();
      return;
    }
    if (basePrice == null) {
      setError("That service isn't available in your city. Call us and we'll help.");
      return;
    }
    navigate("/booking", {
      state: { selectedPackage: pkg, selectedCity: city, price: basePrice - DISCOUNT },
    });
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <span className={styles.headerIcon}>
          <FaCalendarAlt aria-hidden="true" />
        </span>
        <div>
          <h2 className={styles.title}>Quick Book Your Lesson</h2>
          <p className={styles.sub}>See your price, then pick your times.</p>
        </div>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Service</span>
        <select className={styles.control} value={title} onChange={(e) => setTitle(e.target.value)}>
          {OPTIONS.map(({ pkg: p, label }) => (
            <option key={p.title} value={p.title}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>ZIP code</span>
          <input
            ref={zipRef}
            className={styles.control}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="e.g. 94545"
            value={zip}
            onChange={handleZip}
            maxLength={5}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>or choose city</span>
          <select className={styles.control} value={city} onChange={handleCity}>
            <option value="">Select city</option>
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* One live line: the error if there is one, otherwise the price (or a hint) */}
      <p className={error ? styles.error : styles.status} role="status" aria-live="polite">
        {error ? (
          error
        ) : basePrice != null ? (
          <>
            Your price in {city}: <s className={styles.was}>${basePrice}</s>{" "}
            <strong className={styles.now}>${basePrice - DISCOUNT}</strong> after ${DISCOUNT} off
          </>
        ) : (
          "Enter your ZIP or pick a city to see your price."
        )}
      </p>

      <button type="submit" className={styles.book}>
        Check Availability &amp; Save ${DISCOUNT} <FaArrowRight aria-hidden="true" />
      </button>

      <ul className={styles.perks}>
        <li><FaCheckCircle aria-hidden="true" /> Pick-up &amp; drop-off included</li>
        <li><FaCheckCircle aria-hidden="true" /> No waiting list</li>
        <li><FaCheckCircle aria-hidden="true" /> Pay later or online</li>
      </ul>

      <p className={styles.call}>
        Prefer to talk?{" "}
        <a href={`tel:${SCHOOL_PHONE_TEL}`} aria-label={`Call Best Driving School at ${SCHOOL_PHONE}`}>
          <FaPhoneAlt aria-hidden="true" /> {SCHOOL_PHONE}
        </a>
      </p>

      {/* An account isn't needed to book, so this stays small and quiet */}
      {!user && (
        <Link to="/signup" className={styles.signup}>
          New here? Create an account →
        </Link>
      )}
    </form>
  );
}
