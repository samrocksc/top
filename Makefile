# Makefile for managing the application

# Variables
DOCKER_COMPOSE = docker-compose
NPM = npm
PRISMA = npx prisma

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  setup            - Set up the entire application"
	@echo "  start            - Start all services"
	@echo "  stop             - Stop all services"
	@echo "  dev              - Start backend and frontend in development mode"
	@echo "  backend-dev      - Start backend in development mode"
	@echo "  client-dev       - Start client in development mode (also starts backend)"
	@echo "  client-env-setup - Set up client environment with Auth0 configuration"
	@echo "  migrate-dev      - Run database migrations for development"
	@echo "  migrate-deploy   - Run database migrations for production"
	@echo "  generate         - Generate Prisma client"
	@echo "  reset-db         - Reset the database"
	@echo "  logs             - View logs for all services"
	@echo "  clean            - Stop and remove all containers"
	@echo "  generate-frontend-types - Generate frontend TypeScript types from OpenAPI spec"

# Setup the entire application
.PHONY: setup
setup: install-deps generate migrate-dev client-env-setup

# Install dependencies for all services
.PHONY: install-deps
install-deps:
	@echo "Installing backend dependencies..."
	cd backend && $(NPM) install --legacy-peer-deps
	@echo "Installing client dependencies..."
	cd client && $(NPM) install --legacy-peer-deps

# Generate Prisma client
.PHONY: generate
generate:
	@echo "Generating Prisma client..."
	cd backend && $(PRISMA) generate

# Start all services
.PHONY: start
start:
	@echo "Starting all services..."
	$(DOCKER_COMPOSE) up -d

# Run database migrations for development
.PHONY: migrate-dev
migrate-dev:
	@echo "Running database migrations..."
	cd backend && $(PRISMA) migrate dev --name init

# Run database migrations for production
.PHONY: migrate-deploy
migrate-deploy:
	@echo "Running production database migrations..."
	cd backend && $(PRISMA) migrate deploy

# Start all services
.PHONY: start
start:
	@echo "Starting all services..."
	$(DOCKER_COMPOSE) up -d

# Stop all services
.PHONY: stop
stop:
	@echo "Stopping all services..."
	$(DOCKER_COMPOSE) down

# Start backend in development mode
.PHONY: backend-dev
backend-dev:
	@echo "Starting backend in development mode..."
	cd backend && $(NPM) run dev

# Set up client environment with Auth0 configuration
.PHONY: client-env-setup
client-env-setup:
	@echo "Setting up client environment..."
	@cd client && $(NPM) run setup-env

# Start client in development mode
.PHONY: client-dev
client-dev: client-env-setup
	@echo "Starting client in development mode..."
	cd client && $(NPM) run dev

# Reset the database
.PHONY: reset-db
reset-db:
	@echo "Resetting the database..."
	cd backend && $(PRISMA) migrate reset

# View logs for all services
.PHONY: logs
logs:
	@echo "Viewing logs for all services..."
	$(DOCKER_COMPOSE) logs -f

# Stop and remove all containers
.PHONY: clean
clean:
	@echo "Cleaning up..."
	@pkill -f "ts-node src/server.ts" || true
	$(DOCKER_COMPOSE) down -v

# Reset and rebuild everything
.PHONY: rebuild
rebuild: clean setup start

.PHONY: generate-frontend-types
generate-frontend-types:
	@echo "Generating frontend types from OpenAPI spec..."
	@cd client && npx @hey-api/openapi-ts

# Start backend and frontend in development mode
.PHONY: dev
dev: client-dev

# Start client in development mode
.PHONY: client-dev
client-dev: client-env-setup
	@echo "Starting backend in background and client in development mode..."
	@cd backend && $(NPM) run dev > /tmp/backend.log 2>&1 & \
	echo "Waiting for backend to start..."; \
	sleep 5; \
	echo "Generating frontend types..."; \
	$(MAKE) generate-frontend-types; \
	echo "Backend started and types generated."; \
	echo "Starting client in development mode..."; \
	cd client && $(NPM) run dev
