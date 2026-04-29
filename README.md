# Tipper — Interaction First

## Stack
- **web** — Next.js 15 (App Router, TypeScript, Tailwind)
- **api** — NestJS 11 (TypeScript)
- **shared** — `@tipper/shared` — common types / DTOs used by both apps
- **db** — PostgreSQL 16

## Monorepo

```
apps/
  web/      → Next.js frontend
  api/      → NestJS backend
packages/
  shared/   → @tipper/shared — workspace types
```

## Local dev

```bash
# Install everything from root
pnpm install

# Run both apps in watch mode
pnpm dev

# Or individually
pnpm dev:api
pnpm dev:web
```

Copy `.env.example` → `.env` in each app before starting:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Deploy (Dokploy)

The root `docker-compose.yml` defines `web`, `api`, and `db` services.  
Build context is the repo root so `@tipper/shared` resolves inside both Dockerfiles.

```bash
docker compose up --build
```

Dokploy: create a **Docker Compose** application pointing to this repo.
