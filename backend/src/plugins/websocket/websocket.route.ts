import type { FastifyInstance } from 'fastify'
import type { WebSocket } from 'ws'
import { messageService } from '@/modules/messages/message.service.js'
import { websocketHandler } from './websocket.handler.js'

const connectedClients = new Map<number, WebSocket>()

export async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, websocketHandler(fastify.jwt, messageService, connectedClients))
}
