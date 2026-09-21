import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { captureAttributionFromUrl } from "./lib/attribution";

// ── Pages ──
// PERFORMANCE: every page except the landing page is loaded with
// React.lazy(), so a visitor only downloads the code for the pages they
// actually open, instead of the whole site up front. The landing page stays
// a normal import because most visitors (and all ad clicks) arrive on it,
// so it should show instantly with no extra loading step.
import LandingPage    from "./pages/LandingPage";

const Login             = lazy(() => import("./pages/Login"));
const Signup            = lazy(() => import("./pages/Signup"));
const Packages          = lazy(() => import("./pages/Packages"));
const BookingPage       = lazy(() => import("./pages/BookingPage"));
const BookingSuccess    = lazy(() => import("./pages/BookingSuccess")); // /booking-success — after Stripe "Pay Now" checkout
const Home              = lazy(() => import("./pages/Home"));           // user dashboard
const AdminPage         = lazy(() => import("./pages/AdminPage"));      // admin dashboard

// ── Info / content pages (navbar links) ──
const ServicesPage      = lazy(() => import("./pages/ServicesPage"));      // /services (hub)
const TeenCourse        = lazy(() => import("./pages/TeenCourse"));        // /services/teen-driving-lessons
const AdultCourse       = lazy(() => import("./pages/AdultCourse"));       // /services/adult-driving-lessons
const DmvInfo           = lazy(() => import("./pages/DmvInfo"));           // /services/dmv-test-preparation
const DmvCarRentalPage  = lazy(() => import("./pages/DmvCarRentalPage"));  // /services/dmv-test-car-rental
const LocationsPage     = lazy(() => import("./pages/LocationsPage"));     // /locations
const CityPage          = lazy(() => import("./pages/CityPage"));          // /locations/:citySlug
const AboutPage         = lazy(() => import("./pages/AboutPage"));         // /about
const FaqPage           = lazy(() => import("./pages/FaqPage"));           // /faq
const PermitPractice    = lazy(() => import("./pages/PermitPractice"));    // /practice
const NewDrivers        = lazy(() => import("./pages/NewDrivers"));        // /new-drivers
const DriverEd          = lazy(() => import("./pages/DriverEd"));          // /education
const ContactPage       = lazy(() => import("./pages/ContactPage"));       // /contact
const PrivacyPolicy     = lazy(() => import("./pages/PrivacyPolicy"));     // /privacy-policy
const GoRedirect        = lazy(() => import("./pages/GoRedirect"));        // /go/:slug — tracked partner-site redirects
const NotFound          = lazy(() => import("./pages/NotFound"));          // 404

// ── Route guards ──
import PrivateRoute   from "./components/PrivateRoute"; // requires login
import AdminRoute     from "./components/AdminRoute";   // requires admin email

// ── Shared layout ──
import Navbar         from "./pages/Navbar";
import Footer         from "./components/Footer";
import ScrollToTop    from "./components/ScrollToTop";

// A blank dark screen shown for the split second a page's code is loading
// (matches the site background so there's no white flash).
function PageLoading() {
  return <div style={{ minHeight: "60vh", background: "#000" }} aria-busy="true" />;
}

function App() {
  // Captures utm_source/medium/campaign/oppref from the landing URL, if
  // present, so it can be attached to a booking later even if the visitor
  // browses several pages first. See src/lib/attribution.js.
  useEffect(() => {
    captureAttributionFromUrl();
  }, []);

  // After a new version of the site is deployed, a tab that was left open
  // still points at the OLD page files, which no longer exist. Vite fires
  // "vite:preloadError" when that happens; reloading once fetches the new
  // version. The sessionStorage flag prevents an endless reload loop.
  useEffect(() => {
    const onPreloadError = () => {
      try {
        if (sessionStorage.getItem("reloadedForNewVersion")) return;
        sessionStorage.setItem("reloadedForNewVersion", "1");
      } catch {
        return;
      }
      window.location.reload();
    };
    window.addEventListener("vite:preloadError", onPreloadError);
    return () => window.removeEventListener("vite:preloadError", onPreloadError);
  }, []);

  return (
    <Router>
      {/* Resets scroll position to the top on every route change */}
      <ScrollToTop />

      {/* Navbar is always visible on every page */}
      <Navbar />

      <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* ── Public routes — anyone can visit ── */}
        <Route path="/"             element={<LandingPage />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/signup"       element={<Signup />} />
        <Route path="/packages"     element={<Packages />} />

        {/* ── Services (linked from navbar Services dropdown) ── */}
        <Route path="/services"                             element={<ServicesPage />} />
        <Route path="/services/teen-driving-lessons"        element={<TeenCourse />} />
        <Route path="/services/adult-driving-lessons"       element={<AdultCourse />} />
        <Route path="/services/dmv-test-preparation"        element={<DmvInfo />} />
        <Route path="/services/dmv-test-car-rental"         element={<DmvCarRentalPage />} />

        {/* Old URLs redirect to their new /services/* home — keeps any
            existing bookmarks/links working instead of 404ing. */}
        <Route path="/teen-course"  element={<Navigate to="/services/teen-driving-lessons" replace />} />
        <Route path="/adult-course" element={<Navigate to="/services/adult-driving-lessons" replace />} />
        <Route path="/dmv"          element={<Navigate to="/services/dmv-test-preparation" replace />} />

        <Route path="/locations"    element={<LocationsPage />} />
        {/* One template for every city page — content comes from src/data/cityPages.js */}
        <Route path="/locations/:citySlug" element={<CityPage />} />
        <Route path="/about"        element={<AboutPage />} />
        <Route path="/faq"          element={<FaqPage />} />
        <Route path="/practice"     element={<PermitPractice />} />
        <Route path="/new-drivers"  element={<NewDrivers />} />
        <Route path="/education"    element={<DriverEd />} />
        <Route path="/contact"      element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Booking is open to guests too — signing up is optional */}
        <Route path="/booking"         element={<BookingPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        {/* Tracked redirects to partner sites — see src/pages/GoRedirect.jsx */}
        <Route path="/go/:slug" element={<GoRedirect />} />

        {/* ── Protected routes — must be logged in ── */}
        <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />

        {/* ── Admin-only route — redirects non-admins to /dashboard ── */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

        {/* ── 404 fallback — catches any unknown URL ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>

      {/* Footer is always visible on every page, same as Navbar */}
      <Footer />
    </Router>
  );
}

export default App;
