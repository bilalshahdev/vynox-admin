# ==========================
# 1️⃣ Base image for build
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================
# 2️⃣ Final runtime image
# ==========================
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 2026

ENV NODE_ENV=production
ENV PORT=2026

CMD ["npm", "start"]
