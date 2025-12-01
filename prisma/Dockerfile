FROM node:24-alpine

WORKDIR /migration

COPY . ./prisma

# Install pnpm
RUN npm install -g pnpm

RUN pnpm init
RUN pnpm add -D typescript tsx
RUN npx tsc --init

RUN pnpm add -D prisma
RUN pnpm add @prisma/client @prisma/adapter-pg pg dotenv

# Generate Prisma client
RUN npx prisma generate

# Run migrations when container starts
CMD ["npx", "prisma", "migrate", "deploy"]