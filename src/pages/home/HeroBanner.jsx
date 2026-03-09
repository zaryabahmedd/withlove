import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './HeroBanner.module.css'

/* Cards scattered around typography — some behind, some in front */
const SCATTER_CARDS = [
  { src: '/1135w-mLorQish-ds.webp', pos: 'pos1', rotate: -12, delay: 0.2 },
  { src: '/1067w-GBL7tdP2B-A.jpg',  pos: 'pos2', rotate: 4,  delay: 0.35 },
  { src: '/1135w-SBcw_sc90lA.webp', pos: 'pos3', rotate: 8,  delay: 0.5 },
  { src: '/1135w-AxrG3hmgGM0.webp', pos: 'pos4', rotate: -3, delay: 0.15 },
  { src: '/1135w-N7NUFrSikUk.webp', pos: 'pos5', rotate: 5,  delay: 0.45 },
  { src: '/1067w-Rycs9qLPNBk.jpg',  pos: 'pos6', rotate: -8, delay: 0.6 },
  { src: '/1135w-ad8cLUg1kJY.webp',  pos: 'pos7', rotate: 7,  delay: 0.55 },
]

const revealUp = (i) => ({
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 + i * 0.13, duration: 1.0, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const cardsParallax = useTransform(scrollYProgress, [0, 1], [0, 70])

  return (
    <section className={styles.hero} ref={ref}>
      {/* Vertical side label */}
      <div className={styles.sideLabel}>
        <span className={styles.sideDot} /> CREATE A CARD
      </div>

      {/* Scattered card images — individual z-index for text-layering */}
      {SCATTER_CARDS.map((card, i) => (
        <motion.div
          key={i}
          className={`${styles.card} ${styles[card.pos]}`}
          style={{ y: cardsParallax }}
          initial={{ opacity: 0, scale: 0.7, rotate: card.rotate + 20 }}
          animate={{ opacity: 1, scale: 1, rotate: card.rotate }}
          transition={{ delay: 0.5 + card.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{
            scale: 1.1, rotate: 0, zIndex: 20,
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            transition: { duration: 0.3 },
          }}
        >
          <img src={card.src} alt="" draggable={false} />
        </motion.div>
      ))}

      {/* Decorative sparkles */}
      <motion.span
        className={styles.sparkle1}
        animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
        transition={{
          rotate: { repeat: Infinity, duration: 10, ease: 'linear' },
          scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        }}
      >
        ✦
      </motion.span>
      <motion.span
        className={styles.sparkle2}
        animate={{ rotate: [0, -360], scale: [1, 1.4, 1] }}
        transition={{
          rotate: { repeat: Infinity, duration: 12, ease: 'linear' },
          scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        }}
      >
        *
      </motion.span>

      {/* Main editorial typography */}
      <motion.div className={styles.textBlock} style={{ y: textY }}>
        <motion.div className={styles.line1} {...revealUp(0)}>SEND A</motion.div>
        <motion.div className={styles.line3} {...revealUp(1)}>MOMENT</motion.div>
        <motion.div className={styles.line2} {...revealUp(2)}>NOT A</motion.div>
        <motion.div className={styles.line4} {...revealUp(3)}>MESSAGE</motion.div>
        <Link to="/create" className={styles.ctaButton} style={{ pointerEvents: 'auto' }}>
          Create your card
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.span
          className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
