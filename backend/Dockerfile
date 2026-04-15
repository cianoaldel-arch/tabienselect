# syntax=docker/dockerfile:1.6

# ---------- Stage 1: dependencies + prisma client ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Prisma on Alpine needs openssl + libc compatibility
RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci \
 && npx prisma generate

# ---------- Stage 2: production runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000

RUN apk add --no-cache openssl libc6-compat wget \
 && addgroup -g 1001 -S nodejs \
 && adduser  -u 1001 -S nodejs -G nodejs

# App deps + generated prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY package.json package-lock.json ./
COPY src ./src

# Drop dev dependencies for a smaller final image
RUN npm prune --omit=dev \
 && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/api/health || exit 1

CMD ["node", "src/server.js"]
