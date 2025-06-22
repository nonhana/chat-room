import { type Static, Type } from '@sinclair/typebox'

// 注册 Schema
export const registerSchema = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 20,
    description: 'User username',
  }),
  password: Type.String({
    minLength: 6,
    description: 'User password',
  }),
  avatar: Type.Optional(Type.String({
    format: 'uri',
    description: 'User avatar URL',
  })),
})

export type RegisterType = Static<typeof registerSchema>

// 登录 Schema
export const loginSchema = Type.Object({
  username: Type.String({
    description: 'User username',
  }),
  password: Type.String({
    description: 'User password',
  }),
})

export type LoginType = Static<typeof loginSchema>

// 注册 & 登录成功
export const authResSchema = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 20,
    description: 'User username',
  }),
  password: Type.String({
    minLength: 6,
    description: 'User password',
  }),
  avatar: Type.Optional(Type.String({
    format: 'uri',
    description: 'User avatar URL',
  })),
  token: Type.String({
    description: 'User token',
  }),
})

export type AuthResType = Static<typeof authResSchema>

// 用户个人信息
export const userSchema = Type.Object({
  user: Type.Object({
    id: Type.Number({
      description: 'User ID',
    }),
    username: Type.String({
      description: 'User username',
    }),
    avatar: Type.Optional(Type.String({
      format: 'uri',
      description: 'User avatar URL',
    })),
    createdAt: Type.String({
      description: 'User created at',
    }),
  }),
})

export type UserType = Static<typeof userSchema>
