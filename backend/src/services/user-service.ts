import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.js'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

/**
 * User service for handling user-related operations
 */
export class UserService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<Omit<AuthResponse, 'token'>> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
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

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<Omit<AuthResponse, 'token'>> {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
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

  /**
   * Get user by ID
   */
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
