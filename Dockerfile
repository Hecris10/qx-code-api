# Builder stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application files and build
COPY . .
RUN pnpm prisma generate --schema=./prisma/schema.prisma
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install pnpm and sqlite
RUN npm install -g pnpm
RUN apk add --no-cache sqlite

# Copy build artifacts and dependencies from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Explicitly copy the prisma directory
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /usr/src/app/prisma/migrations ./prisma/migrations

# Copy the .env file
COPY .env .env

# Log the current directory
RUN ls -la ./prisma

# Add step to run Prisma migrations
RUN pnpm prisma:migrate:deploy

# Expose application port
EXPOSE 3001

# Start the application with environment variables
CMD ["sh", "-c", "node -r dotenv/config dist/main.js"]
