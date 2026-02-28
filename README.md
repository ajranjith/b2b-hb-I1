# Hotbray Admin Frontend

Next.js admin portal for the Hotbray B2B platform.

## Structure

- `apps/admin` - Admin app (Next.js)
- `packages/shared` - Shared library used by admin

## Prerequisites

- Bun installed

## Setup

```bash
bun install
```

Copy env file and set variables:

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

## Scripts

| Command | Description |
|--------|-------------|
| `bun run dev` | Run admin app (http://localhost:5173) |
| `bun run build` | Build admin app |
| `bun run start` | Start admin app (production) |
| `bun run lint` | Lint admin app |
