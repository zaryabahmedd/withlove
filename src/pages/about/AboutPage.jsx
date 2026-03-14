import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Users, Globe, Sparkles } from 'lucide-react'
import styles from './AboutPage.module.css'

const STATS = [
  { value: '2.4M+', label: 'Cards sent with love' },
  { value: '180+', label: 'Countries reached' },
  { value: '99.9%', label: 'Happiness rate' },
  { value: '24/7', label: 'Spreading joy' },
]

const VALUES = [
  {
    icon: Heart,
    title: 'Love First',
    description: 'Every feature we build starts with one question: will this help people express love better?',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Whether you\'re tech-savvy or not, creating beautiful cards should be effortless and free.',
  },
  {
    icon: Globe,
    title: 'Global Warmth',
    description: 'Love knows no borders. We\'re building tools that connect hearts across the world.',
  },
  {
    icon: Sparkles,
    title: 'Magic in Details',
    description: 'The little things matter. We obsess over every animation, color, and word to make moments special.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>
      {/* Background elements */}
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />

      {/* Hero section */}
      <section id="our-story" className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span className={styles.badge}>Our Story</span>
          <h1 className={styles.heroTitle}>
            We believe every moment<br />
            <span className={styles.titleAccent}>deserves more than a message</span>
          </h1>
          <p className={styles.heroSubtitle}>
            In a world of quick texts and forgotten emojis, we're on a mission to bring back 
            the art of heartfelt expression. Because the people you love deserve something beautiful.
          </p>
        </motion.div>
      </section>

      {/* Stats section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story section */}
      <section className={styles.storySection}>
        <motion.div
          className={styles.storyContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>How it started</h2>
          <div className={styles.storyText}>
            <p>
              It began with a birthday. A friend thousands of miles away, and nothing but a generic 
              "HBD 🎂" text to send. That moment of disconnect sparked something—what if we could 
              send more than just words?
            </p>
            <p>
              We built cardhazza to be the bridge between intention and expression. A place where 
              you can pour your heart into something tangible, something beautiful, something that 
              makes the recipient feel truly seen.
            </p>
            <p>
              Today, millions of cards carry love across continents, turning ordinary moments into 
              extraordinary memories. And we're just getting started.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values section */}
      <section className={styles.valuesSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          What we stand for
        </motion.h2>
        <div className={styles.valuesGrid}>
          {VALUES.map((value, i) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                className={styles.valueCard}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className={styles.valueIcon}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.ctaTitle}>Ready to send some love?</h2>
          <p className={styles.ctaSubtitle}>
            Join millions of people making moments matter.
          </p>
          <Link to="/create" className={styles.ctaButton}>
            Create your first card
            <motion.span
              style={{ marginLeft: 8 }}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
