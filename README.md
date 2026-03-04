# Hotbray Admin Frontend

Next.js admin portal for the Hotbray B2B platform.

## Structure

- `apps/admin` - Admin app (Next.js)
- `packages/shared` - Shared library used by admin

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
npm ci
```

Copy env file and set variables:

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Run admin app (dev) |
| `npm run build` | Build admin app |
| `npm run start` | Start admin app (production) |
| `npm run lint` | Lint admin app |
