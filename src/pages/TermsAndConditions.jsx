import infoStyles from "../styles/InfoPage.module.css";
// Reuses PrivacyPolicy's generic legal-text styles (text/list/subHeading) —
// the class names aren't privacy-specific, so a separate near-identical CSS
// file isn't needed for this page.
import styles from "../styles/PrivacyPolicy.module.css";
import SEOHead from "../components/SEOHead";
import { buildBreadcrumbSchema } from "../lib/structuredData";

// Terms and Conditions — shown at /terms-and-conditions. Linked from the
// booking form's "Terms and Conditions" checkbox (BookingPage.jsx) and the
// footer.
export default function TermsAndConditions() {
  return (
    <div className={infoStyles.page}>
      <SEOHead
        title="Terms and Conditions | Best Driving School"
        description="Policies and regulations for driving lessons with Best Driving School, including safety responsibilities, instructor intervention, and our cancellation policy."
        path="/terms-and-conditions"
        structuredData={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms and Conditions", path: "/terms-and-conditions" },
        ])}
      />

      {/* ── Hero ── */}
      <section className={infoStyles.hero}>
        <p className={infoStyles.heroEyebrow}>Legal</p>
        <h1 className={infoStyles.heroHeading}>
          Terms and <span>Conditions</span>
        </h1>
        <p className={infoStyles.heroSub}>Policies and Regulations</p>
      </section>

      {/* ── Content ── */}
      <div className={infoStyles.content}>
        <h2 className={infoStyles.sectionHeading}>1. Valid Permit/License</h2>
        <p className={styles.text}>
          The student must possess a valid California instruction permit or driver's license,
          as applicable, and must present it before beginning behind-the-wheel instruction. For
          minors, the instruction permit must be validated as required by California DMV before
          practice driving outside professional instruction.
        </p>

        <h2 className={infoStyles.sectionHeading}>2. Student Safety Responsibilities</h2>
        <p className={styles.text}>
          The student agrees to follow the instructor's directions and all California traffic
          laws. The student must not intentionally engage in unsafe or dangerous conduct,
          including excessive speeding, reckless steering, ignoring traffic controls,
          intentionally disregarding instructor directions, or any action that creates an
          immediate danger to the student, instructor, passengers, pedestrians, or other road
          users.
        </p>

        <h2 className={infoStyles.sectionHeading}>3. Instructor Emergency Intervention</h2>
        <p className={styles.text}>
          The student understands that driving instruction involves real-world traffic
          conditions. If the instructor reasonably believes immediate intervention is necessary
          to prevent a collision or other dangerous situation, the instructor may use the
          instructor brake, take or assist control of the steering wheel, give urgent verbal
          instructions, or take other reasonable safety measures necessary to protect persons or
          property.
        </p>

        <h2 className={infoStyles.sectionHeading}>4. Right to Stop the Lesson</h2>
        <p className={styles.text}>
          The student may tell the instructor at any time if they are uncomfortable or need the
          vehicle stopped at a safe location. The student should immediately report any concern
          regarding an instructor's behavior or physical contact to Best Driving School
          management.
        </p>

        <h2 className={infoStyles.sectionHeading}>5. Instructor's Right to Terminate an Unsafe Lesson</h2>
        <p className={styles.text}>
          The instructor may pull over and suspend or terminate a lesson when the student
          refuses safety instructions, repeatedly operates the vehicle dangerously, appears
          impaired, becomes threatening or abusive, or the instructor reasonably determines that
          continuing the lesson would create an unacceptable safety risk.
        </p>

        <h2 className={infoStyles.sectionHeading}>6. Training Vehicle &amp; Insurance</h2>
        <p className={styles.text}>
          Vehicles used for instruction will meet applicable California DMV requirements,
          including required instructor controls, additional rear-view mirror, applicable
          liability insurance, and required vehicle safety inspection.
        </p>

        <h2 className={infoStyles.sectionHeading}>7. Collision/Accident Procedure</h2>
        <p className={styles.text}>
          If a collision occurs, the student must follow the instructor's safety directions and
          cooperate with reasonable accident documentation and reporting procedures.
        </p>

        <h2 className={infoStyles.sectionHeading}>8. Seat Belts/Phones/Impairment</h2>
        <p className={styles.text}>
          Seat belts must be worn during training. Students may not use a handheld phone while
          driving and may not participate in training while impaired by alcohol, cannabis,
          illegal drugs, or any substance or condition that makes driving unsafe.
        </p>

        <h2 className={infoStyles.sectionHeading}>9. Professional Conduct &amp; Zero-Tolerance Policy</h2>
        <p className={styles.text}>
          Students and instructors must maintain professional and respectful behavior. Sexual
          harassment, inappropriate touching, threats, discrimination, violence, or other
          inappropriate conduct is prohibited.
        </p>

        <h2 className={infoStyles.sectionHeading}>10. School-Initiated Cancellation &amp; Rescheduling Policy</h2>
        <p className={styles.text}>
          Best Driving School reserves the right to cancel or reschedule any driving lesson due
          to unforeseen circumstances, including but not limited to instructor unavailability,
          scheduling conflicts, technical difficulties, vehicle maintenance or mechanical
          issues, unsafe weather conditions, emergencies, or other operational reasons.
        </p>
        <p className={styles.text}>If a lesson is canceled by Best Driving School:</p>
        <ul className={styles.list}>
          <li>Students will be notified as soon as reasonably possible.</li>
          <li>
            The canceled lesson will be rescheduled at no additional charge, based on instructor
            availability and the student's preferred schedule.
          </li>
          <li>
            If rescheduling is not possible, students may request a refund for the canceled
            lesson or any unused portion of their prepaid package.
          </li>
          <li>
            No cancellation or rescheduling fee will be charged to the student for cancellations
            initiated by the school.
          </li>
        </ul>

        <div className={infoStyles.infoBox}>
          <p>
            <strong>Important Notice:</strong> Best Driving School is not responsible for
            indirect expenses or inconveniences resulting from a canceled lesson, including
            missed work, transportation expenses, or changes to personal schedules, to the
            extent permitted by applicable law.
          </p>
        </div>
      </div>
    </div>
  );
}
