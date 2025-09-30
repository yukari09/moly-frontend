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
    turbo prune --scope=dattk --scope=impressifyai --docker

# ======================================== 
# 2️⃣ Builder 阶段：安装依赖并构建
# ======================================== 
FROM oven/bun:canary-alpine AS builder
WORKDIR /app

# 复制裁剪后的项目文件和 lockfile
COPY --from=prune /app/out/full/ .
COPY --from=prune /app/out/bun.lock .

# 安装所有依赖（包括 devDependencies，因为构建需要它们）
# 通过删除 lockfile 解决 turbo prune 和 bun 的兼容性问题
RUN rm bun.lock && bun install

# 构建应用
RUN bun run turbo run build --filter=dattk --filter=impressifyai

# ======================================== 
# 3️⃣ Runner 阶段：生产环境运行
# ======================================== 
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000 3001

# 安装 pm2 用于进程管理
RUN bun add -g pm2

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

#Dattk
COPY --from=builder /app/apps/dattk/public ./apps/dattk/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dattk/.next/static ./apps/dattk/.next/static

#ImpressifyAi
COPY --from=builder /app/apps/impressifyai/public ./apps/impressifyai/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/impressifyai/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/impressifyai/.next/static ./apps/impressifyai/.next/static

# 复制 pm2 配置文件
COPY ecosystem.config.js .

# 使用 pm2 启动应用
CMD ["pm2-runtime", "ecosystem.config.js"]
