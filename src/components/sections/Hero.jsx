import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroLogo } from '../ui/Logo'
import styles from './Hero.module.css'

// Colors for each letter of "moment" — warm pink → coral → amber → gold → olive → forest
const momentColors = ['#C8345A', '#D9664A', '#CC9038', '#A89C30', '#70A840', '#3A8858']

// ── Balloon data (2 balloons, slow speed) ──
const BALLOONS = [
  { id: 0, x: '8%',  size: 52, color: '#FF8CB0', delay: 0,   dur: 18.0, sway: 16  },
  { id: 2, x: '88%', size: 46, color: '#C9B8FF', delay: 0.8, dur: 19.0, sway: -16 },
]

// ── Rose color schemes ──
const ROSE_PALETTES = [
  // Original pink/coral/mint (like the logo)
  { outer: ['#FF8CB0','#FF6B9D'], mid: ['#FFAA6B','#FF7A3A'], leaf: ['#5BAD72','#3A8254'], center: '#C83060' },
  // Purple / violet / teal
  { outer: ['#C9A0FF','#A66CFF'], mid: ['#82CFFF','#38AADD'], leaf: ['#4AAEC2','#2A8099'], center: '#7B35CC' },
  // Coral / peach / sage
  { outer: ['#FFB085','#FF7A50'], mid: ['#FFD9A0','#FFAA60'], leaf: ['#8CC87A','#5A9E48'], center: '#D94A20' },
  // Rose gold / gold / olive
  { outer: ['#FFAABB','#FF7799'], mid: ['#FFD166','#FFAA33'], leaf: ['#A0C860','#6A9A30'], center: '#CC3366' },
  // Sky blue / cyan / forest
  { outer: ['#99DDFF','#44AAEE'], mid: ['#AAFFD4','#44DDA0'], leaf: ['#44BB88','#228866'], center: '#1177BB' },
]

// ── Gift card color schemes ──
const GIFT_CARDS = [
  { id: 0, mode: 'rise', x: '16%', size: 56, bg: '#E8223A', ribbon: '#B01020', bow: '#FF6677', delay: 0.4, dur: 22.0, sway: 12 },
  { id: 1, mode: 'rise', x: '78%', size: 52, bg: '#1DB96A', ribbon: '#0F8A4A', bow: '#5DEEAA', delay: 1.2, dur: 21.0, sway: -14 },
]

// SVG gift card with ribbon + bow
function GiftCardSVG({ size, bg, ribbon, bow }) {
  const w = size
  const h = size * 0.72
  return (
    <svg width={w} height={h + size * 0.28} viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`gc-${bg.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bg} stopOpacity="1" />
          <stop offset="100%" stopColor={ribbon} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Card body */}
      <rect x="2" y="18" width="76" height="52" rx="5" fill={`url(#gc-${bg.replace('#','')})`} />
      {/* Card shine */}
      <rect x="2" y="18" width="76" height="20" rx="5" fill="white" opacity="0.1" />
      <ellipse cx="22" cy="26" rx="10" ry="5" fill="white" opacity="0.12" transform="rotate(-15 22 26)" />

      {/* Horizontal ribbon band */}
      <rect x="2" y="36" width="76" height="8" fill={ribbon} opacity="0.75" />

      {/* Vertical ribbon band */}
      <rect x="36" y="18" width="8" height="52" fill={ribbon} opacity="0.75" />

      {/* To/From lines on card face */}
      <rect x="12" y="52" width="20" height="2.5" rx="1.25" fill="white" opacity="0.35" />
      <rect x="12" y="57" width="14" height="2" rx="1" fill="white" opacity="0.25" />
      <rect x="48" y="52" width="20" height="2.5" rx="1.25" fill="white" opacity="0.35" />

      {/* Bow — left loop */}
      <path d="M40 18 C32 10, 18 8, 20 16 C22 20, 34 20, 40 18Z" fill={bow} opacity="0.95" />
      {/* Bow — right loop */}
      <path d="M40 18 C48 10, 62 8, 60 16 C58 20, 46 20, 40 18Z" fill={bow} opacity="0.9" />
      {/* Bow — left tail */}
      <path d="M40 18 C36 22, 30 26, 26 30" stroke={bow} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Bow — right tail */}
      <path d="M40 18 C44 22, 50 26, 54 30" stroke={bow} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Bow — knot centre */}
      <circle cx="40" cy="18" r="4" fill={bow} />
      <circle cx="40" cy="18" r="2.2" fill={ribbon} opacity="0.7" />

      {/* Star sparkles */}
      <circle cx="64" cy="24" r="1.4" fill="white" opacity="0.55" />
      <circle cx="10" cy="62" r="1.0" fill="white" opacity="0.4" />
    </svg>
  )
}

