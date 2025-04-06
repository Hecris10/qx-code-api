# Base image with Bun
FROM oven/bun:1
WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma Client
RUN bun prisma generate

# Build the application
RUN bun run build

# Run migrations and start the app
CMD bun prisma migrate deploy && bun dist/main.js
