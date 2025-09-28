# ========================================
# 1️⃣ Prune 阶段：裁剪依赖
# ========================================
FROM oven/bun:latest AS prune
WORKDIR /app

# 复制 Turbo、Bun 配置和 lockfile
COPY turbo.json package.json bun.lock ./
COPY apps/dattk/package.json apps/dattk/package.json
COPY apps/dattk/.env.build apps/dattk/.env.build
# COPY apps/impressifyai/package.json apps/impressifyai/package.json
COPY packages/*/package.json packages/*/package.json

# 全局安装 turbo 并裁剪依赖
RUN bun add turbo -g && \
    turbo prune --scope=dattk --docker

# ========================================
# 2️⃣ Builder 阶段：安装依赖并构建
# ========================================
FROM oven/bun:latest AS builder
WORKDIR /app

# 复制裁剪后的依赖配置
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock ./bun.lock

# 复制完整源码，确保 Next.js pages/app 存在
COPY apps/dattk ./apps/dattk
# COPY apps/impressifyai ./apps/impressifyai
COPY packages ./packages
COPY turbo.json .

# 安装依赖
RUN bun install

# 构建应用
RUN bun run turbo run build --filter=dattk  --verbose
# RUN bun run turbo run build --filter=impressifyai

# ========================================
# 3️⃣ Runner 阶段：生产环境运行
# ========================================
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000 3001

# 安装 pm2 管理多进程
RUN bun add -g pm2

# 复制构建产物
COPY --from=builder /app/apps/dattk/.next ./apps/dattk/.next
COPY --from=builder /app/apps/dattk/next.config.js ./apps/dattk/next.config.js
COPY --from=builder /app/apps/dattk/package.json ./apps/dattk/package.json

# COPY --from=builder /app/apps/impressifyai/.next ./apps/impressifyai/.next
# COPY --from=builder /app/apps/impressifyai/next.config.js ./apps/impressifyai/next.config.js
# COPY --from=builder /app/apps/impressifyai/package.json ./apps/impressifyai/package.json

# 复制 node_modules
COPY --from=builder /app/node_modules ./node_modules

# pm2 配置文件
COPY ecosystem.config.js .

# 用 pm2 启动多个 Next.js 应用
CMD ["pm2-runtime", "ecosystem.config.js"]
