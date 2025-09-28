# ========================================
# 1️⃣ Prune 阶段：裁剪依赖
# ========================================
FROM oven/bun:canary-alpine AS prune
WORKDIR /app

# 只复制必要的配置文件，提高缓存效率
COPY package.json bun.lock turbo.json ./
COPY apps/dattk/package.json ./apps/dattk/
COPY packages/*/package.json ./packages/*/

# 全局安装 turbo 并裁剪依赖
RUN bun add turbo -g && \
    turbo prune --scope=dattk --docker

# ========================================
# 2️⃣ Builder 阶段：安装依赖并构建
# ========================================
FROM oven/bun:canary-alpine AS builder
WORKDIR /app

# 复制裁剪后的项目文件
COPY --from=prune /app/out/full/ .
COPY --from=prune /app/out/bun.lock ./bun.lock

# 安装依赖 - 保留 lockfile 以确保版本一致性
RUN bun install --frozen-lockfile

# 复制源代码
COPY --from=prune /app/out/full/ .

# 构建应用
RUN bun run turbo run build --filter=dattk...

# ========================================
# 3️⃣ Runner 阶段：生产环境运行
# ========================================
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

# 创建非 root 用户提高安全性
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

ENV NODE_ENV=production
EXPOSE 3000

# 复制 package.json 和安装生产依赖
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock ./bun.lock

# 只安装生产依赖
RUN bun install --production --frozen-lockfile

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/.next ./apps/dattk/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/public ./apps/dattk/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/next.config.mjs ./apps/dattk/next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/package.json ./apps/dattk/package.json

# 如果使用 pm2，复制配置文件
COPY --chown=nextjs:nodejs ecosystem.config.js .

# 切换到非 root 用户
USER nextjs

# 使用 Next.js 内置服务器（推荐）或 pm2
# CMD ["bun", "run", "--cwd", "apps/dattk", "start"]
CMD ["pm2-runtime", "ecosystem.config.js"]