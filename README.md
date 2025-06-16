# 🚀 Chatroom Demo

A modern real-time chat application built with Vue 3 + Fastify + TypeScript in a monorepo architecture.

## ✨ Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 💬 **Real-time Messaging** - WebSocket-powered instant messaging
- 👥 **Typing Indicators** - See when others are typing
- 📱 **Responsive Design** - Beautiful Telegram-inspired UI with UnoCSS
- 🎯 **Type Safety** - Full TypeScript coverage across frontend and backend
- 📦 **Monorepo Structure** - Clean separation with pnpm workspaces

## 🛠️ Tech Stack

### Frontend
- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** for type safety
- **Pinia** for state management
- **UnoCSS** for atomic styling
- **Axios** for HTTP requests
- **VueUse** for composables

### Backend
- **Fastify** as the web framework
- **TypeScript** for server-side type safety
- **Prisma** with PostgreSQL for database
- **JWT** for authentication
- **WebSocket** for real-time communication
- **bcryptjs** for password hashing

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **PostgreSQL** database (local or cloud)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd chatroom-demo
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database and update the connection string:

```bash
# In backend directory, create .env file
cd backend
cp .env.example .env
# Edit .env with your database URL
```

Example `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chatroom?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
NODE_ENV=development
```

### 3. Generate Prisma Client and Run Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start Development Servers

In separate terminals:

```bash
# Terminal 1: Start backend
cd backend
pnpm dev

# Terminal 2: Start frontend
cd frontend
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000/ws

## 📁 Project Structure

```
chatroom-demo/
├── backend/                 # Fastify backend
│   ├── src/
│   │   ├── app.ts          # Main Fastify app
│   │   ├── server.ts       # Server startup
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Utilities
│   │   └── websocket/      # WebSocket handlers
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/               # Vue 3 frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page components
│   │   ├── stores/         # Pinia stores
│   │   ├── services/       # API clients
│   │   ├── types/          # TypeScript types
│   │   └── App.vue
│   ├── uno.config.ts       # UnoCSS configuration
│   └── package.json
├── pnpm-workspace.yaml     # Monorepo configuration
└── README.md
```

## 🎨 UI Components

The application features a clean, modern interface inspired by Telegram:

- **Login/Register** - Responsive authentication forms
- **Chat Interface** - Message bubbles with avatars and timestamps
- **Message Input** - Auto-resizing textarea with send button
- **Typing Indicators** - Real-time typing status
- **User Dropdown** - Profile info and logout option

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (protected)

### Messages
- `GET /api/messages` - Get message history (protected)

### WebSocket
- `GET /ws?token=<jwt>` - WebSocket connection for real-time chat

## 🧑‍💻 Development

### Adding New Features

1. **Backend**: Add routes in `backend/src/routes/`
2. **Frontend**: Add components in `frontend/src/components/`
3. **Types**: Update TypeScript interfaces in both `types/` directories
4. **Database**: Modify `prisma/schema.prisma` and run migrations

### Code Style

The project uses:
- **ESLint** with @antfu/eslint-config
- **TypeScript** strict mode
- **Prettier** for code formatting

Run linting:
```bash
pnpm lint
pnpm lint:fix
```

## 🚢 Production Deployment

### Build the Application

```bash
# Build both frontend and backend
pnpm build
```

### Environment Variables

Set the following environment variables in production:

```env
DATABASE_URL=<your-production-database-url>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=3000
VITE_API_URL=<your-backend-url>
```

### Run Production

```bash
# Start the backend server
cd backend
pnpm start
```

Serve the frontend build files (`frontend/dist/`) using a web server like Nginx.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vue 3](https://vuejs.org/) for the reactive frontend framework
- [Fastify](https://www.fastify.io/) for the fast web framework
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [UnoCSS](https://unocss.dev/) for the atomic CSS engine

---

**Happy chatting! 💬**
