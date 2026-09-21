import { useEffect, useState } from "react";
import {
  collection,  // reference to the bookings collection
  getDocs,     // fetch all documents at once
  doc,         // reference to a single document by ID
  updateDoc,   // update specific fields on a document
  deleteDoc,   // permanently delete a document
  orderBy,     // sort query results
  query,       // build a Firestore query
} from "firebase/firestore";
import { db } from "../firestore";
import styles from "../styles/AdminPage.module.css";
import SEOHead from "../components/SEOHead";

// The three statuses a booking can have
const STATUS_OPTIONS = ["pending", "confirmed", "cancelled"];

export default function AdminPage() {
  const [bookings,    setBookings]    = useState([]);   // all bookings from Firestore
  const [loading,     setLoading]     = useState(true); // true while first fetch is running
  const [error,       setError]       = useState("");   // error message if fetch fails
  const [filter,      setFilter]      = useState("all");// current status tab filter
  const [updating,    setUpdating]    = useState(null); // id of booking whose status is being saved
  const [deletingId,  setDeletingId]  = useState(null); // id of booking currently being deleted

  // ── Edit-session state ──
  const [editingId,   setEditingId]   = useState(null); // id of the booking open in edit mode
  const [editSessions,setEditSessions]= useState([]);   // local copy of sessions being edited
  const [saving,      setSaving]      = useState(false);// true while session edit is being saved

  // Fetch every booking ordered by newest first
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        // Turn each Firestore doc into a plain JS object, keeping its id
        setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Could not load bookings. Check your Firestore rules.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // empty array = run once when the component first mounts

  // ── Status change ──
  // Updates only the status field in Firestore, then mirrors the change locally
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      // Update local state so the UI reflects the change immediately without re-fetching
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // ── Delete booking ──
  // Permanently removes the booking from Firestore. Destructive and
  // irreversible, so it requires typed confirmation, not just a click.
  const handleDeleteBooking = async (booking) => {
    const confirmed = window.prompt(
      `This permanently deletes the booking for ${booking.firstName} ${booking.lastName} — this cannot be undone.\n\nType DELETE to confirm.`
    );
    if (confirmed !== "DELETE") return;

    setDeletingId(booking.id);
    try {
      await deleteDoc(doc(db, "bookings", booking.id));
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Could not delete this booking. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Open / close edit mode ──
  // When the admin clicks "Edit Sessions", we copy that booking's sessions
  // into local state so edits don't affect other cards until saved
  const openEdit = (booking) => {
    setEditingId(booking.id);
    // Deep-copy each session object so we don't mutate the original array
    setEditSessions(booking.sessions?.map((s) => ({ ...s })) || []);
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditSessions([]);
  };

  // Helper: given "HH:MM" add a number of minutes and return "HH:MM"
  const addMinutes = (timeStr, mins) => {
    if (!timeStr) return "";
    const [hh, mm] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(hh, 10));
    d.setMinutes(parseInt(mm, 10) + mins);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // Update a single field on a session inside editSessions
  const handleSessionFieldChange = (idx, field, value) => {
    setEditSessions((prev) => {
      const updated = prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
      // If the admin changed the start time, auto-calculate end time (+120 min)
      if (field === "startTime") {
        updated[idx].endTime = addMinutes(value, 120);
      }
      return updated;
    });
  };

  // Remove one session from the booking being edited. Requires confirmation
  // since it's destructive, and refuses to remove the last remaining
  // session — a booking should always have at least one.
  const handleRemoveSession = (idx) => {
    if (editSessions.length <= 1) {
      alert("A booking must have at least one session. Cancel the booking instead of removing its last session.");
      return;
    }
    if (!window.confirm(`Remove Session ${idx + 1}? This can't be undone.`)) {
      return;
    }
    setEditSessions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save the edited sessions back to Firestore
  const handleSaveSessions = async (bookingId) => {
    setSaving(true);
    try {
      // Write the updated sessions array to the booking document
      await updateDoc(doc(db, "bookings", bookingId), { sessions: editSessions });
      // Reflect the change locally so the card updates immediately
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, sessions: editSessions } : b
        )
      );
      closeEdit(); // exit edit mode
    } catch (err) {
      console.error("Failed to save sessions:", err);
      alert("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Display helpers ──
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [hh, mm] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(hh, 10));
    d.setMinutes(parseInt(mm, 10));
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  // Only show the bookings that match the selected filter tab
  const visibleBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // Count per status for the tab labels
  const counts = {
    all:       bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // Today's date as "YYYY-MM-DD" — used as min on date inputs
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.page}>
      {/* Admin-only dashboard — never indexed */}
      <SEOHead title="Admin Dashboard | Best Driving School" description="Manage bookings, sessions, and statuses." path="/admin" noindex />
      <div className={styles.container}>

        <h1 className={styles.heading}>Admin Dashboard</h1>
        <p className={styles.subHeading}>Manage all bookings, sessions, and statuses</p>

        {/* ── Filter tabs ── */}
        <div className={styles.tabs}>
          {["all", "pending", "confirmed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`${styles.tab} ${filter === tab ? styles.activeTab : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
              <span className={styles.tabCount}>{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* ── Loading / error / empty states ── */}
        {loading && <p className={styles.statusText}>Loading bookings...</p>}
        {!loading && error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && visibleBookings.length === 0 && (
          <p className={styles.statusText}>No bookings found.</p>
        )}

        {/* ── Booking cards ── */}
        {!loading && !error && visibleBookings.map((booking) => (
          <div key={booking.id} className={styles.card}>

            {/* Card header: name + status badge */}
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.name}>
                  {booking.firstName} {booking.lastName}
                </h2>
                <p className={styles.packageLabel}>{booking.package}</p>
                {booking.source && (
                  <p className={styles.sourceTag}>
                    Source: {booking.source}
                    {booking.medium ? ` / ${booking.medium}` : ""}
                    {booking.campaign ? ` / ${booking.campaign}` : ""}
                  </p>
                )}
              </div>
              <span className={`${styles.badge} ${styles[booking.status]}`}>
                {booking.status}
              </span>
            </div>

            {/* Student contact info */}
            <div className={styles.infoGrid}>
              <span><span className={styles.label}>Email</span>{booking.email}</span>
              <span><span className={styles.label}>Phone</span>{booking.phone}</span>
              {booking.parentPhone && (
                <span><span className={styles.label}>Parent/Guardian Phone</span>{booking.parentPhone}</span>
              )}
              <span><span className={styles.label}>City</span>{booking.city}</span>
              <span><span className={styles.label}>Price</span>${booking.price}</span>
              <span><span className={styles.label}>Payment</span>{
                booking.paymentStatus === "paid"
                  ? "Paid online"
                  : booking.paymentStatus === "pending_payment"
                  ? "Awaiting online payment"
                  : "Due at session"
              }</span>
              <span><span className={styles.label}>DOB</span>{booking.dob}</span>
              <span><span className={styles.label}>Address</span>{booking.address}</span>
              {booking.dmvLocation && (
                <span><span className={styles.label}>DMV test at</span>{booking.dmvLocation}</span>
              )}
            </div>

            {/* ── Sessions section ── */}
            <div className={styles.sessionsBlock}>
              <div className={styles.sessionsHeader}>
                <strong className={styles.sessionsTitle}>Sessions</strong>
                {/* Toggle edit mode for this booking's sessions */}
                {editingId !== booking.id ? (
                  <button
                    className={styles.editBtn}
                    onClick={() => openEdit(booking)}
                  >
                    ✏️ Edit Sessions
                  </button>
                ) : (
                  <button className={styles.cancelEditBtn} onClick={closeEdit}>
                    ✕ Cancel
                  </button>
                )}
              </div>

              {/* ── View mode: show sessions as read-only text ── */}
              {editingId !== booking.id && (
                <ul className={styles.sessionList}>
                  {booking.sessions?.map((s, i) => (
                    <li key={i} className={styles.sessionItem}>
                      <span className={styles.sessionNum}>Session {i + 1}</span>
                      {formatDate(s.date)} &nbsp;·&nbsp;
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </li>
                  ))}
                </ul>
              )}

              {/* ── Edit mode: show date + time inputs for each session ── */}
              {editingId === booking.id && (
                <div className={styles.editBlock}>
                  {editSessions.map((s, i) => (
                    <div key={i} className={styles.editSessionRow}>
                      <span className={styles.sessionNum}>Session {i + 1}</span>

                      {/* Date picker */}
                      <label className={styles.editLabel}>
                        Date
                        <input
                          type="date"
                          className={styles.editInput}
                          value={s.date || ""}
                          min={todayStr}
                          onChange={(e) =>
                            handleSessionFieldChange(i, "date", e.target.value)
                          }
                        />
                      </label>

                      {/* Start time — end time auto-calculates on change */}
                      <label className={styles.editLabel}>
                        Start Time
                        <input
                          type="time"
                          className={styles.editInput}
                          value={s.startTime || ""}
                          onChange={(e) =>
                            handleSessionFieldChange(i, "startTime", e.target.value)
                          }
                        />
                      </label>

                      {/* End time — read-only, auto-filled from start time */}
                      <label className={styles.editLabel}>
                        End Time
                        <input
                          type="time"
                          className={`${styles.editInput} ${styles.readOnly}`}
                          value={s.endTime || ""}
                          readOnly
                        />
                      </label>

                      <button
                        type="button"
                        className={styles.removeSessionBtn}
                        onClick={() => handleRemoveSession(i)}
                        title="Remove this session"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}

                  {/* Save / cancel buttons */}
                  <div className={styles.editActions}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleSaveSessions(booking.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button className={styles.cancelEditBtn} onClick={closeEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Status update row ── */}
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Change status:</span>
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleStatusChange(booking.id, option)}
                  // Disable the currently active status and while saving
                  disabled={booking.status === option || updating === booking.id}
                  className={`${styles.statusBtn} ${styles[option + "Btn"]}`}
                >
                  {updating === booking.id ? "Saving..." : option}
                </button>
              ))}

              <button
                onClick={() => handleDeleteBooking(booking)}
                disabled={deletingId === booking.id}
                className={styles.deleteBtn}
                title="Permanently delete this booking"
              >
                {deletingId === booking.id ? "Deleting..." : "🗑 Delete Permanently"}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
