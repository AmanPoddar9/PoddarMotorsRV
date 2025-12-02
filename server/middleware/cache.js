/**
 * Simple in-memory cache middleware for read-heavy endpoints
 * For production, consider Redis or similar for distributed caching
 */

const cache = new Map();

// Cache TTL (Time To Live) in seconds
const DEFAULT_TTL = 5 * 60; // 5 minutes

/**
 * Create cache middleware with custom TTL
 * @param {number} ttlSeconds - Time to live in seconds
 */
const cacheMiddleware = (ttlSeconds = DEFAULT_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const now = Date.now();
      if (now < cachedResponse.expiresAt) {
        // Cache hit - return cached response
        res.set('X-Cache', 'HIT');
        return res.status(cachedResponse.status).json(cachedResponse.data);
      } else {
        // Cache expired - remove it
        cache.delete(key);
      }
    }

    // Cache miss - continue to route handler
    res.set('X-Cache', 'MISS');

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Only cache successful responses
      if (res.statusCode === 200) {
        cache.set(key, {
          status: res.statusCode,
          data,
          expiresAt: Date.now() + (ttlSeconds * 1000)
        });
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear all cache
 */
const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

/**
 * Clear cache for specific pattern
 */
const clearCachePattern = (pattern) => {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
  console.log(`Cache cleared for pattern: ${pattern}`);
};

/**
 * Get cache stats
 */
const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearCachePattern,
  getCacheStats
};
