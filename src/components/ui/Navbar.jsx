import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { NavLogo } from './Logo'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'My Cards', icon: '♡', href: '#' },
  { label: 'Features', icon: null, href: '#features' },
  { label: 'Pricing', icon: null, href: '#' },
]

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated gradient border bottom */}
        <div className={styles.borderGlow} />

        {/* Left: Logo */}
        <NavLogo />

        {/* Center: Nav links — absolutely centered */}
        <nav className={styles.linksWrap}>
          <ul className={styles.links}>
            {navLinks.map(({ label, icon, href }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.a
                  href={href}
                  className={styles.link}
                  whileHover="hovered"
                  initial="idle"
                >
                  {icon && <span className={styles.linkIcon}>{icon}</span>}
                  <span>{label}</span>
                  <motion.span
                    className={styles.linkDot}
                    variants={{
                      idle:    { scaleX: 0, opacity: 0 },
                      hovered: { scaleX: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.18 }}
                  />
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className={styles.actions}>
          {/* Language */}
          <motion.button
            className={styles.langBtn}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            🌐 <span>EN</span>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            className={styles.themeToggle}
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: isDark ? -90 : 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: isDark ? 90 : -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'block', lineHeight: 1, fontSize: '1rem' }}
              >
                {isDark ? '☀️' : '🌙'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* CTA */}
          <motion.button
            className={styles.cta}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/create')}
          >
            <span className={styles.ctaShimmer} />
            <motion.span
              className={styles.ctaIcon}
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
            Create your Card
            <span className={styles.ctaArrow}>→</span>
          </motion.button>
        </div>

        {/* Mobile hamburger — animates to × */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 }}  transition={{ duration: 0.25 }} />
          <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
        </button>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.mobileInner}>
                {navLinks.map(({ label, icon }, i) => (
                  <motion.a
                    key={label}
                    href="#"
                    className={styles.mobileLink}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {icon && <span className={styles.mobileLinkIcon}>{icon}</span>}
                    {label}
                  </motion.a>
                ))}
                <motion.a
                  href="#"
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                >
                  🌐 EN
                </motion.a>
                <motion.button
                  className={styles.ctaMobile}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setMenuOpen(false); navigate('/create'); }}
                >
                  ✦ Create your Card →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
