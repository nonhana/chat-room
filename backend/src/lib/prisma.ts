import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import env from '../env.js'

/**
 * Global Prisma client instance
 */
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

/**
 * Gracefully disconnect from database on app termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
