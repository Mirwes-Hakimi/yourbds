import React, { useState } from "react";
import styles from "../styles/Packages.module.css";
import { useNavigate } from "react-router-dom";
import { zipToCity } from "../data/locations";
import SEOHead from "../components/SEOHead";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";

// Cities we serve — used to build a flat (same price everywhere) pricing
// table for packages that don't have per-city pricing data yet.
// PRICING RULE for "standard" cities (everywhere except San Francisco, Daly
// City, Sacramento, and Brentwood, which have their own distinct pricing):
// after the $20 promo below, the training packages must come out to an
// exact multiple of the 2-hour price — $160 × session count ($160/$320/$480
// for 2/4/6 hours) — so a 4- or 6-hour booking costs exactly what that many
// separate 2-hour sessions would. That means the BASE prices here (before
// the discount) are $180 / $340 / $500. If the $20 promo amount ever
// changes, re-derive these three numbers from $160 × session count again —
// don't leave the old base prices in place.
const SERVED_CITIES = [
  "San Francisco", "Daly City", "Livermore", "Pleasanton", "Dublin",
  "San Ramon", "Danville", "Alamo", "Walnut Creek", "Pleasant Hill",
  "Concord", "Pittsburg", "Antioch", "Brentwood", "Oakland",
  "Hayward", "Fremont",
  "San Leandro", "Castro Valley", "Union City", "Newark", "Alameda", "Berkeley", "Emeryville", "Richmond",
  "El Cerrito", "Martinez", "Lafayette", "Orinda", "Oakley", "Corte Madera", "Vallejo", "Fairfield",
  "Sacramento", "Folsom", "Elk Grove", "Roseville", "Rancho Cordova",
  "Citrus Heights", "Rocklin",
];

const flatCities = (price) =>
  Object.fromEntries(SERVED_CITIES.map((city) => [city, price]));

// Current promo — $20 off every package, applied at checkout too (not just display)
const DISCOUNT = 20;

