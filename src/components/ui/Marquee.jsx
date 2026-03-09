import { motion } from 'framer-motion'
import styles from './Marquee.module.css'

const items = [
  'Three.js', '✦', 'React Three Fiber', '✦', 'Framer Motion', '✦', 'GSAP', '✦',
  'Lenis Scroll', '✦', 'WebGL', '✦', 'GLSL Shaders', '✦', 'Spring Physics', '✦',
  'Particle Systems', '✦', 'Morph Geometry', '✦', 'Postprocessing', '✦',
]

export default function Marquee() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fade} />
      <div className={styles.fadeRight} />
      <motion.div
        className={styles.track}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className={item === '✦' ? styles.dot : styles.item}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