function GiftCard({ mode, x, y, side, size, bg, ribbon, bow, delay, dur, sway }) {
  if (mode === 'rise') {
    return (
      <motion.div
        className={styles.giftCardWrap}
        style={{ left: x, bottom: '-12%' }}
        animate={{
          y: [0, -(window.innerHeight * 1.3)],
          x: [0, sway, sway * -0.6, sway * 0.9, 0],
          opacity: [0, 1, 1, 1, 0],
          rotate: [0, 4, -3, 5, 0],
        }}
        transition={{
          y:       { duration: dur, delay, ease: 'linear',    repeat: Infinity, repeatDelay: delay * 0.5 },
          x:       { duration: dur, delay, ease: 'easeInOut', repeat: Infinity, repeatDelay: delay * 0.5 },
          opacity: { duration: dur, delay, times: [0, 0.07, 0.84, 0.95, 1], repeat: Infinity, repeatDelay: delay * 0.5 },
          rotate:  { duration: dur * 0.6, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        }}
      >
        <GiftCardSVG size={size} bg={bg} ribbon={ribbon} bow={bow} />
      </motion.div>
    )
  }
  // drift mode
  const startX = side === 'left' ? '-160px' : 'calc(100vw + 120px)'
  const endX   = side === 'left' ? 'calc(100vw + 120px)' : '-160px'
  return (
    <motion.div
      className={styles.giftCardWrap}
      style={{ top: y, left: 0 }}
      animate={{
        x: [startX, endX],
        opacity: [0, 0.9, 0.9, 0],
        rotate: side === 'left' ? [0, 8, -5, 7, 0] : [0, -8, 5, -7, 0],
        y: [0, -12, 8, -10, 0],
      }}
      transition={{
        x:       { duration: dur, delay, ease: 'linear',    repeat: Infinity, repeatDelay: 2 },
        opacity: { duration: dur, delay, times: [0, 0.06, 0.9, 1], repeat: Infinity, repeatDelay: 2 },
        rotate:  { duration: dur * 0.5, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        y:       { duration: dur * 0.38, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
      }}
    >
      <GiftCardSVG size={size} bg={bg} ribbon={ribbon} bow={bow} />
    </motion.div>
  )
}

// ── Flowers removed ──
const FLOWERS = []

// SVG rose matching the logo style — layered heart petals + leaves
function RoseSVG({ size, palette }) {
  const uid = palette.center.replace('#', '')
  return (
    <svg width={size} height={size} viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`o1-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={palette.outer[0]} />
          <stop offset="100%" stopColor={palette.outer[1]} />
        </linearGradient>
        <linearGradient id={`o2-${uid}`} x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor={palette.outer[0]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette.outer[1]} />
        </linearGradient>
        <linearGradient id={`m1-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={palette.mid[0]} />
          <stop offset="100%" stopColor={palette.mid[1]} />
        </linearGradient>
        <linearGradient id={`lf-${uid}`} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={palette.leaf[1]} />
          <stop offset="100%" stopColor={palette.leaf[0]} />
        </linearGradient>
        <linearGradient id={`lr-${uid}`} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={palette.leaf[1]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette.leaf[0]} />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Leaves */}
      <path d="M42 88 C28 74, 22 58, 30 50 C36 60, 46 74, 50 82 C46 84, 43 86, 42 88Z"
        fill={`url(#lf-${uid})`} />
      <path d="M58 88 C72 74, 78 58, 70 50 C64 60, 54 74, 50 82 C54 84, 57 86, 58 88Z"
        fill={`url(#lr-${uid})`} />
      {/* Stem hint */}
      <path d="M50 82 L50 96" stroke={palette.leaf[1]} strokeWidth="2.5" strokeLinecap="round" />

      {/* Outer heart petals — back layer */}
      <path d="M50 76 C18 56, 2 38, 2 22 C2 10, 12 2, 26 2 C34 2, 42 6, 50 14 C58 6, 66 2, 74 2 C88 2, 98 10, 98 22 C98 38, 82 56, 50 76Z"
        fill={`url(#o1-${uid})`} opacity="0.92" />

      {/* Second petal layer — slightly inset, rotated feel */}
      <path d="M50 68 C26 52, 12 38, 12 26 C12 17, 19 10, 30 10 C37 10, 43 14, 50 21 C57 14, 63 10, 70 10 C81 10, 88 17, 88 26 C88 38, 74 52, 50 68Z"
        fill={`url(#o2-${uid})`} opacity="0.88" />

      {/* Mid petals — warm accent color */}
      <path d="M50 62 C32 50, 20 38, 20 28 C20 21, 26 15, 35 15 C41 15, 46 18, 50 24 C54 18, 59 15, 65 15 C74 15, 80 21, 80 28 C80 38, 68 50, 50 62Z"
        fill={`url(#m1-${uid})`} opacity="0.9" />

      {/* Inner spiral petals */}
      <path d="M50 54 C38 46, 30 38, 30 30 C30 25, 34 20, 40 20 C44 20, 47 22, 50 26 C53 22, 56 20, 60 20 C66 20, 70 25, 70 30 C70 38, 62 46, 50 54Z"
        fill={`url(#o1-${uid})`} opacity="0.85" />

      {/* Rose centre spiral */}
      <ellipse cx="50" cy="34" rx="10" ry="10" fill={`url(#m1-${uid})`} opacity="0.95" />
      <ellipse cx="50" cy="33" rx="6.5" ry="7" fill={palette.center} opacity="0.9" filter={`url(#glow-${uid})`} />
      {/* Spiral lines */}
      <path d="M50 27 C53 29, 56 33, 54 37 C52 40, 48 40, 46 37 C44 34, 46 30, 50 30 C52 30, 54 32, 53 35"
        stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Sparkles */}
      <circle cx="16" cy="18" r="1.8" fill={palette.outer[0]} opacity="0.7" />
      <circle cx="84" cy="14" r="1.4" fill={palette.mid[0]} opacity="0.6" />
      <circle cx="12" cy="42" r="1.2" fill={palette.outer[0]} opacity="0.5" />
    </svg>
  )
}

function Balloon({ x, size, color, delay, dur, sway }) {
  return (
    <motion.div
      className={styles.balloonWrap}
      style={{ left: x, bottom: '-10%' }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -(window.innerHeight * 1.25)],
        x: [0, sway, sway * -0.5, sway * 0.8, 0],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        y:       { duration: dur, delay, ease: 'linear', repeat: Infinity, repeatDelay: delay * 0.4 },
        x:       { duration: dur, delay, ease: 'easeInOut', repeat: Infinity, repeatDelay: delay * 0.4 },
        opacity: { duration: dur, delay, times: [0, 0.06, 0.85, 0.95, 1], repeat: Infinity, repeatDelay: delay * 0.4 },
      }}
    >
      <svg width={size} height={size * 1.25} viewBox="0 0 60 75" fill="none">
        <ellipse cx="30" cy="28" rx="26" ry="28" fill={color} />
        <ellipse cx="22" cy="18" rx="8" ry="10" fill="white" opacity="0.22" />
        <ellipse cx="20" cy="16" rx="4" ry="5" fill="white" opacity="0.18" />
        <path d="M30 56 C28 52, 26 50, 30 48 C34 50, 32 52, 30 56Z" fill={color} />
        <ellipse cx="30" cy="57" rx="3" ry="2" fill={color} opacity="0.85" />
        <path d="M30 59 C28 63, 32 67, 30 74" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  )
}

