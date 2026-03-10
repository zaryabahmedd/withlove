const STORAGE_KEY = 'cardhazza_shared_cards_v1'

export const CARD_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function generateCardId() {
  return Math.random().toString(36).substring(2, 10)
}

function base64EncodeUtf8(value) {
  return btoa(unescape(encodeURIComponent(value)))
}

function base64DecodeUtf8(value) {
  return decodeURIComponent(escape(atob(value)))
}

export function encodeSharePayload(payload) {
  return base64EncodeUtf8(JSON.stringify(payload))
}

export function decodeSharePayload(token) {
  try {
    return JSON.parse(base64DecodeUtf8(token))
  } catch {
    return null
  }
}

export function makeSharePayload(data) {
  const createdAt = Date.now()
  const expiresAt = createdAt + CARD_TTL_MS
  return {
    ...data,
    createdAt,
    expiresAt,
  }
}

export function buildShareLink(cardId, payload) {
  const token = encodeURIComponent(encodeSharePayload(payload))
  return `${window.location.origin}/card/${cardId}?data=${token}`
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function saveSharedCard(cardId, payload) {
  const store = readStore()
  store[cardId] = payload
  writeStore(store)
}

export function getStoredSharedCard(cardId) {
  const store = readStore()
  return store[cardId] || null
}

export function purgeExpiredStoredCards() {
  const now = Date.now()
  const store = readStore()
  let changed = false

  Object.keys(store).forEach((key) => {
    const item = store[key]
    if (!item || typeof item.expiresAt !== 'number' || item.expiresAt <= now) {
      delete store[key]
      changed = true
    }
  })

  if (changed) {
    writeStore(store)
  }
}

export function getCardDataFromRoute(cardId, searchParams) {
  const token = searchParams.get('data')
  const fromToken = token ? decodeSharePayload(token) : null
  const payload = fromToken || getStoredSharedCard(cardId)

  if (!payload) {
    return { status: 'missing', payload: null }
  }

  if (payload.cardId !== cardId) {
    return { status: 'missing', payload: null }
  }

  if (typeof payload.expiresAt !== 'number' || Date.now() > payload.expiresAt) {
    return { status: 'expired', payload }
  }

  return { status: 'ok', payload }
}
