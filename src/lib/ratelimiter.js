import { Redis } from "ioredis";
import logger from "./logger";

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

/**
 * Creates a new rate limiter with a specific configuration.
 * @param {object} config - The configuration for the rate limiter.
 * @param {string} config.namespace - A unique namespace for this rate limiter (e.g., 'email', 'api').
 * @param {number} config.windowSizeInSeconds - The duration of the rate-limiting window in seconds.
 * @param {number} config.maxRequests - The maximum number of requests allowed within the window.
 * @returns {{limit: function(identifier: string): Promise<{success: boolean, limit: number, remaining: number}>}}
 */
export function createRateLimiter({ namespace, windowSizeInSeconds, maxRequests }) {
  if (!namespace || !windowSizeInSeconds || !maxRequests) {
    // This is a developer error, so we throw.
    throw new Error(`Rate limiter configuration is incomplete for namespace: ${namespace}`);
  }

  async function limit(identifier) {
    try {
      const redisClient = await ensureRedisReady();
      const key = `${globalPrefix}ratelimit:${namespace}:${identifier}`;

      const current = await redisClient.incr(key);

      // When the key is new, INCR returns 1. We then set the expiry.
      if (current === 1) {
        await redisClient.expire(key, windowSizeInSeconds);
      }

      if (current > maxRequests) {
        return { success: false, limit: maxRequests, remaining: 0 };
      }

      return { success: true, limit: maxRequests, remaining: maxRequests - current };
    } catch (error) {
      logger.error(`Rate limiting check failed for namespace ${namespace}:`, error);
      // Fallback to allow the request if the rate limiter itself fails
      logger.warn(
        `Rate limiting is disabled due to an error for identifier: ${identifier} in namespace: ${namespace}`
      );
      return { success: true, limit: maxRequests, remaining: maxRequests };
    }
  }

  return { limit };
}

// Configuration for the existing email rate limiter
const EMAIL_WINDOW_SIZE_IN_SECONDS = 5 * 60; // 5 minutes
const EMAIL_MAX_REQUESTS = 3;

// Export the email rate limiter to maintain backward compatibility.
export const emailRateLimiter = createRateLimiter({
  namespace: 'email',
  windowSizeInSeconds: EMAIL_WINDOW_SIZE_IN_SECONDS,
  maxRequests: EMAIL_MAX_REQUESTS,
});

// Temporary limiter
export const optimizerRateLimiter = createRateLimiter({
  namespace: 'optimizer',
  windowSizeInSeconds: 24 * 50 * 60,
  maxRequests: 3,
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed gracefully');
  }
});
