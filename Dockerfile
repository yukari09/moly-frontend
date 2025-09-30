# syntax=docker/dockerfile:1.4

# ======================================== 
# Builder 阶段：使用 BuildKit 缓存
# ======================================== 
FROM oven/bun:canary-alpine AS builder
WORKDIR /app

# 复制依赖配置
COPY package.json bun.lock turbo.json ./
COPY apps/dattk/package.json ./apps/dattk/
COPY apps/impressifyai/package.json ./apps/impressifyai/
COPY packages/*/package.json ./packages/

# 使用缓存挂载加速依赖安装（Bun 缓存目录）
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# 复制源码
COPY . .

# 使用缓存挂载加速 Turbo 构建
RUN --mount=type=cache,target=.turbo \
    bun run turbo run build --filter=dattk --filter=impressifyai

# ======================================== 
# Runner 阶段：生产环境
# ======================================== 
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000 3001

RUN bun add -g pm2

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Dattk
COPY --from=builder /app/apps/dattk/public ./apps/dattk/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/.next/static ./apps/dattk/.next/static

# ImpressifyAi
COPY --from=builder /app/apps/impressifyai/public ./apps/impressifyai/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/impressifyai/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/impressifyai/.next/static ./apps/impressifyai/.next/static

COPY ecosystem.config.js .

USER nextjs

CMD ["pm2-runtime", "ecosystem.config.js"]