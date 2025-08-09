import { Redis } from "ioredis";
import logger from "./logger";

const WINDOW_SIZE_IN_SECONDS = 5 * 60; // 5 minutes
const MAX_REQUESTS = 3;
const globalPrefix = process.env.REDIS_KEY_PREFIX || "moly:";

let redis;
let redisConnectionPromise;

function initializeRedis() {
  if (redisConnectionPromise) {
    return redisConnectionPromise;
  }

  try {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL environment variable is not set.");
    }

    const client = new Redis(process.env.REDIS_URL, {
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: false, // Connect immediately
    });

    redisConnectionPromise = new Promise((resolve, reject) => {
      let resolved = false;

      const onReady = () => {
        if (!resolved) {
          resolved = true;
          logger.info("Successfully connected to Redis for custom rate limiting.");
          redis = client;
          resolve(redis);
        }
      };

      const onError = (error) => {
        logger.error("Redis client connection error:", error);
        if (!resolved) {
          resolved = true;
          reject(error);
        }
      };

      // ioredis uses 'ready' event instead of 'connect'
      client.on('ready', onReady);
      client.on('error', onError);

      // Fallback: if already connected when we set up listeners
      if (client.status === 'ready') {
        onReady();
      }

      // Timeout protection
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Redis connection timeout'));
        }
      }, 10000); // 10 second timeout
    });

    return redisConnectionPromise;

  } catch (error) {
    logger.error("Failed to initialize Redis client:", error);
    redisConnectionPromise = Promise.reject(error);
    return redisConnectionPromise;
  }
}

// Wait for Redis to be ready before allowing operations
async function ensureRedisReady() {
  try {
    const redisClient = await redisConnectionPromise;
    
    // Double-check the connection status
    if (!redisClient || redisClient.status !== 'ready') {
      throw new Error("Redis client is not ready after connection promise resolved.");
    }
    
    return redisClient;
  } catch (error) {
    logger.error("Redis readiness check failed:", error);
    throw error;
  }
}

// Initialize on module load
initializeRedis().catch(error => {
  logger.error("Failed to initialize Redis on module load:", error);
});

async function limit(identifier) {
  try {
    const redisClient = await ensureRedisReady();
    
    const key = `${globalPrefix}ratelimit:email:${identifier}`;
    
    const current = await redisClient.get(key);
    
    if (current && Number(current) >= MAX_REQUESTS) {
      return { success: false };
    }

    // Use a pipeline for atomic execution
    const multi = redisClient.multi();
    multi.incr(key);
    multi.expire(key, WINDOW_SIZE_IN_SECONDS, "NX");
    const results = await multi.exec();
    
    // Check if pipeline execution was successful
    if (!results || results.some(([err]) => err)) {
      throw new Error("Redis pipeline execution failed");
    }

    return { success: true };

  } catch (error) {
    logger.error("Rate limiting check failed:", error);
    // Fallback to allow the request if the rate limiter itself fails
    logger.warn(`Rate limiting is disabled due to an error for identifier: ${identifier}`);
    return { success: true };
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed gracefully');
  }
});

export const emailRateLimiter = {
  limit,
};