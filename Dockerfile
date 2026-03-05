# ---- Build Stage ----
FROM node:24-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEB_DOMAIN
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEB_DOMAIN=$NEXT_PUBLIC_WEB_DOMAIN
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

COPY package*.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

COPY . .

RUN npm run build

# ---- Runtime Stage ----
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output (includes server.js and minimal node_modules)
COPY --from=builder /app/apps/admin/.next/standalone/ ./

# Ensure server.js is at /app root for the runner
COPY --from=builder /app/apps/admin/.next/standalone/apps/admin/server.js ./server.js

# Copy .next metadata
COPY --from=builder /app/apps/admin/.next/standalone/apps/admin/.next ./.next

# Static assets
COPY --from=builder /app/apps/admin/.next/static/ ./.next/static/
COPY --from=builder /app/apps/admin/.next/static/ ./apps/admin/.next/static/

# Public assets
COPY --from=builder /app/apps/admin/public/ ./public/
COPY --from=builder /app/apps/admin/public/ ./apps/admin/public/

EXPOSE 3000

CMD ["node", "server.js"]
