# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN apk update && apk upgrade --no-cache \
    && corepack enable && corepack prepare pnpm@9.12.0 --activate

# ─── deps stage ───────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy lockfile + workspace manifests so pnpm can resolve from the cache layer
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json
# Stub api manifest so pnpm treats the workspace as complete
COPY apps/api/package.json ./apps/api/package.json

# Only install web + its workspace deps (skips api's heavy deps like prisma, aws-sdk, etc.)
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter @tipper/web...

# ─── build stage ──────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# NEXT_PUBLIC_* must be present at build time — Next inlines them into the bundle.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_FRONTEND_ORIGIN
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_FRONTEND_ORIGIN=$NEXT_PUBLIC_FRONTEND_ORIGIN \
    NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV \
    NEXT_TELEMETRY_DISABLED=1

# Topo-build: @tipper/shared compiles first, then @tipper/web (next build).
RUN pnpm --filter @tipper/web... run build

# ─── production stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3030

# Run as non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# next build --output standalone produces a self-contained server.
# outputFileTracingRoot in next.config.ts ensures workspace deps are bundled.
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3030

CMD ["node", "apps/web/server.js"]
