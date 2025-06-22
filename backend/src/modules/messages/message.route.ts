import type { FastifyInstance } from 'fastify'
import { getMessagesHandler } from './message.controller.js'
import { getMsgsResSchema, getMsgsSchema } from './message.schema.js'
import { MessageService } from './message.service.js'

/**
 * Message routes plugin
 */
export async function messageRoutes(fastify: FastifyInstance) {
  const messageService = new MessageService()

  /**
   * Get message history (protected)
   */
  fastify.get('/messages', {
    schema: {
      querystring: getMsgsSchema,
      response: { 200: getMsgsResSchema },
    },
    preHandler: [fastify.authenticate],
  }, getMessagesHandler(messageService))
}
