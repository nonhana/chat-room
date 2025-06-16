/**
 * Authentication related types
 */

export interface RegisterRequest {
  username: string
  password: string
  avatar?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    username: string
    avatar?: string
    createdAt: string
  }
  token: string
}

export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}
