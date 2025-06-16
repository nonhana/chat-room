import type { LoginForm, RegisterForm, User } from '../types/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../services/api'

/**
 * Generate a simple unique ID for tab identification
 */
const generateTabId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2)

/**
 * Storage keys
 */
const TAB_ID_KEY = 'tabId'
const getAuthTokenKey = (tabId: string): string => `auth_token_${tabId}`
const getUserKey = (tabId: string): string => `auth_user_${tabId}`

/**
 * Authentication store with tab-based isolation
 */
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  const tabId = ref<string | null>(null)
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  /**
   * Initialize tab-based authentication
   * Must be called before using any other auth methods
   */
  const init = (): void => {
    if (isInitialized.value)
      return

    // 1. Determine if this is a refresh or new navigation
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const navigationType = navigationEntries[0]?.type
    const existingTabId = sessionStorage.getItem(TAB_ID_KEY)

    // 2. Handle tab ID generation
    if (navigationType === 'navigate' || !existingTabId) {
      // Force generate new ID for new navigation or missing ID
      tabId.value = generateTabId()
      sessionStorage.setItem(TAB_ID_KEY, tabId.value)
    }
    else {
      // Use existing ID for page refresh
      tabId.value = existingTabId
    }

    // 3. Load token and user data for this tab
    if (tabId.value) {
      const storedToken = localStorage.getItem(getAuthTokenKey(tabId.value))
      const storedUser = localStorage.getItem(getUserKey(tabId.value))

      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
        }
        catch (error) {
          console.error('Failed to parse stored user data:', error)
          // Clear invalid data
          localStorage.removeItem(getAuthTokenKey(tabId.value))
          localStorage.removeItem(getUserKey(tabId.value))
        }
      }
    }

    isInitialized.value = true
    console.log(`Tab initialized with ID: ${tabId.value}`)
  }

  const login = async (credentials: LoginForm) => {
    if (!tabId.value) {
      throw new Error('Auth store not initialized. Call init() first.')
    }

    isLoading.value = true
    try {
      const response = await authApi.login(credentials)

      // Store auth data
      user.value = response.user
      token.value = response.token

      // Persist to localStorage with tab-specific keys
      localStorage.setItem(getAuthTokenKey(tabId.value), response.token)
      localStorage.setItem(getUserKey(tabId.value), JSON.stringify(response.user))

      return response
    }
    finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterForm) => {
    if (!tabId.value) {
      throw new Error('Auth store not initialized. Call init() first.')
    }

    isLoading.value = true
    try {
      const { confirmPassword: _, ...registerData } = userData
      const response = await authApi.register(registerData)

      // Store auth data
      user.value = response.user
      token.value = response.token

      // Persist to localStorage with tab-specific keys
      localStorage.setItem(getAuthTokenKey(tabId.value), response.token)
      localStorage.setItem(getUserKey(tabId.value), JSON.stringify(response.user))

      return response
    }
    finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    if (!tabId.value)
      return

    // Clear state
    user.value = null
    token.value = null

    // Clear tab-specific localStorage entries
    localStorage.removeItem(getAuthTokenKey(tabId.value))
    localStorage.removeItem(getUserKey(tabId.value))

    // Redirect to login
    router.push('/')
  }

  const restoreAuth = async () => {
    if (!isInitialized.value) {
      init()
    }

    if (token.value && user.value) {
      try {
        // Verify token is still valid
        await authApi.getMe()
      }
      catch {
        // Token is invalid, clear stored data
        logout()
      }
    }
  }

  return {
    // State
    tabId: computed(() => tabId.value),
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    isInitialized: computed(() => isInitialized.value),

    // Getters
    isAuthenticated,

    // Actions
    init,
    login,
    register,
    logout,
    restoreAuth,
  }
})
