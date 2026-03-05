# =========================
# 1) Dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

# =========================
# 2) Build
# =========================
FROM node:20-alpine AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEB_DOMAIN
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEB_DOMAIN=$NEXT_PUBLIC_WEB_DOMAIN
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NODE_ENV=production

WORKDIR /repo/apps/admin
RUN npm run build

# =========================
# 3) Run
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

# Copy standalone output to /app
COPY --from=builder /repo/apps/admin/.next/standalone ./
# Place server.js at /app/server.js for CMD
COPY --from=builder /repo/apps/admin/.next/standalone/apps/admin/server.js ./server.js
# Ensure build artifacts exist at /app/.next for server.js runtime lookup
COPY --from=builder /repo/apps/admin/.next/standalone/apps/admin/.next ./.next

COPY --from=builder /repo/apps/admin/.next/static ./.next/static
COPY --from=builder /repo/apps/admin/public ./public

CMD ["node", "server.js"]
