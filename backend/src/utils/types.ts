export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}

export interface WebSocketMessage {
  type: 'chat' | 'join' | 'leave' | 'typing' | 'auth' | 'message' | 'error'
  content?: string
  userId?: number
  username?: string
  token?: string
  isTyping?: boolean
}
