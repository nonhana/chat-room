/**
 * Message types for frontend
 */

import type { User } from './auth'

export interface Message {
  id: number
  content: string
  createdAt: string
  author: User
}

export interface MessageState {
  messages: Message[]
  isLoading: boolean
  hasMore: boolean
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'join' | 'leave' | 'error' | 'auth-success' | 'chat'
  id?: number
  content?: string
  createdAt?: string
  author?: User
  userId?: number
  username?: string
  isTyping?: boolean
  message?: string
}
