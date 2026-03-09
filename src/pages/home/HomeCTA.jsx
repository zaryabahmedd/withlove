import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './HomeCTA.module.css'

export default function HomeCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <div className={styles.inner}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          ✨ Ready to spread some love?
        </motion.span>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Create your first card
          <br />
          <span className={styles.headingGold}>in under 30 seconds</span>
        </motion.h2>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          No sign-up required. Pick a design, write your heart out,
          and share it with anyone, anywhere.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.button
            className={styles.primaryBtn}
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(244,72,122,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={styles.btnShimmer} />
            ✦ Start Creating — It's Free
            <span className={styles.btnArrow}>→</span>
          </motion.button>

          <motion.button
            className={styles.ghostBtn}
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            See Examples
          </motion.button>
        </motion.div>

        <motion.p
          className={styles.trust}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Join <strong>50,000+</strong> happy card creators
        </motion.p>
      </div>
    </section>
  )
}
