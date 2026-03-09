import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './HomeStory.module.css'

const STATS = [
  { num: '2.4M+', label: 'Cards sent' },
  { num: '190+',  label: 'Countries' },
  { num: '99%',   label: 'Recommend' },
  { num: '$0',    label: 'To start'  },
]

export default function HomeStory() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left: Large typographic statement */}
          <motion.div
            className={styles.quoteSide}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.bigQuote}>
              The people you love deserve
              <span className={styles.quoteAccent}> more than a text.</span>
            </h2>
          </motion.div>

          {/* Right: Body text + stats */}
          <motion.div
            className={styles.bodySide}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.body}>
              cardhazza was born from one belief: the people you love deserve more
              than a four-word text. We built a space where your words, your warmth,
              and your personality arrive in one beautiful card — ready to open, save,
              and treasure forever.
            </p>
            <p className={styles.body}>
              From birthdays to promotions, condolences to just-because — every
              occasion deserves something that actually means something.
            </p>

            <div className={styles.statsRow}>
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className={styles.stat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                >
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values strip */}
        <motion.div
          className={styles.valuesStrip}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[
            { icon: '♡', label: 'Made with heart', color: '#F4487A' },
            { icon: '✦', label: 'Beautifully simple', color: '#CC7A38' },
            { icon: '⊹', label: 'Always personal', color: '#2BBFA4' },
          ].map((v) => (
            <div key={v.label} className={styles.value}>
              <span className={styles.valueIcon} style={{ color: v.color }}>{v.icon}</span>
              <span className={styles.valueLabel}>{v.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
