import type { FastifyInstance } from 'fastify'
import { MessageService } from '../services/message-service.js'

/**
 * Message routes plugin
 */
export async function messageRoutes(fastify: FastifyInstance) {
  const messageService = new MessageService()

  // Define route interface
  interface GetMessagesQuery {
    limit?: number
    offset?: number
  }

  // Get messages schema
  const getMessagesSchema = {
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
        offset: { type: 'integer', minimum: 0, default: 0 },
      },
    },
  }

  /**
   * Get message history (protected)
   */
  fastify.get<{ Querystring: GetMessagesQuery }>('/messages', {
    schema: getMessagesSchema,
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { limit = 50, offset = 0 } = request.query
      const messages = await messageService.getMessages(limit, offset)
      const total = await messageService.getMessagesCount()

      return reply.send({
        messages,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    }
    catch {
      return reply.code(500).send({
        error: 'Failed to fetch messages',
      })
    }
  })
}
