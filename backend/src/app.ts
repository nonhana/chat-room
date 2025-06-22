import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import websocket from '@fastify/websocket'
import Fastify from 'fastify'
import env from './config/env.js'
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { websocketHandler } from './websocket/handler.js'

export async function createApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development',
  })

  await app.register(cors, {
    origin: env.NODE_ENV === 'development'
      ? ['http://localhost:5173', 'http://localhost:3000']
      : false,
    credentials: true,
  })

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    }
    catch (err) {
      reply.send(err)
    }
  })

  await app.register(websocket)

  await app.register(async (fastify) => {
    await fastify.register(authRoutes, { prefix: '/api' })
    await fastify.register(messageRoutes, { prefix: '/api' })
  })

  await app.register(websocketHandler)

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return app
}
