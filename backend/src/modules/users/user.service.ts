import type { LoginType, RegisterType } from './user.schema.js'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma.js'

export class UserService {
  async register(data: RegisterType) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUser) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        avatar: data.avatar ?? '',
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    })

    return {
      user: {
        ...user,
        avatar: user.avatar ?? '',
        createdAt: user.createdAt.toISOString(),
      },
    }
  }

  async login(data: LoginType) {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar ?? '',
        createdAt: user.createdAt.toISOString(),
      },
    }
  }

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    }
  }
}

export const userService = new UserService()
