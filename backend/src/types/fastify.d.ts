import type { FastifyReply, FastifyRequest } from 'fastify'
import 'fastify'
import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: number
      username: string
    }
    user: {
      userId: number
      username: string
    }
  }
}
