import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useAuth } from "../components/AuthContext";
import {
  PAYMENT_METHOD_LABEL_ONLINE,
  formatTime12,
  buildSessionsText,
  syncSessionToCalendar,
  sendBookingEmails,
} from "../lib/booking";
import { trackAppointmentScheduled } from "../lib/adPixel";
import { trackGoogleAdsConversion } from "../lib/googleAdsPixel";
import styles from "../styles/BookingPage.module.css";
import SEOHead from "../components/SEOHead";

// Reached only via Stripe's success_url redirect after "Pay Now" checkout.
// The redirect itself is never trusted as proof of payment (a user could
// reload or share this URL without having paid) — this page polls the
// Firestore booking doc for `paymentStatus: "paid"`, which only the
// Stripe webhook (functions/index.js, verified server-side) ever sets.
// Once paid is confirmed, it runs the same calendar sync + confirmation
// emails the "pay later" flow runs immediately, gated behind
// `postPaymentProcessed` so a page refresh can't resend them.
export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [view, setView] = useState({ phase: "loading" });

  useEffect(() => {
    if (!bookingId) {
      setView({ phase: "error", message: "Missing booking reference." });
      return;
    }

    let cancelled = false;
    const bookingRef = doc(db, "bookings", bookingId);

    const finalizeBooking = async (data) => {
      const bookingInfo = {
        studentName: `${data.firstName} ${data.lastName}`,
        studentEmail: data.email,
        parentName: data.parentName,
        dob: data.dob,
        address: data.address,
        city: data.city,
        zip: data.zip,
        phone: data.phone,
        parentPhone: data.parentPhone,
        packageTitle: data.package,
        packageType: data.packageType,
        price: data.price,
        paymentMethod: PAYMENT_METHOD_LABEL_ONLINE,
        dmvLocation: data.dmvLocation || "",
      };

      const sessions = data.sessions || [];
      const sessionResults = await Promise.all(
        sessions.map((session, i) => syncSessionToCalendar(session, i + 1, bookingInfo))
      );

      await sendBookingEmails({
        toEmail: data.email,
        student_name: bookingInfo.studentName,
        package_title: data.package,
        city: data.city,
        price: data.price,
        sessions_text: buildSessionsText(sessions),
        payment_status_text: "Paid in full ✓",
      });

      await updateDoc(bookingRef, { postPaymentProcessed: true });

      return sessions.map((s, i) => ({
        sessionNumber: i + 1,
        date: s.date,
        time: formatTime12(s.startTime),
        status: sessionResults[i]?.status || "error",
        htmlLink: sessionResults[i]?.htmlLink,
      }));
    };

    // Stripe's webhook is usually near-instant, but it's a separate,
    // async server call — poll for a few seconds in case this page loads
    // slightly before it lands, rather than giving up immediately.
    const poll = async (attempt) => {
      let snap;
      try {
        snap = await getDoc(bookingRef);
      } catch (err) {
        if (!cancelled) setView({ phase: "error", message: err.message });
        return;
      }
      if (cancelled) return;

      if (!snap.exists()) {
        setView({ phase: "error", message: "We couldn't find that booking." });
        return;
      }

      const data = snap.data();

      if (data.paymentStatus === "paid") {
        if (data.postPaymentProcessed) {
          setView({ phase: "ready", booking: data, sessions: null });
          return;
        }

        setView({ phase: "finalizing" });
        try {
          const sessions = await finalizeBooking(data);
          // Fires exactly once per booking — this branch only runs the
          // first time payment is confirmed (see postPaymentProcessed
          // check above), never on a page refresh revisit.
          trackAppointmentScheduled(); // OpenAI Ads Manager conversion
          trackGoogleAdsConversion(Number(data.price)); // Google Ads conversion
          if (!cancelled) setView({ phase: "ready", booking: data, sessions });
        } catch (err) {
          console.error("Failed to finalize booking after payment:", err);
          if (!cancelled) {
            setView({
              phase: "ready",
              booking: data,
              sessions: null,
              finalizeError: true,
            });
          }
        }
        return;
      }

      if (attempt < 6) {
        setTimeout(() => {
          if (!cancelled) poll(attempt + 1);
        }, 1500);
      } else {
        setView({ phase: "pending" });
      }
    };

    poll(0);
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (view.phase === "loading" || view.phase === "finalizing") {
    return (
      <div className={styles.page}>
      <SEOHead title="Booking Confirmation | Best Driving School" description="Your driving lesson payment confirmation." path="/booking-success" noindex />
        <div className={styles.container}>
          <h2 className={styles.heading}>Confirming your payment…</h2>
          <p className={styles.summary}>This only takes a moment.</p>
        </div>
      </div>
    );
  }

  if (view.phase === "pending") {
    return (
      <div className={styles.page}>
      <SEOHead title="Booking Confirmation | Best Driving School" description="Your driving lesson payment confirmation." path="/booking-success" noindex />
        <div className={styles.container}>
          <h2 className={styles.heading}>Still confirming your payment…</h2>
          <p className={styles.summary}>
            Stripe is taking a bit longer than usual to confirm this. If you completed payment,
            it will finish automatically. Try refreshing this page in a moment.
          </p>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => window.location.reload()}
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view.phase === "error") {
    return (
      <div className={styles.page}>
      <SEOHead title="Booking Confirmation | Best Driving School" description="Your driving lesson payment confirmation." path="/booking-success" noindex />
        <div className={styles.container}>
          <h2 className={styles.heading}>Something went wrong</h2>
          <p className={styles.summary}>{view.message}</p>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.primaryBtn} onClick={() => navigate("/packages")}>
              Back to Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  // view.phase === "ready"
  const { booking, sessions, finalizeError } = view;
  return (
    <div className={styles.page}>
      <SEOHead title="Booking Confirmation | Best Driving School" description="Your driving lesson payment confirmation." path="/booking-success" noindex />
      <div className={styles.container}>
        <h2 className={styles.heading}>Payment Successful!</h2>
        <p className={styles.summary}>
          {booking.package} in <strong>{booking.city}</strong> &nbsp;·&nbsp; ${booking.price}{" "}
          &nbsp;·&nbsp; a confirmation email is on its way to {booking.email}
        </p>
        <p className={styles.payLaterNote}>Paid in full ✓</p>

        {finalizeError && (
          <p className={styles.cancelNotice}>
            Your payment succeeded, but we hit a snag confirming the calendar/email details.
            We'll follow up shortly to confirm your appointment.
          </p>
        )}

        <div className={styles.confirmSessions}>
          {(sessions || booking.sessions || []).map((s, i) => {
            const sessionNumber = s.sessionNumber || i + 1;
            const date = s.date;
            const time = s.time || formatTime12(s.startTime);
            return (
              <div key={sessionNumber} className={styles.confirmSessionRow}>
                <div>
                  <strong>Session {sessionNumber}</strong>
                  <span className={styles.confirmSessionWhen}>
                    {" "}— {date} at {time}
                  </span>
                </div>

                {sessions && s.status === "success" && (
                  <a
                    href={s.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.confirmStatusSuccess}
                  >
                    ✓ Added to calendar
                  </a>
                )}
                {sessions && s.status === "error" && (
                  <span className={styles.confirmStatusError}>
                    Couldn't auto-add to calendar, we'll confirm this manually
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => navigate(user ? "/dashboard" : "/")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
