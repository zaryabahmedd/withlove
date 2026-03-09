import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import styles from './HomeFeatures.module.css'

const FEATURES = [
  {
    num: '01',
    title: 'Easy to Build',
    desc: 'Choose a theme, add your message, and customize every detail. No design skills needed — pick, type, and you\'re done in under 60 seconds.',
    color: '#F4487A',
    tag: '60 sec',
    cards: ['/1135w-mLorQish-ds.webp', '/1135w-SBcw_sc90lA.webp', '/1067w-GBL7tdP2B-A.jpg'],
  },
  {
    num: '02',
    title: 'Share Instantly',
    desc: 'Generate a unique link to send via text, email, or social media. Your card arrives beautifully, ready to open on any device.',
    color: '#6C63FF',
    tag: 'Any device',
  },
  {
    num: '03',
    title: 'Collaborative',
    desc: 'Invite friends and family to co-sign. Turn a single card into a chorus of people who care.',
    color: '#2BBFA4',
    tag: 'Group cards',
  },
]

const SIGS = [
  { name: 'Sarah', initials: 'S', color: '#F4487A', note: '🎉 Happy Birthday!! Miss you so much!' },
  { name: 'Alex',  initials: 'A', color: '#6C63FF', note: 'Wishing you the best year yet 🥳' },
  { name: 'Mom',   initials: 'M', color: '#2BBFA4', note: 'So proud of you every single day ❤️' },
]

/* ─────────────────────────────────────────
   TILE 01 — Card fan animation
   Cards swing in from the right corner,
   fan open across the tile, then close back
───────────────────────────────────────── */
const CARD_IDLE = [
  { rotate: 6,  x: 0,   y: 0,   scale: 1 },
  { rotate: -4, x: 12,  y: -8,  scale: 1 },
  { rotate: 14, x: -8,  y: 4,   scale: 1 },
]
const CARD_FAN = [
  { rotate: -18, x: -120, y: -20, scale: 0.9 },
  { rotate: 2,   x: 0,    y: -30, scale: 0.95 },
  { rotate: 20,  x: 120,  y: -10, scale: 0.9 },
]

function PrimaryTile({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [phase, setPhase] = useState('idle') // idle | fan | close

  useEffect(() => {
    if (!inView) return
    // sequence: wait → fan open → hold → close back → repeat
    let t1, t2, t3, t4
    const cycle = () => {
      t1 = setTimeout(() => setPhase('fan'),  800)
      t2 = setTimeout(() => setPhase('close'), 2600)
      t3 = setTimeout(() => setPhase('idle'),  3400)
      t4 = setTimeout(cycle,                   5200)
    }
    cycle()
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [inView])

  return (
    <motion.div
      ref={ref}
      className={styles.primaryTile}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: text content */}
      <div className={styles.tileContent}>
        <div className={styles.tileTop}>
          <span className={styles.tileNum} style={{ color: f.color }}>{f.num}</span>
          <span className={styles.tileTag} style={{ background: `${f.color}18`, color: f.color }}>
            {f.tag}
          </span>
        </div>
        <h3 className={styles.tileTitle}>{f.title}</h3>
        <p className={styles.tileDesc}>{f.desc}</p>
        <motion.div
          className={styles.tileBar}
          style={{ background: f.color }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Right: animated card fan */}
      <div className={styles.cardFanWrap}>
        {f.cards.map((src, i) => {
          const target = phase === 'fan' ? CARD_FAN[i] : CARD_IDLE[i]
          return (
            <motion.div
              key={i}
              className={styles.fanCard}
              style={{ zIndex: i + 1 }}
              initial={{ opacity: 0, scale: 0.6, rotate: CARD_IDLE[i].rotate, x: 60, y: 60 }}
              animate={inView ? {
                opacity: 1,
                scale: target.scale,
                rotate: target.rotate,
                x: target.x,
                y: target.y,
              } : {}}
              transition={{
                opacity: { delay: 0.3 + i * 0.12, duration: 0.6 },
                scale:   { type: 'spring', stiffness: 180, damping: 20, delay: phase === 'fan' ? i * 0.07 : (2 - i) * 0.06 },
                rotate:  { type: 'spring', stiffness: 160, damping: 18, delay: phase === 'fan' ? i * 0.07 : (2 - i) * 0.06 },
                x:       { type: 'spring', stiffness: 160, damping: 18, delay: phase === 'fan' ? i * 0.07 : (2 - i) * 0.06 },
                y:       { type: 'spring', stiffness: 160, damping: 18, delay: phase === 'fan' ? i * 0.07 : (2 - i) * 0.06 },
              }}
            >
              <img src={src} alt="" draggable={false} />
            </motion.div>
          )
        })}
      </div>

      <span className={styles.watermark}>{f.num}</span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   TILE 02 — Phone mockup with card preview
   A mini phone frame slides up, showing a
   card image inside with a send animation
───────────────────────────────────────── */
function ShareTile({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setSent(true),  1200)
    const t2 = setTimeout(() => setSent(false), 3000)
    const interval = setInterval(() => {
      setSent(true)
      setTimeout(() => setSent(false), 1800)
    }, 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval) }
  }, [inView])

  return (
    <motion.div
      ref={ref}
      className={styles.secondaryTile}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: text */}
      <div className={styles.tileHalf}>
        <div className={styles.tileTop}>
          <span className={styles.tileNum} style={{ color: f.color }}>{f.num}</span>
          <span className={styles.tileTag} style={{ background: `${f.color}18`, color: f.color }}>
            {f.tag}
          </span>
        </div>
        <h3 className={styles.tileTitle}>{f.title}</h3>
        <p className={styles.tileDesc}>{f.desc}</p>

        {/* Share chips */}
        <div className={styles.shareBtns}>
          {[{ icon: '💬', label: 'Text' }, { icon: '📧', label: 'Email' }, { icon: '📱', label: 'Social' }].map(({ icon, label }) => (
            <motion.span
              key={label}
              className={styles.shareChip}
              style={{ borderColor: `${f.color}30` }}
              whileHover={{ scale: 1.06, borderColor: f.color, color: f.color }}
            >
              {icon} {label}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Right: phone mockup */}
      <div className={styles.phoneMockWrap}>
        <motion.div
          className={styles.phoneMock}
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.phoneScreen}>
            {/* Card thumbnail inside phone */}
            <div className={styles.phoneCard}>
              <img src="/1135w-N7NUFrSikUk.webp" alt="" />
              <div className={styles.phoneCardLabel}>Happy Birthday 🎂</div>
            </div>
            {/* Animated "sent" indicator */}
            <motion.div
              className={styles.phoneSent}
              style={{ background: f.color }}
              animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : 6 }}
              transition={{ duration: 0.35 }}
            >
              ✓ Link sent
            </motion.div>
          </div>
          <div className={styles.phoneBar} />
        </motion.div>
      </div>

      <span className={styles.watermark}>{f.num}</span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   TILE 03 — Message thread mockup
   Avatars + their signature notes animate
   in one by one, like a live co-sign feed
