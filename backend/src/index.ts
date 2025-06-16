import process from 'node:process'

/**
 * Main entry point for the chatroom backend
 */
export { createApp } from './app.js'

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./server.js')
}
