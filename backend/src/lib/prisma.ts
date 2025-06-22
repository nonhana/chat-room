import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import env from '@/config/env.js'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
