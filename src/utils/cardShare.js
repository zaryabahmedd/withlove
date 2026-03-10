import { supabase, STORAGE_BUCKET } from './supabase'

export const CARD_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function generateCardId() {
  return Math.random().toString(36).substring(2, 10)
}

export function buildShareLink(cardId) {
  return `${window.location.origin}/card/${cardId}`
}

/**
 * Upload a media file to Supabase Storage
 * @param {File|Blob} file - The file to upload
 * @param {string} cardId - The card ID to associate the file with
 * @returns {Promise<string|null>} - Public URL or null if failed
 */
export async function uploadMedia(file, cardId) {
  const ext = file.name?.split('.').pop() || (file.type?.split('/')[1] || 'bin')
  const filename = `${cardId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  return urlData?.publicUrl || null
}

/**
 * Convert a blob URL to a File object for upload
 * @param {string} blobUrl - The blob URL
 * @param {string} filename - The filename
 * @returns {Promise<File|null>}
 */
export async function blobUrlToFile(blobUrl, filename) {
  try {
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (err) {
    console.error('Failed to convert blob URL:', err)
    return null
  }
}

/**
 * Save card to Supabase database
 * @param {string} cardId
 * @param {object} payload
 * @returns {Promise<boolean>}
 */
export async function saveSharedCard(cardId, payload) {
  const { error } = await supabase
    .from('shared_cards')
    .insert({
      id: cardId,
      recipient_name: payload.recipientName || null,
      sender_name: payload.senderName || null,
      message: payload.message || null,
      occasion_value: payload.occasionValue,
      template_id: payload.templateId,
      custom_color: payload.customColor || null,
      media: payload.media || [],
      created_at: new Date(payload.createdAt).toISOString(),
      expires_at: new Date(payload.expiresAt).toISOString(),
    })

  if (error) {
    console.error('Failed to save card:', error)
    return false
  }
  return true
}

/**
 * Fetch card from Supabase database
 * @param {string} cardId
 * @returns {Promise<{status: string, payload: object|null}>}
 */
export async function getCardData(cardId) {
  const { data, error } = await supabase
    .from('shared_cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (error || !data) {
    return { status: 'missing', payload: null }
  }

  const expiresAt = new Date(data.expires_at).getTime()
  if (Date.now() > expiresAt) {
    return { status: 'expired', payload: formatPayload(data) }
  }

  return { status: 'ok', payload: formatPayload(data) }
}

function formatPayload(data) {
  return {
    cardId: data.id,
    recipientName: data.recipient_name,
    senderName: data.sender_name,
    message: data.message,
    occasionValue: data.occasion_value,
    templateId: data.template_id,
    customColor: data.custom_color,
    media: data.media || [],
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime(),
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