export default function Packages() {

  const packages = [
    {
      title: "Behind The Wheel Training Package: 2 Hours",
      type: "TRAINING",
      sessions: 1,
      popular: false,
      cities: {
        "San Francisco": 210,
        "Daly City": 200,
        "Livermore": 180,
        "Pleasanton": 180,
        "Dublin": 180,
        "San Ramon": 180,
        "Danville": 180,
        "Alamo": 180,
        "Walnut Creek": 180,
        "Pleasant Hill": 180,
        "Concord": 180,
        "Pittsburg": 180,
        "Antioch": 180,
        "Brentwood": 185,
        "Oakland": 180,
        "Hayward": 180,
        "Fremont": 180,
        "San Leandro": 180,
        "Castro Valley": 180,
        "Union City": 180,
        "Newark": 180,
        "Alameda": 180,
        "Berkeley": 180,
        "Emeryville": 180,
        "Richmond": 180,
        "El Cerrito": 180,
        "Martinez": 180,
        "Lafayette": 180,
        "Orinda": 180,
        "Oakley": 180,
        "Corte Madera": 180,
        "Vallejo": 180,
        "Fairfield": 180,
        "Sacramento": 200,
        "Folsom": 180,
        "Elk Grove": 180,
        "Roseville": 180,
        "Rancho Cordova": 180,
        "Citrus Heights": 180,
        "Rocklin": 180,
      },
      features: [
        "✔️ Pick-up and drop-off included",
        "✔️ Start driving from a parking lot or quiet residential area",
        "✔️ Comprehensive explanation of primary driving rules",
      ],
    },
    {
      title: "Behind The Wheel Training Package: 4 Hours",
      type: "TRAINING",
      sessions: 2,
      popular: true,
      cities: {
        "San Francisco": 390,
        "Daly City": 380,
        "Livermore": 340,
        "Pleasanton": 340,
        "Dublin": 340,
        "San Ramon": 340,
        "Danville": 340,
        "Alamo": 340,
        "Walnut Creek": 340,
        "Pleasant Hill": 340,
        "Concord": 340,
        "Pittsburg": 340,
        "Antioch": 340,
        "Brentwood": 365,
        "Oakland": 340,
        "Hayward": 340,
        "Fremont": 340,
        "San Leandro": 340,
        "Castro Valley": 340,
        "Union City": 340,
        "Newark": 340,
        "Alameda": 340,
        "Berkeley": 340,
        "Emeryville": 340,
        "Richmond": 340,
        "El Cerrito": 340,
        "Martinez": 340,
        "Lafayette": 340,
        "Orinda": 340,
        "Oakley": 340,
        "Corte Madera": 340,
        "Vallejo": 340,
        "Fairfield": 340,
        "Sacramento": 380,
        "Folsom": 340,
        "Elk Grove": 340,
        "Roseville": 340,
        "Rancho Cordova": 340,
        "Citrus Heights": 340,
        "Rocklin": 340,
      },
      features: [
        "✔️ Split into two sessions on different days",
        "✔️ Pick-up and drop-off included",
        "✔️ Start driving from a parking lot or quiet residential area",
        "✔️ Comprehensive explanation of primary driving rules",
        "✔️ Practice stop signs, lane changing, traffic lights, and more",
      ],
    },
    {
      title: "Behind The Wheel Training Package: 6 Hours",
      type: "TRAINING",
      sessions: 3,
      popular: false,
      cities: {
        "San Francisco": 590,
        "Daly City": 550,
        "Livermore": 500,
        "Pleasanton": 500,
        "Dublin": 500,
        "San Ramon": 500,
        "Danville": 500,
        "Alamo": 500,
        "Walnut Creek": 500,
        "Pleasant Hill": 500,
        "Concord": 500,
        "Pittsburg": 500,
        "Antioch": 500,
        "Brentwood": 545,
        "Oakland": 500,
        "Hayward": 500,
        "Fremont": 500,
        "San Leandro": 500,
        "Castro Valley": 500,
        "Union City": 500,
        "Newark": 500,
        "Alameda": 500,
        "Berkeley": 500,
        "Emeryville": 500,
        "Richmond": 500,
        "El Cerrito": 500,
        "Martinez": 500,
        "Lafayette": 500,
        "Orinda": 500,
        "Oakley": 500,
        "Corte Madera": 500,
        "Vallejo": 500,
        "Fairfield": 500,
        "Sacramento": 550,
        "Folsom": 500,
        "Elk Grove": 500,
        "Roseville": 500,
        "Rancho Cordova": 500,
        "Citrus Heights": 500,
        "Rocklin": 500,
      },
      features: [
        "✔️ Split into three sessions on different days",
        "✔️ Pick-up and drop-off included",
        "✔️ Comprehensive explanation of primary driving rules",
        "✔️ Start driving from a parking lot or quiet residential area",
        "✔️ Practice stop signs, lane changing, traffic lights, and more",
        "✔️ 15-minute freeway practice",
        "✔️ DMV-required certificate for teens",
      ],
    },
    {
      title: "DMV Behind-The-Wheel Road Test (2 Hours)",
      type: "DMV",
      sessions: 1,
      popular: false,
      cities: {
        "San Francisco": 300,
        "Daly City": 300,
        "Livermore": 250,
        "Pleasanton": 250,
        "Dublin": 250,
        "San Ramon": 250,
        "Danville": 250,
        "Alamo": 250,
        "Walnut Creek": 250,
        "Pleasant Hill": 250,
        "Concord": 250,
        "Pittsburg": 250,
        "Antioch": 250,
        "Brentwood": 250,
        "Oakland": 250,
        "Hayward": 250,
        "Fremont": 250,
        "San Leandro": 250,
        "Castro Valley": 250,
        "Union City": 250,
        "Newark": 250,
        "Alameda": 250,
        "Berkeley": 250,
        "Emeryville": 250,
        "Richmond": 250,
        "El Cerrito": 250,
        "Martinez": 250,
        "Lafayette": 250,
        "Orinda": 250,
        "Oakley": 250,
        "Corte Madera": 250,
        "Vallejo": 250,
        "Fairfield": 250,
        "Sacramento": 300,
        "Folsom": 250,
        "Elk Grove": 250,
        "Roseville": 250,
        "Rancho Cordova": 250,
        "Citrus Heights": 250,
        "Rocklin": 250,
      },
      features: [
        "✔️ 50-minute warm-up practice before DMV test",
        "✔️ DMV road test included",
        "✔️ Certified instructor guidance",
        "✔️ DMV-approved vehicle provided",
        "✔️ Pick-up and drop-off included",
      ],
    },
    {
      title: "Mock Test (2 Hours)",
      type: "MOCK TEST",
      sessions: 1,
      popular: false,
      cities: flatCities(210),
      features: [
        "✔️ Simulated DMV road test conditions",
        "✔️ Detailed feedback after your mock test",
        "✔️ Certified instructor guidance",
        "✔️ Pick-up and drop-off included",
      ],
    },
    {
      title: "Behind The Wheel Training Package: 8 Hours",
      type: "TRAINING",
      sessions: 4,
      popular: false,
      cities: flatCities(640),
      features: [
        "✔️ Split into four sessions on different days",
        "✔️ Pick-up and drop-off included",
        "✔️ Comprehensive explanation of primary driving rules",
        "✔️ Practice stop signs, lane changing, traffic lights, and more",
        "✔️ Extended freeway and highway practice",
        "✔️ DMV-required certificate for teens",
      ],
    },
    {
      title: "3-Hour Combo Package",
      type: "COMBO",
      sessions: 1,
      popular: false,
      sessionDurationMinutes: 180,
      cities: flatCities(350),
      features: [
        "✔️ 2 hours of warm-up practice before your test",
        "✔️ DMV road test included",
        "✔️ Certified instructor guidance",
        "✔️ DMV-approved vehicle provided",
        "✔️ Pick-up and drop-off included",
      ],
    },
  ];

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
