/**
 * Authentication types for frontend
 */

export interface User {
  id: number
  username: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
}
