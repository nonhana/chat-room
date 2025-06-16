import type { CreateMessageRequest, MessageResponse } from '../types/message.js'
import { prisma } from '../lib/prisma.js'

/**
 * Message service for handling message-related operations
 */
export class MessageService {
  /**
   * Create a new message
   */
  async createMessage(authorId: number, data: CreateMessageRequest): Promise<MessageResponse> {
    const message = await prisma.message.create({
      data: {
        content: data.content,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      author: {
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.avatar ?? '',
      },
    }
  }

  /**
   * Get message history with pagination
   */
  async getMessages(limit = 50, offset = 0): Promise<MessageResponse[]> {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    return messages
      .reverse() // Reverse to get chronological order
      .map(message => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        author: {
          id: message.author.id,
          username: message.author.username,
          avatar: message.author.avatar ?? '',
        },
      }))
  }

  /**
   * Get messages count
   */
  async getMessagesCount(): Promise<number> {
    return await prisma.message.count()
  }
}
