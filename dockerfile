# ---------- Base Image ----------
FROM oven/bun AS base
WORKDIR /app

# ---------- Dependencies Stage ----------
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --force --frozen-lockfile

# ---------- Build Stage ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---------- Production Stage ----------
FROM base AS runner
WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# 创建非 root 用户
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bun /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/.next/static ./.next/static

# 确保 .next 缓存权限正确
RUN mkdir -p .next/cache
RUN chown -R nextjs:bun .next

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 入口命令
CMD ["bun", "server.js", "--turbopack"]
