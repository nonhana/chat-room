import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { WebSocket } from 'ws'
import type { JWTPayload, WebSocketMessage } from '../types/message.js'
import { MessageService } from '../services/message-service.js'

/**
 * Connected clients store
 */
const connectedClients = new Map<number, WebSocket>()

/**
 * WebSocket plugin for real-time messaging
 */
export async function websocketHandler(fastify: FastifyInstance) {
  const messageService = new MessageService()

  /**
   * WebSocket connection handler
   */
  fastify.get('/ws', { websocket: true }, (socket: WebSocket, request: FastifyRequest<{ Querystring: { token: string } }>) => {
    let currentUser: JWTPayload | null = null

    // Handle connection
    socket.on('message', async (rawMessage) => {
      try {
        const message: WebSocketMessage = JSON.parse(rawMessage.toString())

        // Handle different message types
        switch (message.type) {
          case 'chat':
            if (currentUser && message.content) {
              await handleChatMessage(message.content, currentUser)
            }
            break
        }
      }
      catch (error) {
        console.error('WebSocket message error:', error)
      }
    })

    // Handle connection close
    socket.on('close', () => {
      if (currentUser) {
        connectedClients.delete(currentUser.userId)
      }
    })

    // Authenticate on connection (using query token)
    const token = request.query?.token
    if (token) {
      try {
        const decoded = fastify.jwt.verify(token) as JWTPayload
        currentUser = decoded
        connectedClients.set(decoded.userId, socket)
        console.log(`User ${decoded.username} connected via WebSocket`)
      }
      catch {
        socket.close()
      }
    }

    /**
     * Handle chat message
     */
    async function handleChatMessage(content: string, user: JWTPayload) {
      try {
        // Save message to database
        const savedMessage = await messageService.createMessage(user.userId, {
          content,
        })

        // Broadcast to all connected clients
        broadcastToAll({
          type: 'message',
          ...savedMessage,
        })
      }
      catch (error) {
        console.error('Failed to save message:', error)
      }
    }
  })

  /**
   * Broadcast message to all connected clients
   */
  function broadcastToAll(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message)
    for (const [, socket] of connectedClients) {
      if (socket.readyState === 1) {
        socket.send(messageStr)
      }
    }
  }
}
