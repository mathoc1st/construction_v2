# 1. Build stage
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
RUN npx prisma migrate deploy
RUN npx prisma generate

# Copy source code
COPY . .

# Build SvelteKit for Node adapter
RUN pnpm build

# 2. Production stage
FROM node:24-alpine AS runner

WORKDIR /app

# Only copy production dependencies and build output
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=builder /app/build .

# Expose port (SvelteKit default: 5173 for dev, your adapter may change)
EXPOSE 3000

# Run the app
CMD ["node", "build"]
