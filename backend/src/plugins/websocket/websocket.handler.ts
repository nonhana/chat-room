import type { JWT } from '@fastify/jwt'
import type { FastifyRequest } from 'fastify'
import type { WebSocket } from 'ws'
import type { MessageService } from '@/modules/messages/message.service.js'
import type { JWTPayload, WebSocketMessage } from '@/utils/types.js'

export function websocketHandler(jwt: JWT, service: MessageService, clients: Map<number, WebSocket>) {
  async function handleChatMessage(content: string, user: JWTPayload) {
    try {
      const savedMessage = await service.createMessage(user.userId, {
        content,
      })

      const message = { type: 'message', ...savedMessage }

      const messageStr = JSON.stringify(message)

      for (const [, socket] of clients) {
        if (socket.readyState === 1) {
          socket.send(messageStr)
        }
      }
    }
    catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  return (socket: WebSocket, request: FastifyRequest<{ Querystring: { token?: string } }>) => {
    let currentUser: JWTPayload | null = null

    socket.on('message', async (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString()) as WebSocketMessage

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
        clients.delete(currentUser.userId)
      }
    })

    const token = request.query?.token
    if (token) {
      try {
        const decoded = jwt.verify(token) as JWTPayload
        currentUser = decoded
        clients.set(decoded.userId, socket)
        console.log(`User ${decoded.username} connected via WebSocket`)
      }
      catch {
        socket.close()
      }
    }
  }
}
