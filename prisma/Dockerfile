FROM node:24-alpine

WORKDIR /migration

# Install pnpm
RUN npm install -g pnpm

# Copy package files and Prisma schema only
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install only what's needed
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Run migrations when container starts
CMD ["npx", "prisma", "migrate", "deploy"]