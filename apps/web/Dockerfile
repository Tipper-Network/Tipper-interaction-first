# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN apk update && apk upgrade --no-cache \
    && corepack enable && corepack prepare pnpm@9.12.0 --activate

# ─── deps stage ───────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY pnpm-workspace.yaml package.json .npmrc ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json
# Stub api so pnpm doesn't complain about missing workspace member
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile

# ─── build stage ──────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

COPY pnpm-workspace.yaml package.json .npmrc ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

# Topo-builds @tipper/shared first, then @tipper/web
RUN pnpm --filter @tipper/web... run build

# ─── production stage ─────────────────────────────────────────────────────────
# Chainguard node: zero-CVE guarantee, updated daily, non-root by default
FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# next build --output standalone produces a self-contained server
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["apps/web/server.js"]
