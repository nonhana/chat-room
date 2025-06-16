import type { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import websocket from '@fastify/websocket'
import Fastify from 'fastify'
import env from './env.js'

// Routes
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { websocketHandler } from './websocket/handler.js'

/**
 * Create and configure Fastify application
 */
export async function createApp() {
  const fastify = Fastify({
    logger: env.NODE_ENV === 'development',
  })

  // Register CORS plugin
  await fastify.register(cors, {
    origin: env.NODE_ENV === 'development'
      ? ['http://localhost:5173', 'http://localhost:3000']
      : false,
    credentials: true,
  })

  // Register JWT plugin
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  })

  // Add JWT authentication decorator
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    }
    catch (err) {
      reply.send(err)
    }
  })

  // Register WebSocket plugin
  await fastify.register(websocket)

  // Register routes with API prefix
  await fastify.register(async (fastify) => {
    await fastify.register(authRoutes, { prefix: '/api' })
    await fastify.register(messageRoutes, { prefix: '/api' })
  })

  // Register WebSocket handler
  await fastify.register(websocketHandler)

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return fastify
}
