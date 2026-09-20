import { ZELLE } from "../siteConfig";
import styles from "../styles/ZelleInfo.module.css";

// Zelle payment instructions — shown on the booking confirmation panel.
// Details come from ZELLE in src/siteConfig.js. Zelle can't be confirmed
// automatically (unlike Stripe), so we ask customers to put their name in
// the memo, which lets the owner match the payment to the booking.
//
// Props: amount — the price to send (optional, shown in the text).
export default function ZelleInfo({ amount }) {
  return (
    <div className={styles.box}>
      <p className={styles.title}>Prefer to pay with Zelle?</p>
      <p className={styles.text}>
        {amount ? `Send $${amount} ` : "Send your payment "}
        with Zelle to <strong>{ZELLE.email}</strong> ({ZELLE.recipientName}).
        Please put the student's name in the memo so we can match your payment.
      </p>

      {/* The QR is scanned from another device's bank app, so only show it
          when a picture has been added to /public (see ZELLE.qrImage). */}
      {ZELLE.qrImage && (
        <img
          src={ZELLE.qrImage}
          alt={`Zelle QR code for ${ZELLE.recipientName}`}
          className={styles.qr}
        />
      )}
    </div>
  );
}
