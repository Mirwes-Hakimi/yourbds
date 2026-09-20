import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { captureAttributionFromUrl } from "./lib/attribution";

// ── Core pages ──
import LandingPage    from "./pages/LandingPage";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import Packages       from "./pages/Packages";
import BookingPage    from "./pages/BookingPage";
import BookingSuccess from "./pages/BookingSuccess"; // /booking-success — after Stripe "Pay Now" checkout
import Home           from "./pages/Home";           // user dashboard
import AdminPage      from "./pages/AdminPage";      // admin dashboard

// ── Info / content pages (navbar links) ──
import ServicesPage     from "./pages/ServicesPage";     // /services (hub)
import TeenCourse       from "./pages/TeenCourse";       // /services/teen-driving-lessons
import AdultCourse      from "./pages/AdultCourse";      // /services/adult-driving-lessons
import DmvInfo          from "./pages/DmvInfo";          // /services/dmv-test-preparation
import DmvCarRentalPage from "./pages/DmvCarRentalPage"; // /services/dmv-test-car-rental
import LocationsPage    from "./pages/LocationsPage";    // /locations
import CityPage         from "./pages/CityPage";         // /locations/:citySlug
import AboutPage        from "./pages/AboutPage";        // /about
import FaqPage          from "./pages/FaqPage";          // /faq
import PermitPractice   from "./pages/PermitPractice";   // /practice
import NewDrivers       from "./pages/NewDrivers";       // /new-drivers
import DriverEd         from "./pages/DriverEd";         // /education
import ContactPage      from "./pages/ContactPage";      // /contact
import PrivacyPolicy    from "./pages/PrivacyPolicy";    // /privacy-policy
import GoRedirect        from "./pages/GoRedirect";       // /go/:slug — tracked partner-site redirects

// ── Utility pages ──
import NotFound       from "./pages/NotFound";       // 404

// ── Route guards ──
import PrivateRoute   from "./components/PrivateRoute"; // requires login
import AdminRoute     from "./components/AdminRoute";   // requires admin email

// ── Shared layout ──
import Navbar         from "./pages/Navbar";
import Footer         from "./components/Footer";
import ScrollToTop    from "./components/ScrollToTop";

function App() {
  // Captures utm_source/medium/campaign/oppref from the landing URL, if
  // present, so it can be attached to a booking later even if the visitor
  // browses several pages first. See src/lib/attribution.js.
  useEffect(() => {
    captureAttributionFromUrl();
  }, []);

  return (
    <Router>
      {/* Resets scroll position to the top on every route change */}
      <ScrollToTop />

      {/* Navbar is always visible on every page */}
      <Navbar />

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

      {/* Footer is always visible on every page, same as Navbar */}
      <Footer />
    </Router>
  );
}

export default App;
