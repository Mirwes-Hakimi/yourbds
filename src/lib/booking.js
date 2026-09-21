// ─────────────────────────────────────────────────────────────
// booking.js — shared between BookingPage.jsx (submitting a new
// booking) and BookingSuccess.jsx (finishing a booking after online
// payment) — calendar sync, confirmation emails, and the date/time
// formatting both pages need identically.
// ─────────────────────────────────────────────────────────────

import emailjs from "@emailjs/browser";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  SCHOOL_NOTIFY_EMAIL,
} from "../emailjs.config";

export const STUDENT_STATE = "California";
export const STUDENT_COUNTRY = "United States";
export const PAYMENT_METHOD_LABEL_LATER = "Pay at session (no payment collected at booking)";
export const PAYMENT_METHOD_LABEL_ONLINE = "Paid online at booking";

// Rejects with `message` if `promise` hasn't settled within `ms` — so a
// slow/stuck network call can never leave a button/page stuck forever.
export const withTimeout = (promise, ms, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);

// Format a "HH:MM" 24-hour string as "8:00 AM" for display
export const formatTime12 = (timeStr) => {
  if (!timeStr) return "TBD";
  const [hh, mm] = timeStr.split(":");
  const d = new Date();
  d.setHours(parseInt(hh, 10));
  d.setMinutes(parseInt(mm, 10));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// Turns a booking's sessions into "Session 1: Mon Apr 14, 10:00 AM to 12:00 PM" lines
export const buildSessionsText = (sessions) =>
  sessions
    .map((s, i) => {
      const dateLabel = s.date ? new Date(s.date + "T00:00:00").toDateString() : "TBD";
      return `Session ${i + 1}: ${dateLabel}, ${formatTime12(s.startTime)} to ${formatTime12(s.endTime)}`;
    })
    .join("\n");

// Creates one Google Calendar event (via the createBooking Cloud Function)
// for a single session. Best effort — a failure here never blocks the
// booking itself, since Firestore is already the source of truth by the
// time this runs.
export const syncSessionToCalendar = async (session, sessionNumber, bookingInfo) => {
  const functionUrl = import.meta.env.VITE_CALENDAR_FUNCTION_URL;
  if (!functionUrl) {
    console.error("VITE_CALENDAR_FUNCTION_URL is not set — skipping calendar sync.");
    return { status: "error" };
  }

  const payload = {
    sessionNumber,
    studentName: bookingInfo.studentName,
    studentEmail: bookingInfo.studentEmail,
    parentName: bookingInfo.parentName || undefined,
    dob: bookingInfo.dob,
    address: bookingInfo.address,
    city: bookingInfo.city,
    state: STUDENT_STATE,
    zip: bookingInfo.zip,
    country: STUDENT_COUNTRY,
    phone: bookingInfo.phone,
    parentPhone: bookingInfo.parentPhone || undefined,
    packageTitle: bookingInfo.packageTitle,
    // Lets the calendar function tailor the event notes (e.g. no training
    // break policy on a DMV road test day).
    packageType: bookingInfo.packageType || undefined,
    price: bookingInfo.price,
    // Which DMV the road test is at — shown in the calendar event title.
    dmvLocation: bookingInfo.dmvLocation || undefined,
    appointmentDate: session.date,
    appointmentTime: formatTime12(session.startTime),
    paymentMethod: bookingInfo.paymentMethod,
    // Local datetime, no offset — the function pairs this with an IANA
    // timeZone so Google resolves PDT/PST correctly for this exact date.
    startDateTime: `${session.date}T${session.startTime}:00`,
    endDateTime: `${session.date}T${session.endTime}:00`,
  };

  try {
    const response = await withTimeout(
      fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      15000,
      "Calendar sync timed out"
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `Calendar sync failed (${response.status})`);
    }

    const { htmlLink } = await response.json();
    return { status: "success", htmlLink };
  } catch (err) {
    console.error(`Calendar sync failed for session ${sessionNumber}:`, err);
    return { status: "error" };
  }
};

// Sends the booking confirmation email to both the customer and the
// school — best effort, failures are just logged (never blocks the UI).
export const sendBookingEmails = async ({ toEmail, ...emailFields }) => {
  const [customerResult, schoolResult] = await Promise.allSettled([
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { ...emailFields, to_email: toEmail },
      EMAILJS_PUBLIC_KEY
    ),
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { ...emailFields, to_email: SCHOOL_NOTIFY_EMAIL },
      EMAILJS_PUBLIC_KEY
    ),
  ]);

  if (customerResult.status === "rejected") {
    console.error("Customer confirmation email failed:", customerResult.reason);
  }
  if (schoolResult.status === "rejected") {
    console.error("School notification email failed:", schoolResult.reason);
  }
};
