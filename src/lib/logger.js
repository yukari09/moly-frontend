/**
 * A logger for consistent, environment-aware logging.
 */
const logger = {
  /**
   * Logs an informational message.
   * This is ONLY active in the 'development' environment.
   * @param {...any} args The message and any additional data to log.
   */
  info: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[MOLY_DEBUG]', ...args);
    }
  },

  /**
   * Logs a warning message.
   * This is ONLY active in the 'development' environment.
   * @param {...any} args The warning message and any additional data.
   */
  warn: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MOLY_WARN]', ...args);
    }
  },

  /**
   * Logs an error message.
   * This is active in ALL environments to ensure errors are never missed.
   * @param {...any} args The error message and any additional data.
   */
  error: (...args) => {
    // Errors are critical and should be logged regardless of the environment.
    console.error('[MOLY_ERROR]', ...args);
  },
};

export default logger;