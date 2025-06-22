import type { JWT } from '@fastify/jwt'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginType, RegisterType } from './user.schema.js'
import type { UserService } from './user.service.js'

export function registerHandler(jwt: JWT, service: UserService) {
  return async (
    request: FastifyRequest<{ Body: RegisterType }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await service.register(request.body)

      const token = jwt.sign({
        userId: result.user.id,
        username: result.user.username,
      })

      return reply.code(201).send({
        ...result,
        token,
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      return reply.code(400).send({
        error: message,
      })
    }
  }
}

export function loginHandler(jwt: JWT, service: UserService) {
  return async (
    request: FastifyRequest<{ Body: LoginType }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await service.login(request.body)

      const token = jwt.sign({
        userId: result.user.id,
        username: result.user.username,
      })

      return reply.send({
        ...result,
        token,
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      return reply.code(401).send({
        error: message,
      })
    }
  }
}

export function getUserHandler(service: UserService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user
      const userInfo = await service.getUserById(user.userId)

      return reply.send({ user: userInfo })
    }
    catch {
      return reply.code(404).send({
        error: 'User not found',
      })
    }
  }
}
