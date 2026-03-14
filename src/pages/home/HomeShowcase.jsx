import { motion } from 'framer-motion'
import styles from './HomeShowcase.module.css'

const ROW_1 = [
  '/1067w-GBL7tdP2B-A.jpg',
  '/1067w-LoPZ7qsO0pY.webp',
  '/1067w-Rycs9qLPNBk.jpg',
  '/1067w-y9lMGm8uw8A.webp',
  '/1131w-Dh_rbXRZuz4.webp',
  '/1135w-ad8cLUg1kJY.webp',
  '/1135w-AxrG3hmgGM0.webp',
  '/1135w-c0BaBWV_t4M.jpg',
]

const ROW_2 = [
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

function MarqueeRow({ images, direction = 'left', duration = 40 }) {
  const doubled = [...images, ...images]
  return (
    <div className={styles.marqueeTrack}>
      <motion.div
        className={styles.marqueeInner}
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
      >
        {doubled.map((src, i) => (
          <div key={i} className={styles.marqueeCard}>
            <img src={src} alt="" draggable={false} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function HomeShowcase() {
  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.header}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Gallery
        </motion.span>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          Cards people <span className={styles.accent}>actually love</span>
        </motion.h2>
      </div>

      <div className={styles.marquees}>
        <MarqueeRow images={ROW_1} direction="left" duration={45} />
        <MarqueeRow images={ROW_2} direction="right" duration={50} />
      </div>
    </section>
  )
}
