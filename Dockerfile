# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

# Copy source
COPY . .

# Build args for Next.js public envs
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_WEB_DOMAIN
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2

# Bake into bundle at build time
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_WEB_DOMAIN=$NEXT_PUBLIC_WEB_DOMAIN
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2

# Build admin app
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173
ENV HOSTNAME=0.0.0.0

# Standalone output
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

EXPOSE 5173

CMD ["node", "server.js"]
