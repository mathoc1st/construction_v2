# 1. Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Install deps (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy everything
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client
RUN pnpm prisma generate

# Build SvelteKit
RUN pnpm build

# 2. Production stage
FROM node:24-alpine AS runner

WORKDIR /app

RUN corepack enable

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY package.json seed.ts prisma.config.ts ./

EXPOSE 3000

# Run migrations at startup, then app
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma db seed && node build"]