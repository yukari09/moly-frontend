# ========================================
# 1️⃣ Prune 阶段：裁剪依赖
# ========================================
FROM oven/bun:canary-alpine AS prune
WORKDIR /app

# 复制根目录的配置文件
COPY turbo.json package.json bun.lock .npmrc ./

# 复制所有工作区的 package.json
COPY apps/*/package.json ./apps/*/
COPY packages/*/package.json ./packages/*/

# 全局安装 turbo 并裁剪依赖
# 这会生成一个 'out' 目录，包含构建所需的最小文件集
RUN bun add turbo -g && \
    turbo prune --scope=dattk --docker

# ======================================== 
# 2️⃣ Builder 阶段：安装依赖并构建
# ========================================
FROM oven/bun:canary-alpine AS builder
WORKDIR /app

# 复制裁剪后的项目文件和 lockfile
COPY --from=prune /app/out/full/ .
COPY --from=prune /app/out/bun.lock ./

# 安装所有依赖（包括 devDependencies，因为构建需要它们）
RUN bun install

# 构建应用
# --filter 是多余的，因为 prune 已经裁剪了范围，但保留也无害
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
COPY --from=prune /app/out/bun.lock ./

# 只安装生产环境所需的依赖，以减小镜像体积
# 通过删除 lockfile 解决 turbo prune 和 bun 的兼容性问题
RUN rm bun.lock && bun install --production

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