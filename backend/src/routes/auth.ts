import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { LoginRequest, RegisterRequest } from '../types/auth.js'
import { UserService } from '../services/user-service.js'

/**
 * Authentication routes plugin
 */
export async function authRoutes(fastify: FastifyInstance) {
  const userService = new UserService()

  // Register schema
  const registerSchema = {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string', minLength: 3, maxLength: 20 },
        password: { type: 'string', minLength: 6 },
        avatar: { type: 'string', format: 'uri' },
      },
    },
  }

  // Login schema
  const loginSchema = {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  }

  /**
   * Register new user
   */
  fastify.post('/register', { schema: registerSchema }, async (
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await userService.register(request.body)

      // Generate JWT token
      const token = fastify.jwt.sign({
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
  })

  /**
   * Login user
   */
  fastify.post('/login', { schema: loginSchema }, async (
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await userService.login(request.body)

      // Generate JWT token
      const token = fastify.jwt.sign({
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
  })

  /**
   * Get current user info (protected route)
   */
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user!
      const userInfo = await userService.getUserById(user.userId)

      return reply.send({ user: userInfo })
    }
    catch {
      return reply.code(404).send({
        error: 'User not found',
      })
    }
  })
}
