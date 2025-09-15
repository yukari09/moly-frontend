# 使用 Node.js 镜像进行构建阶段
FROM node:24-alpine AS deps

WORKDIR /app

# 复制 package 文件并用 npm 安装依赖
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 构建阶段 - 使用 npm
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 禁用遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 用 npm 构建项目
RUN npm run build

# 生产运行阶段 - 使用 Bun
FROM oven/bun AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 用 bun 运行服务器
CMD ["bun", "server.js"]