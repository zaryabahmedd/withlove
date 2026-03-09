import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

const logoSrc = '/With_Love_transparent_1767397236984-CNLkaJTe.png'
const MotionLink = motion(Link)

// Navbar variant — small, subtle entrance + hover wiggle
export function NavLogo() {
  return (
    <MotionLink
      to="/home"
      className={styles.navLogoWrap}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
    >
      <motion.img
        src={logoSrc}
        alt="With Love"
        className={styles.navLogoImg}
        variants={{
          hover: {
            scale: 1.08,
            rotate: [0, -4, 4, -2, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
          },
        }}
      />
    </MotionLink>
  )
}

// Hero / banner variant — large, multi-layer animated entrance
export function HeroLogo() {
  return (
    <motion.div className={styles.heroLogoWrap}>
      {/* Outer glow ring pulse */}
      <motion.div
        className={styles.glowRing}
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.35, 0.12, 0.35],
        }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
      />

      {/* Inner glow ring */}
      <motion.div
        className={styles.glowRingInner}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* The logo image — floats + gentle rotation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={logoSrc}
          alt="With Love"
          className={styles.heroLogoImg}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default NavLogo

