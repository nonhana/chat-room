# Chatroom Backend

Fastify-based backend for the chatroom application.

## Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatroom?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3000

# Development
NODE_ENV=development
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up your database and create the `.env` file

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start development server:

```bash
pnpm dev
```

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (protected)
- `GET /api/messages` - Get message history (protected)
- `GET /ws?token=<jwt>` - WebSocket connection

## Development

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues

## License

MIT
