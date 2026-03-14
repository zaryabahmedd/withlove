import styles from './LegalPage.module.css'

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <header className={styles.hero}>
          <span className={styles.badge}>Terms</span>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.updated}>Last updated: March 14, 2026</p>
        </header>

        <article className={styles.card}>
          <section className={styles.section}>
            <h2>Acceptance of terms</h2>
            <p>
              By using cardhazza, you agree to these Terms and Conditions and our Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Use of the service</h2>
            <p>
              cardhazza lets you create and share digital cards with text and media. You are responsible
              for the content you upload and share.
            </p>
            <ul>
              <li>Do not upload unlawful, abusive, or harmful content.</li>
              <li>Do not infringe copyrights, trademarks, or privacy rights.</li>
              <li>Do not misuse the platform or attempt unauthorized access.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Content ownership and license</h2>
            <p>
              You keep ownership of the content you create. You grant us permission to host, process,
              and display that content only as needed to provide card sharing functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Availability and changes</h2>
            <p>
              We may update, improve, or discontinue features at any time. We do our best to keep the
              service available but cannot guarantee uninterrupted operation.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Link expiry and limits</h2>
            <p>
              Shared links can expire based on product settings. Expiry periods and limits may change as
              the service evolves.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
