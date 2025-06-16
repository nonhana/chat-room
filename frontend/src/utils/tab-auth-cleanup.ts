/**
 * Tab-based authentication cleanup utility
 */

const LAST_ACTIVITY_KEY_PREFIX = 'auth_activity_'
const AUTH_TOKEN_KEY_PREFIX = 'auth_token_'
const AUTH_USER_KEY_PREFIX = 'auth_user_'

// Consider tokens older than 7 days as stale
const STALE_THRESHOLD = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

/**
 * Record activity for current tab
 */
export function recordTabActivity(): void {
  const tabId = sessionStorage.getItem('tabId')
  if (tabId) {
    localStorage.setItem(`${LAST_ACTIVITY_KEY_PREFIX}${tabId}`, Date.now().toString())
  }
}

/**
 * Clean up stale authentication data
 * Should be called periodically or on app startup
 */
export function cleanupStaleAuthData(): void {
  const now = Date.now()
  const itemsToRemove: string[] = []

  // Go through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key)
      continue

    // Find activity tracking entries
    if (key.startsWith(LAST_ACTIVITY_KEY_PREFIX)) {
      const tabId = key.substring(LAST_ACTIVITY_KEY_PREFIX.length)
      const lastActivity = Number.parseInt(localStorage.getItem(key) || '0', 10)

      // If stale, mark related items for removal
      if (now - lastActivity > STALE_THRESHOLD) {
        itemsToRemove.push(key) // activity record
        itemsToRemove.push(`${AUTH_TOKEN_KEY_PREFIX}${tabId}`) // token
        itemsToRemove.push(`${AUTH_USER_KEY_PREFIX}${tabId}`) // user data
      }
    }
  }

  // Remove stale items
  itemsToRemove.forEach((key) => {
    localStorage.removeItem(key)
  })

  if (itemsToRemove.length > 0) {
    console.log(`Cleaned up ${itemsToRemove.length / 3} stale authentication entries`)
  }
}

/**
 * Initialize cleanup for current session
 * Should be called when the app starts
 */
export function initializeAuthCleanup(): void {
  // Record activity for current tab
  recordTabActivity()

  // Clean up stale data
  cleanupStaleAuthData()

  // Set up periodic activity recording (every 5 minutes)
  const activityInterval = setInterval(recordTabActivity, 5 * 60 * 1000)

  // Clean up interval when page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(activityInterval)
  })
}
