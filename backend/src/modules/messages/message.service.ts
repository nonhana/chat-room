import type { CreateMsgResType, CreateMsgType } from './message.schema.js'
import { prisma } from '@/lib/prisma.js'

export class MessageService {
  async createMessage(authorId: number, data: CreateMsgType): Promise<CreateMsgResType> {
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

  async getMessages(limit = 50, offset = 0): Promise<CreateMsgResType[]> {
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
      .reverse()
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

  async getMessagesCount(): Promise<number> {
    return await prisma.message.count()
  }
}

export const messageService = new MessageService()
