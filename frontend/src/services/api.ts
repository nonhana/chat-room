import type { AuthResponse, LoginForm, RegisterForm } from '../types/auth'
import type { Message } from '../types/message'
import axios from 'axios'

/**
 * API client configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
})

/**
 * Get current tab's auth token
 */
function getCurrentTabToken(): string | null {
  const tabId = sessionStorage.getItem('tabId')
  if (!tabId)
    return null

  return localStorage.getItem(`auth_token_${tabId}`)
}

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = getCurrentTabToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Clear current tab's auth data
 */
function clearCurrentTabAuth(): void {
  const tabId = sessionStorage.getItem('tabId')
  if (tabId) {
    localStorage.removeItem(`auth_token_${tabId}`)
    localStorage.removeItem(`auth_user_${tabId}`)
  }
}

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token for current tab only
      clearCurrentTabAuth()
      // Redirect to login
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register new user
   */
  async register(data: Omit<RegisterForm, 'confirmPassword'>): Promise<AuthResponse> {
    const response = await apiClient.post('/register', data)
    return response.data
  },

  /**
   * Login user
   */
  async login(data: LoginForm): Promise<AuthResponse> {
    const response = await apiClient.post('/login', data)
    return response.data
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<{ user: AuthResponse['user'] }> {
    const response = await apiClient.get('/me')
    return response.data
  },
}

/**
 * Messages API
 */
export const messagesApi = {
  /**
   * Get message history
   */
  async getMessages(limit = 50, offset = 0): Promise<{
    messages: Message[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }> {
    const response = await apiClient.get('/messages', {
      params: { limit, offset },
    })
    return response.data
  },
}

export default apiClient
