import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Heart, Zap } from 'lucide-react'
import styles from './PricingPage.module.css'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for sending heartfelt cards to loved ones',
    icon: Heart,
    features: [
      'Unlimited card creation',
      '7 beautiful templates',
      'Add photos & videos',
      'Voice messages',
      '30-day card links',
      'Mobile friendly',
    ],
    cta: 'Start Creating',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: '/month',
    description: 'For those who want to make every moment extra special',
    icon: Sparkles,
    features: [
      'Everything in Free',
      '25+ premium templates',
      'Custom color palettes',
      'HD media uploads',
      '90-day card links',
      'Priority support',
      'No watermarks',
      'Schedule delivery',
    ],
    cta: 'Go Premium',
    popular: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'Perfect for teams and businesses sending cards at scale',
    icon: Zap,
    features: [
      'Everything in Premium',
      'Unlimited templates',
      'Bulk card sending',
      'Custom branding',
      'Analytics dashboard',
      'Team management',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function PricingPage() {
  return (
    <div className={styles.page}>
      {/* Background elements */}
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.bgBlob3} />

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.badge}>Simple Pricing</span>
        <h1 className={styles.title}>
          Choose the perfect plan<br />
          <span className={styles.titleAccent}>for your moments</span>
        </h1>
        <p className={styles.subtitle}>
          Start free, upgrade when you need more. No hidden fees, cancel anytime.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <div className={styles.cardsContainer}>
        {PLANS.map((plan, i) => {
          const Icon = plan.icon
          return (
            <motion.div
              key={plan.name}
              className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <Icon size={24} />
                </div>
                <h2 className={styles.planName}>{plan.name}</h2>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.featureItem}>
                    <Check size={16} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/create"
                className={`${styles.ctaBtn} ${plan.popular ? styles.ctaPrimary : styles.ctaSecondary}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* FAQ or trust section */}
      <motion.div
        className={styles.trustSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className={styles.trustText}>
          Trusted by <strong>2.4M+</strong> people sending love around the world
        </p>
        <div className={styles.trustBadges}>
          <span>✦ No credit card required</span>
          <span>♡ Cancel anytime</span>
          <span>⚡ Instant access</span>
        </div>
      </motion.div>
    </div>
  )
}
