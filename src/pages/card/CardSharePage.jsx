import { Link, useParams, useSearchParams } from 'react-router-dom'
import { cardOccasions, cardTemplates } from '../create/card-templates'
import { getCardDataFromRoute, purgeExpiredStoredCards } from '../../utils/cardShare'
import styles from './CardSharePage.module.css'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function CardSharePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  purgeExpiredStoredCards()
  const result = getCardDataFromRoute(id, searchParams)

  if (result.status === 'missing') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <h1>This card link is invalid</h1>
          <p>The card could not be found. Please ask the sender for a fresh link.</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.btnPrimary}>Go home</Link>
            <Link to="/create" className={styles.btnGhost}>Create your own card</Link>
          </div>
        </div>
      </main>
    )
  }

  if (result.status === 'expired') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <h1>This card has expired</h1>
          <p>Card links stay active for 30 days and then automatically expire.</p>
          <div className={styles.actions}>
            <Link to="/create" className={styles.btnPrimary}>Create another</Link>
            <Link to="/" className={styles.btnGhost}>Go home</Link>
          </div>
        </div>
      </main>
    )
  }

  const { payload } = result
  const template = cardTemplates.find((t) => t.id === payload.templateId) || cardTemplates[0]
  const occasion = cardOccasions.find((o) => o.value === payload.occasionValue) || cardOccasions[0]
  const colors = payload.customColor || {
    bg: template.bgColor,
    text: template.textColor,
    accent: template.accentColor,
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <p className={styles.meta}>
          Shared with love · Expires {formatDate(payload.expiresAt)}
        </p>

        <article
          className={styles.card}
          style={{
            background: colors.bg,
            color: colors.text,
            borderColor: `${colors.accent}40`,
          }}
        >
          <div className={styles.badge} style={{ background: colors.accent }}>
            {occasion.emoji} {occasion.label}
          </div>

          <h1 className={styles.to}>To {payload.recipientName || 'You'}</h1>

          <p className={styles.message}>
            {payload.message || 'A heartfelt message was shared with you.'}
          </p>

          <div className={styles.signatureRow} style={{ borderTopColor: `${colors.accent}40` }}>
            <span className={styles.signatureLabel} style={{ color: colors.accent }}>From</span>
            <span className={styles.signatureName}>{payload.senderName || 'Someone special'}</span>
          </div>
        </article>

        <div className={styles.actions}>
          <Link to="/create" className={styles.btnPrimary}>Create your own</Link>
          <Link to="/" className={styles.btnGhost}>Go home</Link>
        </div>
      </div>
    </main>
  )
}
