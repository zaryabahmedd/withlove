import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './Features.module.css'

/* ── Feature data ── */
const FEATURES = [
  {
    id: 'build',
    title: 'Easy to Build',
    desc: 'Choose a theme, add your message, and customize the details in seconds.',
    color: '#F4487A',
    gradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE0E8 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    // Mini card-builder mockup
    mockup: (
      <div className={styles.mockBuild}>
        <div className={styles.mockToolbar}>
          <span className={styles.mockDot} style={{ background: '#FF6B6B' }} />
          <span className={styles.mockDot} style={{ background: '#FFD93D' }} />
          <span className={styles.mockDot} style={{ background: '#6BCB77' }} />
        </div>
        <div className={styles.mockCanvas}>
          <div className={styles.mockThemeRow}>
            {['#F4487A', '#6C63FF', '#2BBFA4'].map((c) => (
              <motion.div
                key={c}
                className={styles.mockSwatch}
                style={{ background: c }}
                whileHover={{ scale: 1.3 }}
              />
            ))}
          </div>
          <div className={styles.mockTextLine} style={{ width: '78%' }} />
          <div className={styles.mockTextLine} style={{ width: '55%', opacity: 0.5 }} />
          <motion.div
            className={styles.mockCursor}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'share',
    title: 'Share Instantly',
    desc: 'Generate a unique link to send via text, email, or social media.',
    color: '#6C63FF',
    gradient: 'linear-gradient(135deg, #F0EFFF 0%, #E4E2FF 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
    mockup: (
      <div className={styles.mockShare}>
        <motion.div
          className={styles.mockLink}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        >
          <span className={styles.mockLinkIcon}>🔗</span>
          <span className={styles.mockLinkText}>withlove.card/sarah-bday</span>
        </motion.div>
        <div className={styles.mockShareRow}>
          {[
            { emoji: '💬', label: 'Text', bg: '#25D366' },
            { emoji: '📧', label: 'Email', bg: '#6C63FF' },
            { emoji: '📱', label: 'Social', bg: '#F4487A' },
          ].map((s) => (
            <motion.div
              key={s.label}
              className={styles.mockShareBtn}
              style={{ background: s.bg }}
              whileHover={{ scale: 1.12, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{s.emoji}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'collab',
    title: 'Collaborative',
    desc: 'Enable signatures to let friends and family add their own messages.',
    color: '#2BBFA4',
    gradient: 'linear-gradient(135deg, #EEFCF8 0%, #D4F5EC 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    mockup: (
      <div className={styles.mockCollab}>
        {[
          { name: 'Sarah', msg: 'Happy Birthday! 🎂', color: '#F4487A', delay: 0 },
          { name: 'Alex', msg: 'Wishing you the best!', color: '#6C63FF', delay: 0.3 },
          { name: 'Mom', msg: 'So proud of you ❤️', color: '#2BBFA4', delay: 0.6 },
        ].map((sig) => (
          <motion.div
            key={sig.name}
            className={styles.mockSig}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + sig.delay, duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.mockAvatar} style={{ background: sig.color }}>
              {sig.name[0]}
            </div>
            <div className={styles.mockSigText}>
              <span className={styles.mockSigName}>{sig.name}</span>
              <span className={styles.mockSigMsg}>{sig.msg}</span>
            </div>
          </motion.div>
        ))}
      </div>
    ),
  },
]

/* ── Floating decorative particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: 6 + Math.random() * 8,
  delay: Math.random() * 4,
  color: ['#F4487A', '#6C63FF', '#2BBFA4', '#FFD166', '#FF8CB0'][i % 5],
}))

/* ── FeatureCard ── */
function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className={styles.featureCard}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flexDirection: isEven ? 'row' : 'row-reverse' }}
    >
      {/* Text side */}
      <div className={styles.featureText}>
        <motion.div
          className={styles.featureIconCircle}
          style={{ background: feature.gradient, color: feature.color }}
          animate={hovered ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {feature.icon}
        </motion.div>
        <motion.h3
          className={styles.featureTitle}
          animate={hovered ? { x: 6 } : { x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {feature.title}
        </motion.h3>
        <p className={styles.featureDesc}>{feature.desc}</p>

        {/* Animated accent line */}
        <motion.div
          className={styles.accentLine}
          style={{ background: feature.color }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Mockup/Visual side */}
      <motion.div
        className={styles.featureMockup}
        style={{ background: feature.gradient }}
        animate={hovered
          ? { scale: 1.03, boxShadow: `0 24px 60px ${feature.color}22, 0 8px 24px ${feature.color}15` }
          : { scale: 1, boxShadow: `0 8px 32px ${feature.color}10, 0 2px 8px rgba(0,0,0,0.06)` }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {feature.mockup}

        {/* Shimmer overlay  */}
        <div className={styles.featureShimmer} />
      </motion.div>
    </motion.div>
  )
}

/* ── Animated counter ── */
function AnimCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {inView ? (
        <motion.span
          initial={{ count: 0 }}
          animate={{ count: value }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          {/* We'll display value directly — no real counter needed, just animate presence */}
          {value}{suffix}
        </motion.span>
      ) : `0${suffix}`}
    </motion.span>
  )
}

/* ── Main Section ── */
export default function Features() {
  const sectionRef = useRef(null)
  const headingInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="features" ref={sectionRef}>
      {/* Floating ambient particles */}
      <div className={styles.particleField}>
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={styles.particle}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.color,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Top decorative curve */}
      <div className={styles.topCurve}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Section Header */}
      <div className={styles.header}>
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={headingInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.eyebrowDot} />
          Features
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Everything you{' '}
          <span className={styles.headingAccent}>need</span>
        </motion.h2>

        <motion.p
          className={styles.subtext}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Simple yet powerful features to create the perfect card
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className={styles.features}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} feature={f} index={i} />
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        className={styles.statsBar}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {[
          { value: '50K', label: 'Cards Created' },
          { value: '120+', label: 'Themes Available' },
          { value: '4.9', label: 'User Rating' },
          { value: '30s', label: 'Avg. Build Time' },
        ].map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Bottom decorative curve */}
      <div className={styles.bottomCurve}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  )
}
