# ----------------------------------------------------------------------------- 
# This Dockerfile.bun is specifically configured for projects using Bun 
# For npm/pnpm or yarn, refer to the Dockerfile instead 
# ----------------------------------------------------------------------------- 

# Use Bun's official image 
FROM oven/bun AS base 

WORKDIR /app 

# Install dependencies with bun 
FROM base AS deps 
COPY package.json ./ 
RUN bun install

# Rebuild the source code only when needed 
FROM base AS builder 
WORKDIR /app 
COPY --from=deps /app/node_modules ./node_modules 
COPY . . 

# Next.js collects completely anonymous telemetry data about general usage. 
# Learn more here: https://nextjs.org/telemetry 
# Uncomment the following line in case you want to disable telemetry during the build. 
ENV NEXT_TELEMETRY_DISABLED=1 

RUN bun run build 

# Production image, copy all the files and run next 
FROM base AS runner 
WORKDIR /app 

# Set environment variables for production 
ENV NODE_ENV=production 
    PORT=3000 
    HOSTNAME="0.0.0.0" 
    # Set timezone and locale to ensure consistency 
    TZ="Asia/Shanghai" 
    LANG="en_US.UTF-8" 

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs 

COPY --from=builder /app/public ./public 

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static 

USER nextjs 

EXPOSE 3000 

# Run the production server 
CMD ["bun", "server.js"] 
