import type { FastifyInstance } from 'fastify'
import { getUserHandler, loginHandler, registerHandler } from './user.controller.js'
import { authResSchema, loginSchema, registerSchema, userSchema } from './user.schema.js'
import { UserService } from './user.service.js'

/**
 * Authentication routes plugin
 */
export async function authRoutes(fastify: FastifyInstance) {
  const userService = new UserService()

  /**
   * Register new user
   */
  fastify.post('/register', { schema: { body: registerSchema, response: { 201: authResSchema } } }, registerHandler(fastify.jwt, userService))

  /**
   * Login user
   */
  fastify.post('/login', { schema: { body: loginSchema, response: { 200: authResSchema } } }, loginHandler(fastify.jwt, userService))

  /**
   * Get current user info (protected route)
   */
  fastify.get('/me', { schema: { response: { 200: userSchema } }, preHandler: [fastify.authenticate] }, getUserHandler(userService))
}
