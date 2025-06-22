import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetMsgsType } from './message.schema.js'
import type { MessageService } from './message.service.js'

export function getMessagesHandler(service: MessageService) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    try {
      const query = request.query as GetMsgsType
      const { limit = 50, offset = 0 } = query

      const messages = await service.getMessages(limit, offset)
      const total = await service.getMessagesCount()

      return reply.code(200).send({
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
  }
}
