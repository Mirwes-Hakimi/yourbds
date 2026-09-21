import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";       // get logged-in user
import { signOut } from "firebase/auth";                  // firebase sign out
import { auth } from "../firebase";                       // firebase auth
import { db } from "../firestore";                        // firestore database
import { motion } from "framer-motion";

// Extract motion.h1 into a named variable so ESLint recognizes it as used
const MotionH1 = motion.h1;
import CallbackButton from "../components/CallbackButton";
import styles from "../styles/Home.module.css";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import {
  collection,   // reference to a firestore collection
  query,        // build a filtered query
  where,        // filter condition
  orderBy,      // sort results
  getDocs,      // fetch documents once (not real-time)
} from "firebase/firestore";

export default function Home() {
  const { user } = useAuth();                             // currently logged-in user

  // --- booking state ---
  const [bookings, setBookings] = useState([]);           // array of booking objects
  const [loading, setLoading] = useState(true);           // true while fetching
  const [error, setError] = useState("");                 // error message if fetch fails

  // Fetch this user's bookings from Firestore when the component mounts
  useEffect(() => {
    // If somehow there's no user, stop here
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        // Build query: bookings where userId == current user, newest first
        const q = query(
          collection(db, "bookings"),           // target the "bookings" collection
          where("userId", "==", user.uid),      // only this user's bookings
          orderBy("createdAt", "desc")          // most recent booking at the top
        );

        const snapshot = await getDocs(q);      // run the query

        // Map each Firestore doc into a plain object with an id field
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,                           // Firestore document ID
          ...doc.data(),                        // all the booking fields
        }));

        setBookings(results);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load your bookings. Please try again later.");
      } finally {
        setLoading(false);                      // done loading either way
      }
    };

    fetchBookings();
  }, [user]); // re-run if the logged-in user changes

  const handleLogout = () => {
    signOut(auth);                              // sign the user out of Firebase
  };

  // Helper: format a "YYYY-MM-DD" date string into something readable
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day); // month is 0-indexed in JS
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper: format "HH:MM" into "12:30 PM" style
  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [hh, mm] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hh, 10));
    date.setMinutes(parseInt(mm, 10));
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className={styles.container}>
      {/* Logged-in dashboard has no unique search-relevant content — keep it out of search results */}
      <SEOHead title="My Bookings | Best Driving School" description="View and manage your driving lesson bookings." path="/dashboard" noindex />
      {/* Top-right logout section */}
      <div className={styles.logoutSection}>
        {user && (
          <>
            <p className={styles.logoutText}>Logged in as: {user.email}</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* Animated welcome heading */}
      <MotionH1
        className={styles.heading}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Best Driving School
      </MotionH1>

      <p className={styles.subText}>
        Learn safe driving from the best instructors. Choose your package now.
      </p>

      <a
        href="https://www.dmv.ca.gov/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.dmvLink}
      >
        Visit DMV site
      </a>

      <CallbackButton />

      <Link to="/packages" className={styles.viewPackagesLink}>
        View Packages
      </Link>

      {/* ── My Bookings Section ── */}
      <section className={styles.bookingsSection}>
        <h2 className={styles.bookingsHeading}>My Bookings</h2>

        {/* Loading state */}
        {loading && <p className={styles.statusText}>Loading your bookings...</p>}

        {/* Error state */}
        {!loading && error && <p className={styles.errorText}>{error}</p>}

        {/* Empty state — no bookings yet */}
        {!loading && !error && bookings.length === 0 && (
          <p className={styles.statusText}>
            You have no bookings yet.{" "}
            <Link to="/packages" className={styles.inlineLink}>
              Browse packages
            </Link>
          </p>
        )}

        {/* Booking cards */}
        {!loading && !error && bookings.length > 0 && (
          <div className={styles.bookingsList}>
            {bookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                {/* Package title and status badge side by side */}
                <div className={styles.cardHeader}>
                  <h3 className={styles.packageTitle}>{booking.package}</h3>
                  {/* Status badge: "pending", "confirmed", etc. */}
                  <span className={`${styles.badge} ${styles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                {/* City and price summary */}
                <p className={styles.cardMeta}>
                  <strong>City:</strong> {booking.city} &nbsp;|&nbsp;
                  <strong>Price:</strong> ${booking.price} &nbsp;|&nbsp;
                  <strong>Payment:</strong>{" "}
                  {booking.paymentStatus === "paid" ? "Paid" : "Due at session"}
                </p>

                {/* Sessions list */}
                <div className={styles.sessionsBlock}>
                  <p className={styles.sessionsLabel}>Sessions:</p>
                  {booking.sessions && booking.sessions.length > 0 ? (
                    <ul className={styles.sessionList}>
                      {booking.sessions.map((s, i) => (
                        <li key={i} className={styles.sessionItem}>
                          Session {i + 1}: {formatDate(s.date)} &nbsp;
                          {formatTime(s.startTime)} – {formatTime(s.endTime)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.statusText}>No sessions recorded.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
