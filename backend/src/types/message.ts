/**
 * Message related types
 */

export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}

export interface MessageResponse {
  id: number
  content: string
  createdAt: string
  author: {
    id: number
    username: string
    avatar?: string
  }
}

export interface CreateMessageRequest {
  content: string
}

export interface WebSocketMessage {
  type: 'chat' | 'join' | 'leave' | 'typing' | 'auth' | 'message' | 'error'
  content?: string
  userId?: number
  username?: string
  token?: string
  isTyping?: boolean
}
