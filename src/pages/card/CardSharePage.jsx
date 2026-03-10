import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cardOccasions, cardTemplates } from '../create/card-templates'
import { getCardData } from '../../utils/cardShare'
import styles from './CardSharePage.module.css'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function MediaDisplay({ media, accent }) {
  if (!media || media.length === 0) return null

  return (
    <div className={styles.mediaSection}>
      {media.map((item, i) => (
        <div key={`${item.type}-${i}`} className={styles.mediaItem}>
          {item.type === 'image' && (
            <img
              src={item.url}
              alt="Card media"
              className={styles.mediaImage}
              style={{ borderColor: `${accent}30` }}
            />
          )}
          {item.type === 'video' && (
            <video
              src={item.url}
              controls
              className={styles.mediaVideo}
              style={{ borderColor: `${accent}30` }}
            />
          )}
          {item.type === 'audio' && (
            <div className={styles.audioWrapper} style={{ background: `${accent}15`, borderColor: `${accent}30` }}>
              <audio src={item.url} controls className={styles.mediaAudio} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function CardSharePage() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    async function fetchCard() {
      const result = await getCardData(id)
      setStatus(result.status)
      setPayload(result.payload)
    }
    fetchCard()
  }, [id])

  if (status === 'loading') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <div className={styles.loader} />
          <p>Loading your card...</p>
        </div>
      </main>
    )
  }

  if (status === 'missing') {
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

  if (status === 'expired') {
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

          <MediaDisplay media={payload.media} accent={colors.accent} />

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
