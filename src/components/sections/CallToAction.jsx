import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './CallToAction.module.css'

/* ── Card images for the floating fan ── */
const FAN_CARDS = [
  '/1135w-mLorQish-ds.webp',
  '/1135w-N7NUFrSikUk.webp',
  '/1135w-SBcw_sc90lA.webp',
  '/1067w-GBL7tdP2B-A.jpg',
  '/1135w-AxrG3hmgGM0.webp',
]

/* ── Sparkle positions ── */
const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 5,
  dur: 2 + Math.random() * 3,
}))

/* ── Animated card fan ── */
function CardFan({ inView }) {
  return (
    <div className={styles.fanWrap}>
      {FAN_CARDS.map((src, i) => {
        const count = FAN_CARDS.length
        const half = Math.floor(count / 2)
        const offset = i - half
        const rotate = offset * 12
        const tx = offset * 28
        const ty = Math.abs(offset) * 8

        return (
          <motion.div
            key={i}
            className={styles.fanCard}
            initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.6 }}
            animate={inView ? {
              opacity: 1,
              y: -ty,
              rotate,
              x: tx,
              scale: 1,
            } : {}}
            transition={{
              delay: 0.2 + i * 0.08,
              duration: 0.7,
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
            whileHover={{
              y: -ty - 20,
              scale: 1.12,
              rotate: 0,
              zIndex: 20,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }}
          >
            <img src={src} alt="" className={styles.fanImg} draggable={false} />
            <div className={styles.fanShine} />
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── Ripple on button click ── */
function RippleButton({ children }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800)
  }

  return (
    <motion.button
      className={styles.ctaButton}
      onClick={handleClick}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 60px rgba(244, 72, 122, 0.5), 0 0 0 3px rgba(244, 72, 122, 0.15)',
      }}
      whileTap={{ scale: 0.97 }}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      {children}
    </motion.button>
  )
}

/* ── Main CTA Section ── */
export default function CallToAction() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <section className={styles.section} ref={ref}>
      {/* Sparkles */}
      <div className={styles.sparkleField}>
        {SPARKLES.map((s) => (
          <motion.div
            key={s.id}
            className={styles.sparkle}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.3, 0.5],
            }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className={styles.orbPink}
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={styles.orbPurple}
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className={styles.inner}>
        {/* Card fan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <CardFan inView={inView} />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          >
            ✨
          </motion.span>
          {' '}Ready to spread some love?
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Create your first card
          <br />
          <span className={styles.headingGrad}>in under 30 seconds</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className={styles.subtext}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          No sign-up required. Pick a design, write your heart out, and share it with anyone, anywhere.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className={styles.buttonRow}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <RippleButton onClick={() => navigate('/create')}>
            <span className={styles.btnIcon}>✦</span>
            Start Creating — It's Free
            <span className={styles.btnArrow}>→</span>
          </RippleButton>

          <motion.button
            className={styles.secondaryBtn}
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(244, 72, 122, 0.08)' }}
            whileTap={{ scale: 0.97 }}
          >
            See Examples
          </motion.button>
        </motion.div>

        {/* Trust signal */}
        <motion.div
          className={styles.trust}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className={styles.trustAvatars}>
            {['#F4487A', '#6C63FF', '#2BBFA4', '#FFD166'].map((c, i) => (
              <div
                key={i}
                className={styles.trustAvatar}
                style={{ background: c, zIndex: 4 - i }}
              />
            ))}
          </div>
          <span className={styles.trustText}>
            Join <strong>50,000+</strong> happy card creators
          </span>
        </motion.div>
      </div>
    </section>
  )
}
