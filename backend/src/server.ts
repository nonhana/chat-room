import process from 'node:process'
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
})

fastify.get('/', async () => {
  return { message: 'Hello from Fastify!' }
})

async function start() {
  try {
    const port = process.env.PORT ?? '3000'
    await fastify.listen({ port: Number.parseInt(port) })
    console.log(`Server running on port ${port}`)
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
