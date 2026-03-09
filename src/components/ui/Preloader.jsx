import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Preloader.module.css'

// The star card that takes centre stage first
const HERO_CARD = '/1135w-mLorQish-ds.webp'

// Cards that burst out from behind the hero card
const BURST_CARDS = [
  { src: '/1067w-GBL7tdP2B-A.jpg',  x: '-42vw', y: '-30vh', r: -22, s: 0.45 },
  { src: '/1135w-ad8cLUg1kJY.webp', x:  '38vw', y: '-28vh', r:  18, s: 0.44 },
  { src: '/1067w-Rycs9qLPNBk.jpg',  x: '-38vw', y:  '26vh', r: -14, s: 0.46 },
  { src: '/1135w-GYwkzrNrC-Y.webp', x:  '35vw', y:  '28vh', r:  20, s: 0.43 },
  { src: '/1131w-Dh_rbXRZuz4.webp', x: '-16vw', y: '-40vh', r:  -8, s: 0.42 },
  { src: '/1135w-Mny9fIUaPP8.webp', x:  '14vw', y: '-42vh', r:  10, s: 0.44 },
  { src: '/1135w-SBcw_sc90lA.webp', x: '-46vw', y:  '-4vh', r: -28, s: 0.40 },
  { src: '/1135w-stb19GP9PDo.webp', x:  '44vw', y:  '-2vh', r:  26, s: 0.40 },
  { src: '/900w-k6aGrISoRDo.webp',  x:   '4vw', y:  '44vh', r:   6, s: 0.43 },
  { src: '/1135w-Z282cJuUc5o.webp', x: '-10vw', y:  '40vh', r: -16, s: 0.45 },
]

export default function Preloader({ onComplete }) {
  // phase: 'hero' → 'burst' → 'flip' → 'done'
  const [phase, setPhase] = useState('hero')
  const timers = useRef([])

  useEffect(() => {
    timers.current.push(setTimeout(() => setPhase('burst'), 1400))
    timers.current.push(setTimeout(() => setPhase('flip'),  3200))
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          className={styles.root}
          style={{ perspective: 1200 }}
          animate={phase === 'flip'
            ? { rotateY: -90, scale: 1.06, opacity: 0 }
            : { rotateY: 0,   scale: 1,    opacity: 1 }
          }
          transition={phase === 'flip'
            ? { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            : {}
          }
          onAnimationComplete={() => {
            if (phase === 'flip') setPhase('done')
          }}
        >
          {/* Background */}
          <div className={styles.bg} />

          {/* Burst cards — fly from centre to final positions */}
          {BURST_CARDS.map((card, i) => (
            <motion.div
              key={card.src}
              className={styles.burstCard}
              initial={{ x: 0, y: 0, scale: 0.3, opacity: 0, rotate: 0 }}
              animate={phase === 'burst' || phase === 'flip'
                ? { x: card.x, y: card.y, scale: card.s, opacity: 1, rotate: card.r }
                : { x: 0, y: 0, scale: 0.3, opacity: 0, rotate: 0 }
              }
              transition={{ delay: i * 0.055, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={card.src} alt="" className={styles.burstImg} />
              <div className={styles.cardSheen} />
            </motion.div>
          ))}

          {/* Hero card — enters first, large + centred */}
          <motion.div
            className={styles.heroCard}
            initial={{ scale: 0.15, opacity: 0, y: 80, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={HERO_CARD} alt="Featured card" className={styles.heroImg} />
            <div className={styles.heroGlow} />
            <div className={styles.heroShine} />
          </motion.div>

          {/* Brand logo */}
          <motion.img
            src="/With_Love_transparent_1767397236984-CNLkaJTe.png"
            alt="With Love"
            className={styles.brandLogo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.55, ease: 'easeOut' }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  )
}



