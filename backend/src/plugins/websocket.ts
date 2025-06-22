import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { WebSocket } from 'ws'
import type { JWTPayload, WebSocketMessage } from '../utils/types.js'
import { MessageService } from '@/modules/messages/message.service.js'

const connectedClients = new Map<number, WebSocket>()

export async function websocketHandler(fastify: FastifyInstance) {
  const messageService = new MessageService()

  fastify.get('/ws', { websocket: true }, (socket: WebSocket, request: FastifyRequest<{ Querystring: { token?: string } }>) => {
    let currentUser: JWTPayload | null = null

    socket.on('message', async (rawMessage) => {
      try {
        const message: WebSocketMessage = JSON.parse(rawMessage.toString())

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

    socket.on('close', () => {
      if (currentUser) {
        connectedClients.delete(currentUser.userId)
      }
    })

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

    async function handleChatMessage(content: string, user: JWTPayload) {
      try {
        const savedMessage = await messageService.createMessage(user.userId, {
          content,
        })

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

  function broadcastToAll(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message)
    for (const [, socket] of connectedClients) {
      if (socket.readyState === 1) {
        socket.send(messageStr)
      }
    }
  }
}
