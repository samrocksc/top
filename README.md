# Tens Application

This is a full-stack application with:
- Frontend admin panel built with Next.js and TypeScript
- Client frontend built with Next.js and TypeScript
- Backend API built with Express and TypeScript
- PostgreSQL database
- Redis cache

## Project Structure

```
.
├── backend/          # Express TypeScript API
│   ├── src/          # Source code
│   │   ├── db/       # Database layer with Prisma
│   │   └── index.ts  # Main server file
│   ├── prisma/       # Prisma schema and migrations
│   └── package.json  # Backend dependencies
├── frontend/         # Admin panel (Next.js)
├── client/           # Client frontend (Next.js)
├── docker-compose.yml # Docker services configuration
└── Makefile          # Build and deployment commands
```

## Getting Started

1. **Install dependencies:**
   ```bash
   make install-deps
   ```

2. **Start the database and cache services:**
   ```bash
   make start
   ```

3. **Run database migrations:**
   ```bash
   make migrate-dev
   ```

4. **Start the backend:**
   ```bash
   make backend-dev
   ```

5. **Start the frontend admin panel:**
   ```bash
   make frontend-dev
   ```

6. **Start the client frontend:**
   ```bash
   make client-dev
   ```

## Available Commands

- `make setup` - Set up the entire application
- `make start` - Start all services
- `make stop` - Stop all services
- `make backend-dev` - Start backend in development mode
- `make frontend-dev` - Start frontend in development mode
- `make client-dev` - Start client in development mode
- `make migrate-dev` - Run database migrations for development
- `make generate` - Generate Prisma client
- `make reset-db` - Reset the database
- `make logs` - View logs for all services
- `make clean` - Stop and remove all containers

## Services

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Backend API**: localhost:8000
- **Frontend Admin**: localhost:3000
- **Client Frontend**: localhost:3001
