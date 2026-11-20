# Multi-stage Dockerfile for BuildX Node.js & Express Production Server
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Runner stage for optimized container size & security
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=5000

# Non-root user for security best practices
USER node

COPY --chown=node:node --from=builder /usr/src/app ./

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health/check || exit 1

CMD ["node", "server.js"]
