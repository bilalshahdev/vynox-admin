# ==========================
# 1️⃣ Builder stage
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
RUN npm run build

# ==========================
# 2️⃣ Production runtime stage
# ==========================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy build artifacts from builder
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public

EXPOSE 1112

CMD ["npm", "start"]
