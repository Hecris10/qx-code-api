# Base image with Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# === Install dependencies ===
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Production-only deps
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# === Build app and generate Prisma client ===
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Generate Prisma Client
RUN bun prisma generate --schema=./prisma/schema.prisma

# Optional test step
# RUN bun test

# Build NestJS app
RUN bun run build

# === Final image ===
FROM base AS release
WORKDIR /usr/src/app

# Copy only what's needed for production
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/prisma ./prisma
COPY --from=prerelease /usr/src/app/.env .env

# Run migrations on startup
RUN bun prisma migrate deploy

# Expose port (same as PORT in .env)
EXPOSE 3001

USER bun
CMD ["bun", "dist/main.js"]
