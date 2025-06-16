import process from 'node:process'
import { createApp } from './app.js'
import env from './env.js'

/**
 * Start the server
 */
async function start() {
  try {
    const app = await createApp()
    const port = env.PORT
    const host = env.HOST

    await app.listen({ port, host })
    console.log(`🚀 Chatroom server running on http://${host}:${port}`)
    console.log(`📡 WebSocket endpoint: ws://${host}:${port}/ws`)
  }
  catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
