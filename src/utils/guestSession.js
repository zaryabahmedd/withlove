const GUEST_KEY = 'cardhazza_guest_user_v1'

export function ensureGuestSession() {
  try {
    const existingRaw = localStorage.getItem(GUEST_KEY)
    if (existingRaw) {
      const parsed = JSON.parse(existingRaw)
      if (parsed && parsed.id) {
        return parsed
      }
    }
  } catch {
    // Fall through and create a new guest.
  }

  const id = `guest_${Math.random().toString(36).slice(2, 10)}`
  const guest = {
    id,
    displayName: 'Guest',
    createdAt: Date.now(),
  }

  localStorage.setItem(GUEST_KEY, JSON.stringify(guest))
  return guest
}
