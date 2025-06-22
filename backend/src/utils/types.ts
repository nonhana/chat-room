import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export type Handler<T> = (fastify?: FastifyInstance, service?: T) =>
(request: FastifyRequest, reply: FastifyReply) =>
  Promise<FastifyReply> | FastifyReply

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

export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}

export interface GetMessagesQuery {
  limit?: number
  offset?: number
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
