# syntax=docker/dockerfile:1
# Railway erkennt dieses Dockerfile automatisch (siehe railway.json).

FROM node:22-alpine AS base
RUN corepack enable && apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---- Abhängigkeiten (inkl. prisma generate via postinstall) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm prisma generate && pnpm build

# ---- Laufzeit ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone-Server + statische Assets
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Vollständige node_modules (hoisted, ohne Symlinks), damit Prisma CLI und Client
# beim Start "migrate deploy" ausführen können
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --chown=nextjs:nodejs scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

USER nextjs
EXPOSE 3000
CMD ["./scripts/start.sh"]
