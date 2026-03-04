# ---- Build Stage ----
FROM node:24-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_WEB_DOMAIN
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
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
ENV PORT=5173
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app ./

EXPOSE 5173

CMD ["npm", "run", "start"]
