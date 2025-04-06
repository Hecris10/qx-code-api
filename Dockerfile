# Builder stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install Bun
RUN apk add --no-cache curl bash && \
    curl -fsSL https://bun.sh/install | bash && \
    export PATH="/root/.bun/bin:$PATH"

# Copy package.json and bun.lockb and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy application files and build
COPY . .
RUN bun prisma generate --schema=./prisma/schema.prisma
RUN bun build

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install Bun and sqlite
RUN apk add --no-cache curl bash sqlite && \
    curl -fsSL https://bun.sh/install | bash && \
    export PATH="/root/.bun/bin:$PATH"

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
RUN bun prisma migrate deploy

# Expose application port
ARG PORT=3001
ENV PORT=$PORT
EXPOSE $PORT

# Start the application with environment variables
CMD ["sh", "-c", "node -r dotenv/config dist/main.js"]
