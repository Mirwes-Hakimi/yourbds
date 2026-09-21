// ─────────────────────────────────────────────────────────────
// google-calendar.js — server-only. Never import this from client code.
//
// Authenticates as a Google Workspace service account with domain-wide
// delegation (JWT impersonation) and creates a Calendar event for a
// booking, inviting the student so Google emails them the invite.
//
// Credentials come from environment variables ONLY — never hardcode them.
// In production these are Firebase secrets, bound as env vars at runtime
// by the `secrets: [...]` option on the function in index.js.
// ─────────────────────────────────────────────────────────────

// Using the dedicated @googleapis/calendar + google-auth-library packages
// instead of the full `googleapis` mega-package — that package bundles
// every Google API's type definitions and is large enough on its own to
// risk blowing past Firebase's 10-second "analyze the function file"
// timeout during `firebase deploy` ("Cannot determine backend
// specification. Timeout after 10000."). On top of that, both packages
// are imported dynamically (below, inside the functions that use them)
// instead of statically at the top of the file — that way Firebase's
// deploy-time analysis of index.js never has to load them at all, and
// only pays that cost on the first real booking request.
import {
  CANCELLATION_POLICY,
  EVENT_TYPE_DESCRIPTION,
  SESSION_BREAK_POLICY,
} from "./bookingPolicies.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TIME_ZONE = "America/Los_Angeles"; // IANA zone — handles PDT/PST automatically

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Builds the domain-wide-delegation JWT client. `subject` is the Workspace
// user the service account impersonates — this is what lets a service
// account (which normally can't invite attendees) send real invites.
async function buildJwtClient() {
  const email = requireEnv("GOOGLE_CLIENT_EMAIL");
  // .env files / secret managers can't store literal newlines, so private
  // keys are stored with escaped "\n" sequences that need to be restored.
  // Also strip a leading UTF-8 BOM and surrounding whitespace — invisible
  // in any editor, but enough to make OpenSSL reject an otherwise-valid
  // PEM key with a cryptic "DECODER routines::unsupported" error.
  const key = requireEnv("GOOGLE_PRIVATE_KEY")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/\\n/g, "\n");
  const subject = requireEnv("GOOGLE_IMPERSONATE_EMAIL");

  const { JWT } = await import("google-auth-library");
  return new JWT({ email, key, scopes: SCOPES, subject });
}

function buildDescription(booking) {
  const {
    studentName,
    studentEmail,
    parentName,
    dob,
    address,
    city,
    state,
    zip,
    country,
    phone,
    parentPhone,
    packageTitle,
    packageType,
    price,
    dmvLocation,
    appointmentDate,
    appointmentTime,
    paymentMethod,
  } = booking;

  return [
    `Invitee name: ${studentName}`,
    `Invitee email: ${studentEmail}`,
    `Parent/guardian: ${parentName || "Not provided"}`,
    `Date of birth: ${dob}`,
    `Address: ${address}`,
    `City: ${city}`,
    `State: ${state}`,
    `Zip Code: ${zip}`,
    `Country: ${country}`,
    `Student Number: ${phone}`,
    `Phone Number: ${parentPhone || "Not provided"}`,
    `Package: ${packageTitle} — $${price}`,
    ...(dmvLocation ? [`DMV test location: ${dmvLocation}`] : []),
    `Appointment: ${appointmentDate} at ${appointmentTime}`,
    `Payment method: ${paymentMethod}`,
    "",
    "— Cancellation Policy —",
    CANCELLATION_POLICY,
    "",
    "— About This Event —",
    EVENT_TYPE_DESCRIPTION,
    // The 5-minute break applies to training sessions, not to a DMV road
    // test day, so it's left out of DMV package events.
    ...(packageType === "DMV"
      ? []
      : ["", "— Session Break Policy —", SESSION_BREAK_POLICY]),
  ].join("\n");
}

// booking.startDateTime / endDateTime must be LOCAL datetime strings with
// no "Z" and no UTC offset, e.g. "2026-08-01T14:00:00" — paired with
// timeZone below, Google resolves DST correctly for that exact date
// instead of a fixed offset that would be wrong half the year.
export async function createBookingEvent(booking) {
  const calendarId = requireEnv("GOOGLE_CALENDAR_ID");
  const auth = await buildJwtClient();
  const { calendar } = await import("@googleapis/calendar");
  const calendarClient = calendar({ version: "v3", auth });

  // For road-test packages the student says which DMV they're testing at,
  // and it goes in the title, e.g. "Session 1: El Cerrito DMV - Jane Doe &
  // Best Driving School". Students type this freely, so add " DMV" if they
  // wrote just the city ("El Cerrito"), and skip it entirely if left blank.
  const dmv = (booking.dmvLocation || "").trim();
  const dmvLabel = dmv && !/dmv/i.test(dmv) ? `${dmv} DMV` : dmv;
  const dmvPrefix = dmvLabel ? `${dmvLabel} - ` : "";

  const requestBody = {
    summary: `Session ${booking.sessionNumber}: ${dmvPrefix}${booking.studentName} & Best Driving School`,
    location: booking.address,
    description: buildDescription(booking),
    start: { dateTime: booking.startDateTime, timeZone: TIME_ZONE },
    end: { dateTime: booking.endDateTime, timeZone: TIME_ZONE },
    attendees: [{ email: booking.studentEmail }],
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 30 }],
    },
  };

  const response = await calendarClient.events.insert({
    calendarId,
    sendUpdates: "all", // emails the student the invite
    requestBody,
  });

  return { eventId: response.data.id, htmlLink: response.data.htmlLink };
}
