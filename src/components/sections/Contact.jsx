import { motion } from 'framer-motion'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.glow} />
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className={styles.eyebrow}>✦ Ready to build?</p>
        <h2 className={styles.heading}>
          Start creating<br />
          <span className={styles.gradient}>something extraordinary</span>
        </h2>
        <p className={styles.sub}>
          Clone the repo, run <code>npm install</code>, and you're live in seconds.
        </p>

        <div className={styles.form}>
          <motion.input
            type="email"
            placeholder="your@email.com"
            className={styles.input}
            whileFocus={{ borderColor: 'rgba(124,58,237,0.8)', boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
          />
          <motion.button
            className={styles.btn}
            whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(124,58,237,0.7)' }}
            whileTap={{ scale: 0.97 }}
          >
            Get Early Access
          </motion.button>
        </div>

        <p className={styles.hint}>No spam. Unsubscribe any time.</p>
      </motion.div>

      <footer className={styles.footer}>
        <span>© 2026 Cardhazza. Built with React + Three.js + Framer Motion.</span>
      </footer>
    </section>
  )
}
