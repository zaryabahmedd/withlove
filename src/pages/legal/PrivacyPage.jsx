import { useEffect } from 'react'
import styles from './LegalPage.module.css'

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <header id="privacy" className={styles.hero}>
          <span className={styles.badge}>Privacy</span>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: March 14, 2026</p>
        </header>

        <article className={styles.card}>
          <section className={styles.section}>
            <h2>Information we collect</h2>
            <p>
              When you create and share a card, we store the information you provide such as
              recipient name, sender name, message, selected template, color choices, and media uploads.
            </p>
            <p>
              We also create a guest session so the app works smoothly even if you are not logged in.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How we use your information</h2>
            <ul>
              <li>To generate and deliver your shareable card link.</li>
              <li>To host uploaded media (images, videos, and audio) needed for your card.</li>
              <li>To keep links active for the configured period and manage expiry.</li>
              <li>To improve reliability, performance, and user experience.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Card links and retention</h2>
            <p>
              Shared card links are designed to expire automatically after the configured validity period.
              At the moment, links are typically active for 30 days unless otherwise stated in the product.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Third-party services</h2>
            <p>
              We rely on trusted infrastructure providers to store data and media and to operate the platform.
              These providers process data only to support cardhazza services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your choices</h2>
            <p>
              You can choose what information to include in each card. Please avoid uploading sensitive personal
              information that is not necessary for your message.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
