# ========== 1. Prune 阶段 ==========
FROM oven/bun:latest AS prune
WORKDIR /app

# 复制配置和 lockfile
COPY turbo.json package.json bun.lock ./
COPY apps/dattk/package.json apps/dattk/package.json
COPY apps/impressifyai/package.json apps/impressifyai/package.json
COPY packages/*/package.json packages/*/package.json

# 剪枝 web 和 admin
RUN bun add turbo -g && turbo prune --scope=dattk --scope=impressifyai --docker

# ========== 2. Builder 阶段 ==========
FROM oven/bun:latest AS builder
WORKDIR /app

# 复制裁剪后的依赖配置
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock ./bun.lock

# 安装依赖
RUN bun install

# 复制完整源码
COPY --from=prune /app/out/full/ .
COPY turbo.json .

# 构建 web 和 admin
RUN bun run turbo run build --filter=dattk
RUN bun run turbo run build --filter=impressifyai

# ========== 3. Runner 阶段 ==========
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000 3001

# 安装 pm2 来管理多进程
RUN bun add -g pm2

# 复制构建产物
COPY --from=builder /app/apps/dattk/.next ./apps/dattk/.next
COPY --from=builder /app/apps/dattk/next.config.js ./apps/dattk/next.config.js
COPY --from=builder /app/apps/dattk/package.json ./apps/dattk/package.json

COPY --from=builder /app/apps/impressifyai/.next ./apps/impressifyai/.next
COPY --from=builder /app/apps/impressifyai/next.config.js ./apps/impressifyai/next.config.js
COPY --from=builder /app/apps/impressifyai/package.json ./apps/impressifyai/package.json

COPY --from=builder /app/node_modules ./node_modules

# pm2 配置文件
COPY ecosystem.config.js .

# 用 pm2 启动多个 Next.js 应用
CMD ["pm2-runtime", "ecosystem.config.js"]