function Flower({ side, y, size, palette, delay, dur }) {
  const startX = side === 'left' ? '-140px' : 'calc(100vw + 100px)'
  const endX   = side === 'left' ? 'calc(100vw + 100px)' : '-140px'
  return (
    <motion.div
      className={styles.flowerWrap}
      style={{ top: y, left: 0 }}
      initial={{ x: startX, opacity: 0 }}
      animate={{
        x: [startX, endX],
        opacity: [0, 0.92, 0.92, 0],
        rotate: side === 'left' ? [0, 12, -8, 10, 0] : [0, -12, 8, -10, 0],
        y: [0, -14, 6, -10, 0],
      }}
      transition={{
        x:       { duration: dur, delay, ease: 'linear', repeat: Infinity, repeatDelay: 2 },
        opacity: { duration: dur, delay, times: [0, 0.06, 0.9, 1], repeat: Infinity, repeatDelay: 2 },
        rotate:  { duration: dur * 0.5, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        y:       { duration: dur * 0.35, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
      }}
    >
      <RoseSVG size={size} palette={palette} />
    </motion.div>
  )
}

// ── All card sample images ──
const CARD_IMAGES = [
  '/1067w-GBL7tdP2B-A.jpg',
  '/1067w-LoPZ7qsO0pY.webp',
  '/1067w-Rycs9qLPNBk.jpg',
  '/1067w-y9lMGm8uw8A.webp',
  '/1131w-Dh_rbXRZuz4.webp',
  '/1135w-ad8cLUg1kJY.webp',
  '/1135w-AxrG3hmgGM0.webp',
  '/1135w-c0BaBWV_t4M.jpg',
  '/1135w-GYwkzrNrC-Y.webp',
  '/1135w-mLorQish-ds.webp',
  '/1135w-Mny9fIUaPP8.webp',
  '/1135w-N7NUFrSikUk.webp',
  '/1135w-pZfvJM8K0TI.jpg',
  '/1135w-SBcw_sc90lA.webp',
  '/1135w-stb19GP9PDo.webp',
  '/1135w-Z282cJuUc5o.webp',
  '/900w-k6aGrISoRDo.webp',
]

// ── Floating card images in bg (rise only) ──
const FLOATING_CARDS = [
  { id: 0, mode: 'rise', src: CARD_IMAGES[0],  x: '10%', w: 78, h: 54, delay: 0.2, dur: 26.0, sway: 12  },
  { id: 1, mode: 'rise', src: CARD_IMAGES[9],  x: '55%', w: 68, h: 46, delay: 1.0, dur: 28.0, sway: -14 },
  { id: 2, mode: 'rise', src: CARD_IMAGES[4],  x: '82%', w: 66, h: 44, delay: 1.8, dur: 25.0, sway: 10  },
]

function FloatingCard({ mode, src, x, y, side, w, h, delay, dur, sway }) {
  if (mode === 'rise') {
    return (
      <motion.div
        className={styles.floatingCardWrap}
        style={{ left: x, bottom: '-10%', width: w, height: h }}
        animate={{
          y: [0, -(window.innerHeight * 1.3)],
          x: [0, sway, sway * -0.5, sway * 0.8, 0],
          opacity: [0, 0.75, 0.75, 0.75, 0],
          rotate: [0, 5, -3, 4, 0],
        }}
        transition={{
          y:       { duration: dur, delay, ease: 'linear',    repeat: Infinity, repeatDelay: delay * 0.4 },
          x:       { duration: dur, delay, ease: 'easeInOut', repeat: Infinity, repeatDelay: delay * 0.4 },
          opacity: { duration: dur, delay, times: [0, 0.06, 0.85, 0.95, 1], repeat: Infinity, repeatDelay: delay * 0.4 },
          rotate:  { duration: dur * 0.55, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        }}
      >
        <img src={src} alt="" className={styles.floatingCardImg} />
      </motion.div>
    )
  }
  const startX = side === 'left' ? '-120px' : 'calc(100vw + 100px)'
  const endX   = side === 'left' ? 'calc(100vw + 100px)' : '-120px'
  return (
    <motion.div
      className={styles.floatingCardWrap}
      style={{ top: y, left: 0, width: w, height: h }}
      animate={{
        x: [startX, endX],
        opacity: [0, 0.75, 0.75, 0],
        rotate: side === 'left' ? [0, 6, -4, 5, 0] : [0, -6, 4, -5, 0],
        y: [0, -10, 6, -8, 0],
      }}
      transition={{
        x:       { duration: dur, delay, ease: 'linear',    repeat: Infinity, repeatDelay: 2 },
        opacity: { duration: dur, delay, times: [0, 0.05, 0.9, 1], repeat: Infinity, repeatDelay: 2 },
        rotate:  { duration: dur * 0.45, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        y:       { duration: dur * 0.35, delay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
      }}
    >
      <img src={src} alt="" className={styles.floatingCardImg} />
    </motion.div>
  )
}

function CardCollage() {
  const count  = CARD_IMAGES.length  // 17 cards
  const cardW  = 110
  const cardH  = 74

  // Use viewport-based sizing so arch spans full screen width
  const vw     = typeof window !== 'undefined' ? window.innerWidth : 1200
  const radiusX = (vw / 2) - cardW * 0.3   // horizontal: edge to edge
  const radiusY = 120                       // shallow arch height

  return (
    <div className={styles.collageWrap}>
      {CARD_IMAGES.map((src, i) => {
        // Spread cards from π (left) to 0 (right) — a top-facing arch
        const angle = Math.PI - (i / (count - 1)) * Math.PI
        const cx    = radiusX * Math.cos(angle)
        const cy    = -radiusY * Math.sin(angle)  // negative = upward

        // Tilt follows the tangent so cards fan along the curve
        const tilt  = ((angle * 180) / Math.PI - 90) * -1

        // Cards in the middle (top of arch) overlap on top
        const zIdx  = count - Math.abs(i - Math.floor(count / 2))

        const enterDel = 0.3 + i * 0.06
        const floatAmp = 4 + (i % 3) * 2
        const floatDur = 3.5 + (i % 4) * 0.5

        return (
          <motion.div
            key={i}
            className={styles.collageCard}
            style={{
              width:  cardW,
              height: cardH,
              left:   `calc(50% + ${cx}px - ${cardW / 2}px)`,
              top:    `calc(100% + ${cy}px - ${cardH / 2}px)`,
              zIndex: zIdx,
            }}
            initial={{ opacity: 0, scale: 0.3, rotate: tilt + (i % 2 === 0 ? 20 : -20), y: 60 }}
            animate={{
              opacity: 1,
              scale:   1,
              rotate:  tilt,
              y:       [0, -floatAmp, 0],
            }}
            transition={{
              opacity: { delay: enterDel, duration: 0.5, ease: 'easeOut' },
              scale:   { delay: enterDel, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              rotate:  { delay: enterDel, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              y:       { delay: enterDel + 0.5, duration: floatDur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
            }}
            whileHover={{
              scale: 1.22,
              zIndex: 30,
              rotate: 0,
              y: -14,
              boxShadow: '0 20px 50px rgba(244,72,122,0.3), 0 8px 20px rgba(0,0,0,0.15)',
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <img src={src} alt={`card ${i + 1}`} className={styles.collageImg} />
            <div className={styles.collageShine} />
          </motion.div>
        )
      })}
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 + delay },
})

export default function Hero() {
  const [decorReady, setDecorReady] = useState(false)

  // Wait until the main banner content has finished animating in before
  // mounting the decorative floating elements (~1.3 s matches the last fadeUp)
  useEffect(() => {
    const t = setTimeout(() => setDecorReady(true), 1300)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className={styles.hero} id="home">
      {/* Soft background blobs */}
      <div className={styles.blobLeft} />
      <div className={styles.blobRight} />
      <div className={styles.blobTop} />

      {decorReady && (
        <>
          {/* ── Balloons ── */}
          {BALLOONS.map((b) => <Balloon key={b.id} {...b} />)}

          {/* ── Flowers ── */}
          {FLOWERS.map((f) => <Flower key={f.id} {...f} />)}

          {/* ── Gift Cards ── */}
          {GIFT_CARDS.map((g) => <GiftCard key={g.id} {...g} />)}

          {/* ── Floating card images ── */}
          {FLOATING_CARDS.map((fc) => <FloatingCard key={fc.id} {...fc} />)}
        </>
      )}

      <div className={styles.content}>
        {/* Center logo - animated */}
        <div className={styles.logoWrap}>
          <HeroLogo />
        </div>

        {/* Headline */}
        <motion.h1 className={styles.headline} {...fadeUp(0.25)}>
          Send a{' '}
          <span className={styles.momentWord}>
            {'moment'.split('').map((char, i) => (
              <motion.span
                key={i}
                style={{
                  color: momentColors[i],
                  animation: 'letterGlow 2.2s ease-in-out infinite',
                  animationDelay: `${0.9 + i * 0.18}s`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          , not a message
        </motion.h1>

        {/* Subtitle */}
        <motion.p className={styles.subtitle} {...fadeUp(0.65)}>
          Create a beautiful digital card that feels personal, ready to
          <br />open, save, and share.
        </motion.p>

        {/* CTA Button */}
        <motion.div {...fadeUp(0.85)}>
          <motion.button
            className={styles.ctaBtn}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 12px 40px rgba(244, 72, 122, 0.45)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
            >
              ✦
            </motion.span>
            {' '}Create your Card{' '}
            <span className={styles.arrow}>→</span>
          </motion.button>
        </motion.div>

        {/* Feature Perks */}
        <motion.div className={styles.perksRow} {...fadeUp(1.0)}>
          <div className={styles.perkItem}>
            <svg className={styles.perkIcon} style={{ color: '#F4487A' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={styles.perkLabel}>Made with love</span>
          </div>
          <div className={styles.perkDivider} />
          <div className={styles.perkItem}>
            <svg className={styles.perkIcon} style={{ color: '#2BBFA4' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
              <path d="M5.5 5.5l.5.5M18 5.5l-.5.5M5.5 18l.5-.5M18 18l-.5-.5" strokeWidth="1.5" />
            </svg>
            <span className={styles.perkLabel}>100% Free</span>
          </div>
          <div className={styles.perkDivider} />
          <div className={styles.perkItem}>
            <svg className={styles.perkIcon} style={{ color: '#F5874A' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className={styles.perkLabel}>Mass Send Support</span>
          </div>
        </motion.div>

        {/* Card collage in an O shape */}
        <motion.div {...fadeUp(1.05)}>
          <CardCollage />
        </motion.div>
      </div>
    </section>
  )
}
