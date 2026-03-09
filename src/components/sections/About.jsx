import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './About.module.css'

const STATS_DATA = [
  { num: '2.4M+', label: 'Cards sent worldwide' },
  { num: '190+',  label: 'Countries reached'    },
  { num: '99%',   label: 'Would recommend'       },
  { num: '$0',    label: 'Cost to start'         },
]

const PILLARS = [
  {
    num: '01',
    icon: 'â™¡',
    title: 'Made with heart',
    body: 'Every detail is designed so the recipient feels truly seen, celebrated, and loved â€” not just remembered.',
    color: '#F4487A',
    grad: 'linear-gradient(135deg,rgba(244,72,122,0.11) 0%,rgba(244,72,122,0.03) 100%)',
  },
  {
    num: '02',
    icon: 'âœ¦',
    title: 'Beautifully simple',
    body: 'Pick a theme, write your message, share. Done in under 60 seconds â€” no account, no friction.',
    color: '#CC7A38',
    grad: 'linear-gradient(135deg,rgba(204,122,56,0.11) 0%,rgba(204,122,56,0.03) 100%)',
  },
  {
    num: '03',
    icon: 'âŠ¹',
    title: 'Always personal',
    body: 'Invite friends and family to co-sign, turning a single card into a chorus of people who care.',
    color: '#2BBFA4',
    grad: 'linear-gradient(135deg,rgba(43,191,164,0.11) 0%,rgba(43,191,164,0.03) 100%)',
  },
]

const STACK_CARDS = [
  { src: '/1135w-mLorQish-ds.webp',  rotate: -7,  x: -28, y: 14 },
  { src: '/1135w-N7NUFrSikUk.webp',  rotate:  3,  x:   8, y:  6 },
  { src: '/1135w-AxrG3hmgGM0.webp',  rotate:  8,  x:  32, y: 18 },
  { src: '/1067w-GBL7tdP2B-A.jpg',   rotate: -1,  x:   0, y:  0 },
]

export default function About() {
  const sectionRef = useRef()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const floatY   = useTransform(scrollYProgress, [0, 1], [40, -40])
  const bgSlideY = useTransform(scrollYProgress, [0, 1], [0, -55])

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <motion.div className={styles.bgShape1} style={{ y: bgSlideY }} />
      <div className={styles.bgShape2} />

      <div className={styles.inner}>

        {/* â”€â”€ Cinematic headline â”€â”€ */}
        <div className={styles.headlineBlock}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrowDot} />
            Our story
            <span className={styles.eyebrowDot} />
          </motion.p>

          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            The people you love deserve
            <br />
            more than{' '}
            <span className={styles.headlineAccent}>a four-word text</span>.
          </motion.h2>
        </div>

        {/* â”€â”€ Mid: card stack + story copy â”€â”€ */}
        <div className={styles.midGrid}>

          {/* Stacked card visual */}
          <motion.div
            className={styles.stackWrap}
            style={{ y: floatY }}
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.stackShadow} />
            {STACK_CARDS.map((c, i) => (
              <motion.div
                key={i}
                className={styles.stackCard}
                style={{ rotate: c.rotate, x: c.x, y: c.y, zIndex: i === 3 ? 4 : i }}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: c.y }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 120, damping: 18 }}
                whileHover={{
                  y: c.y - 20, scale: 1.07, rotate: c.rotate * 0.35, zIndex: 10,
                  boxShadow: '0 32px 72px rgba(244,72,122,0.22),0 8px 24px rgba(0,0,0,0.15)',
                  transition: { type: 'spring', stiffness: 220, damping: 18 },
                }}
              >
                <img src={c.src} alt="" className={styles.stackImg} />
                <div className={styles.stackShine} />
              </motion.div>
            ))}

            <motion.div
              className={styles.stackBadge}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, type: 'spring', stiffness: 220, damping: 16 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className={styles.stackBadgeInner}
              >
                <span className={styles.liveDot} />
                2.4M+ cards sent
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Story copy */}
          <div className={styles.storySide}>
            <motion.p className={styles.storyBody}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.6 }}
            >
              cardhazza was born from one belief: the people you love deserve more
              than a four-word text. We built a space where your words, your warmth,
              and your personality arrive in one beautiful card â€” ready to open, save,
              and treasure forever.
            </motion.p>

            <motion.p className={styles.storyBody}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.22, duration: 0.6 }}
            >
              From birthdays to promotions, condolences to just-because â€” every
              occasion deserves something that actually means something.
            </motion.p>

            <motion.blockquote className={styles.pullQuote}
              initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className={styles.quoteBar} />
              "One card. One moment. Remembered forever."
            </motion.blockquote>

            <motion.div className={styles.storyMeta}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.38, duration: 0.55 }}
            >
              {[
                { color: '#F4487A', text: 'Free forever â€” no card required'    },
                { color: '#2BBFA4', text: 'Works on any device, anywhere'        },
                { color: '#CC7A38', text: '190+ countries â€” one language: love' },
              ].map((m) => (
                <div key={m.text} className={styles.metaItem}>
                  <span className={styles.metaIcon} style={{ color: m.color }}>âœ¦</span>
                  <span>{m.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* â”€â”€ Pillars â”€â”€ */}
        <div className={styles.pillarsGrid}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              className={styles.pillar}
              style={{ background: p.grad }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                boxShadow: `0 20px 52px ${p.color}1A, 0 4px 16px rgba(0,0,0,0.06)`,
                transition: { type: 'spring', stiffness: 280, damping: 22 },
              }}
            >
              <span className={styles.pillarNum} style={{ color: p.color }}>{p.num}</span>
              <div className={styles.pillarIconWrap} style={{ color: p.color, background: `${p.color}14` }}>
                {p.icon}
              </div>
              <h3 className={styles.pillarTitle} style={{ color: p.color }}>{p.title}</h3>
              <p className={styles.pillarBody}>{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* â”€â”€ Stats strip â”€â”€ */}
      <motion.div
        className={styles.statsStrip}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ delay: 0.1, duration: 0.7 }}
      >
        {STATS_DATA.map((s, i) => (
          <motion.div key={s.label} className={styles.statItem}
            whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            {i > 0 && <div className={styles.statDivider} />}
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
