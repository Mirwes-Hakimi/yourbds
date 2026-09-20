import React, { useState } from "react";
import styles from "../styles/Packages.module.css";
import { useNavigate } from "react-router-dom";
import { zipToCity } from "../data/locations";
import SEOHead from "../components/SEOHead";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "../lib/structuredData";

// Cities we serve — used to build a flat (same price everywhere) pricing
// table for packages that don't have per-city pricing data yet.
// NOTE: Hayward, Fremont and the newer East Bay / North Bay cities are priced
// like Oakland ($180 / $360 / $540 training, $250 DMV test). Business rule:
// no package should ever sell for less than $160 AFTER the promo discount
// below, so a 2-hour session must stay at $180 or more before the discount.
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
        "Livermore": 360,
        "Pleasanton": 360,
        "Dublin": 360,
        "San Ramon": 360,
        "Danville": 360,
        "Alamo": 360,
        "Walnut Creek": 360,
        "Pleasant Hill": 340,
        "Concord": 340,
        "Pittsburg": 340,
        "Antioch": 360,
        "Brentwood": 365,
        "Oakland": 360,
        "Hayward": 360,
        "Fremont": 360,
        "San Leandro": 360,
        "Castro Valley": 360,
        "Union City": 360,
        "Newark": 360,
        "Alameda": 360,
        "Berkeley": 360,
        "Emeryville": 360,
        "Richmond": 360,
        "El Cerrito": 360,
        "Martinez": 360,
        "Lafayette": 360,
        "Orinda": 360,
        "Oakley": 360,
        "Corte Madera": 360,
        "Vallejo": 360,
        "Fairfield": 360,
        "Sacramento": 380,
        "Folsom": 360,
        "Elk Grove": 360,
        "Roseville": 360,
        "Rancho Cordova": 360,
        "Citrus Heights": 360,
        "Rocklin": 360,
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
        "Livermore": 540,
        "Pleasanton": 540,
        "Dublin": 540,
        "San Ramon": 540,
        "Danville": 540,
        "Alamo": 540,
        "Walnut Creek": 540,
        "Pleasant Hill": 510,
        "Concord": 510,
        "Pittsburg": 540,
        "Antioch": 540,
        "Brentwood": 545,
        "Oakland": 540,
        "Hayward": 540,
        "Fremont": 540,
        "San Leandro": 540,
        "Castro Valley": 540,
        "Union City": 540,
        "Newark": 540,
        "Alameda": 540,
        "Berkeley": 540,
        "Emeryville": 540,
        "Richmond": 540,
        "El Cerrito": 540,
        "Martinez": 540,
        "Lafayette": 540,
        "Orinda": 540,
        "Oakley": 540,
        "Corte Madera": 540,
        "Vallejo": 540,
        "Fairfield": 540,
        "Sacramento": 550,
        "Folsom": 540,
        "Elk Grove": 540,
        "Roseville": 540,
        "Rancho Cordova": 540,
        "Citrus Heights": 540,
        "Rocklin": 540,
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