───────────────────────────────────────── */
function CollabTile({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (!inView) return
    const ids = []
    const cancelled = { current: false }

    const runCycle = () => {
      setVisible(0)
      SIGS.forEach((_, i) => {
        const t = setTimeout(() => {
          if (!cancelled.current) setVisible(i + 1)
        }, 500 + i * 750)
        ids.push(t)
      })
    }

    runCycle()
    const loop = setInterval(runCycle, 7500)

    return () => {
      cancelled.current = true
      ids.forEach(clearTimeout)
      clearInterval(loop)
    }
  }, [inView])

  return (
    <motion.div
      ref={ref}
      className={styles.secondaryTile}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Wrap everything in a column so row-flex of secondaryTile doesn't break layout */}
      <div className={styles.tileHalf} style={{ flex: 1 }}>
        {/* Text header */}
        <div className={styles.tileTop}>
          <span className={styles.tileNum} style={{ color: f.color }}>{f.num}</span>
          <span className={styles.tileTag} style={{ background: `${f.color}18`, color: f.color }}>
            {f.tag}
          </span>
        </div>
        <h3 className={styles.tileTitle}>{f.title}</h3>
        <p className={styles.tileDesc}>{f.desc}</p>

        {/* Live co-sign thread */}
        <div className={styles.noteThread}>
          {SIGS.map((s, i) => (
            <motion.div
              key={s.name}
              className={styles.noteRow}
              animate={visible > i
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -14, y: 4 }
              }
              initial={{ opacity: 0, x: -14, y: 4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.noteAvatar} style={{ background: s.color }}>
                {s.initials}
              </div>
              <div className={styles.noteBubble}>
                <span className={styles.noteName} style={{ color: s.color }}>{s.name}</span>
                <span className={styles.noteText}>{s.note}</span>
              </div>
            </motion.div>
          ))}
          {/* Typing indicator — shows after all messages appear */}
          <motion.div
            className={styles.typingRow}
            animate={{ opacity: visible >= SIGS.length ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.noteAvatar} style={{ background: '#FF9D42' }}>J</div>
            <div className={styles.typingDots}>
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className={styles.dot}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <span className={styles.watermark}>{f.num}</span>
    </motion.div>
  )
}

export default function HomeFeatures() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>What we offer</span>
          <h2 className={styles.heading}>
            Everything you <span className={styles.headingAccent}>need</span>,
            <br />nothing you don't.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className={styles.bentoGrid}>
          <PrimaryTile f={FEATURES[0]} />
          <div className={styles.bentoRight}>
            <ShareTile f={FEATURES[1]} />
            <CollabTile f={FEATURES[2]} />
          </div>
        </div>
      </div>
    </section>
  )
}
