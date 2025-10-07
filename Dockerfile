# ==========================
# 1️⃣ Builder stage
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time arg for public environment variables
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js app
RUN npm run build

# ==========================
# 2️⃣ Production runtime stage
# ==========================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy build artifacts from builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Set environment variables for runtime
ENV NODE_ENV=production
ENV PORT=2026

EXPOSE 2026

CMD ["npm", "start"]
