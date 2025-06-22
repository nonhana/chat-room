import { type Static, Type } from '@sinclair/typebox'

export const getMsgsSchema = Type.Object({
  limit: Type.Number({ minimum: 1, maximum: 100, default: 50 }),
  offset: Type.Number({ minimum: 0, default: 0 }),
})

export type GetMsgsType = Static<typeof getMsgsSchema>

export const createMsgSchema = Type.Object({
  content: Type.String({ description: 'Message content' }),
})

export type CreateMsgType = Static<typeof createMsgSchema>

export const createMsgResSchema = Type.Object({
  id: Type.Number({ description: 'Message ID' }),
  content: Type.String({ description: 'Message content' }),
  createdAt: Type.String({ description: 'Message creation timestamp' }),
  author: Type.Object({
    id: Type.Number({ description: 'Author ID' }),
    username: Type.String({ description: 'Author username' }),
    avatar: Type.String({ description: 'Author avatar URL' }),
  }),
})

export type CreateMsgResType = Static<typeof createMsgResSchema>

export const getMsgsResSchema = Type.Object({
  messages: Type.Array(createMsgResSchema, { description: 'Array of messages' }),
  pagination: Type.Object({
    total: Type.Number({ description: 'Total number of messages' }),
    limit: Type.Number({ description: 'Number of messages per page' }),
    offset: Type.Number({ description: 'Offset for pagination' }),
    hasMore: Type.Boolean({ description: 'Whether there are more messages to fetch' }),
  }),
})

export type GetMsgsResType = Static<typeof getMsgsResSchema>
