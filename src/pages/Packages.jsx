import React, { useState } from "react";
import styles from "../styles/Packages.module.css";
import { useNavigate } from "react-router-dom";
import { zipToCity } from "../data/locations";
import { PACKAGES, DISCOUNT } from "../data/packages";
import SEOHead from "../components/SEOHead";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";

export default function Packages() {

  const packages = PACKAGES;

  // Gather all city names from all packages into one Set (unique)
  const allCities = Array.from(
    new Set(packages.flatMap((pkg) => Object.keys(pkg.cities)))
  );

  const [zip, setZip] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zipError, setZipError] = useState("");
  const navigate = useNavigate();

  const handleZipChange = (e) => {
    const value = e.target.value.trim();
    setZip(value);
    const city = zipToCity[value];
    if (city) {
      setSelectedCity(city);
      setZipError("");
    } else {
      setSelectedCity("");
      if (value.length >= 5) {
        setZipError("We currently don't serve this ZIP code.");
      } else {
        setZipError("");
      }
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleBookingNow = (selectedPackage) => {
    if (!selectedCity) {
      alert("Please select your city or enter a valid ZIP before booking.");
      return;
    }
    const cityPrice = selectedPackage.cities[selectedCity];
    if (cityPrice == null) {
      alert("This package is not available in the selected city.");
      return;
    }
    navigate("/booking", {
      state: { selectedPackage, selectedCity, price: cityPrice - DISCOUNT },
    });
  };

  return (
    <div className={styles.page}>
      <SEOHead
        title="Driving Lesson Packages & Pricing | Best Driving School"
        description="Compare behind-the-wheel training packages, DMV road test packages, and mock test pricing across the Bay Area and Sacramento region. Enter your ZIP code to see pricing near you."
        path="/packages"
        structuredData={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Packages", path: "/packages" },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Bay Area &amp; Sacramento Driving School</p>
        <h1 className={styles.heroHeading}>
          Choose the Package <span>Right for You</span>
        </h1>
        <p className={styles.promoBanner}>🎉 Limited time: $20 off every package</p>
        <p className={styles.heroSub}>
          All packages include pick-up &amp; drop-off. Select your city or enter
          your ZIP to see pricing in your area.
        </p>

        {/* Location selector */}
        <div className={styles.locationWrap}>
          <div className={styles.locationBar}>
            <label className={styles.fieldLabel}>
              ZIP Code
              <input
                className={styles.zipInput}
                value={zip}
                onChange={handleZipChange}
                placeholder="e.g. 94523"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
              />
            </label>

            <label className={styles.fieldLabel}>
              Or choose your city
              <select
                className={styles.citySelect}
                value={selectedCity}
                onChange={handleCityChange}
              >
                <option value="">Select City</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {zipError && <p className={styles.warning}>{zipError}</p>}
          {!selectedCity && !zipError && (
            <p className={styles.helperText}>
              Enter your ZIP or choose a city above to see prices.
            </p>
          )}
        </div>
      </section>

      {/* ── Cards ── */}
      {selectedCity && (
        <section className={styles.cardsSection}>
          <div className={styles.grid}>
            {packages.map((pkg, index) => {
              const cityPrice = pkg.cities[selectedCity];
              if (cityPrice == null) return null;
              const discountedPrice = cityPrice - DISCOUNT;

              return (
                <div
                  key={index}
                  className={`${styles.card} ${pkg.popular ? styles.cardPopular : ""}`}
                >
                  {pkg.popular && (
                    <span className={styles.popularBadge}>Most Popular</span>
                  )}

                  <span className={styles.typeChip}>{pkg.type}</span>

                  <h2 className={styles.title}>{pkg.title}</h2>

                  <div className={styles.priceRow}>
                    <span className={styles.priceOriginal}>${cityPrice}</span>
                    <span className={styles.priceDollar}>$</span>
                    <span className={styles.priceAmount}>{discountedPrice}</span>
                    <span className={styles.priceSub}>/ package</span>
                  </div>
                  <span className={styles.saveTag}>Save ${DISCOUNT}</span>

                  <div className={styles.divider} />

                  <ul className={styles.features}>
                    {pkg.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleBookingNow(pkg)}
                    className={`${styles.buyBtn} ${pkg.popular ? styles.buyBtnPopular : ""}`}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
