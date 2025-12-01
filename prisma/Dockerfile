FROM node:24-alpine

WORKDIR /migration

# Install pnpm
RUN npm install -g pnpm

RUN pnpm init -y
RUN pnpm add -D typescript tsx @types/node
RUN pnpx tsc --init

RUN pnpm add -D prisma @types/node @types/pg
RUN pnpm add @prisma/client @prisma/adapter-pg pg dotenv

# Generate Prisma client
RUN npx prisma generate

# Run migrations when container starts
CMD ["npx", "prisma", "migrate", "deploy"]