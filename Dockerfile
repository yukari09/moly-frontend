# ========================================
# 1️⃣ Prune 阶段：裁剪依赖 (简化版)
# ======================================== 
FROM oven/bun:canary-alpine AS prune
WORKDIR /app

# 复制整个项目以确保 turbo prune 上下文正确
# 注意：这会降低缓存效率，但能保证正确性
COPY . .

# 全局安装 turbo 并裁剪依赖
RUN bun add turbo -g && \
    turbo prune --scope=dattk --docker

# ======================================== 
# 2️⃣ Builder 阶段：安装依赖并构建
# ======================================== 
FROM oven/bun:canary-alpine AS builder
WORKDIR /app

# 复制裁剪后的项目文件和 lockfile
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock* ./
RUN bun install --frozen-lockfile
COPY --from=prune /app/out/full/ .

# 安装所有依赖（包括 devDependencies，因为构建需要它们）
# 通过删除 lockfile 解决 turbo prune 和 bun 的兼容性问题
RUN rm bun.lock && bun install

# 构建应用
RUN bun run turbo run build --filter=dattk...

# ======================================== 
# 3️⃣ Runner 阶段：生产环境运行
# ======================================== 
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000 3001

# 安装 pm2 用于进程管理
RUN bun add -g pm2

# 复制裁剪后的 package.json 文件和 lockfile
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock .

# 从 builder 阶段复制构建产物和必要文件
# Next.js 运行时需要 .next, public, next.config.mjs, 和 package.json
COPY --from=builder /app/apps/dattk/.next ./apps/dattk/.next
COPY --from=builder /app/apps/dattk/public ./apps/dattk/public
COPY --from=builder /app/apps/dattk/next.config.mjs ./apps/dattk/next.config.mjs
COPY --from=builder /app/apps/dattk/package.json ./apps/dattk/package.json

# 复制 pm2 配置文件
COPY ecosystem.config.js .

# 使用 pm2 启动应用
CMD ["pm2-runtime", "ecosystem.config.js"]
