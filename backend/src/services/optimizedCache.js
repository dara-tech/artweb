const NodeCache = require('node-cache');

/**
 * Optimized Cache Service with advanced features
 * Provides intelligent caching for site-specific data with performance monitoring
 */
class OptimizedCacheService {
  constructor() {
    // Create multiple cache instances for different data types
    this.indicatorCache = new NodeCache({
      stdTTL: 300,        // 5 minutes default TTL
      checkperiod: 60,    // Check for expired keys every 60 seconds
      useClones: false,   // Don't clone objects for better performance
      maxKeys: 10000,     // Maximum 10,000 keys
      deleteOnExpire: true,
      enableLegacyCallbacks: false
    });

    this.siteCache = new NodeCache({
      stdTTL: 1800,       // 30 minutes for site data
      checkperiod: 120,
      useClones: false,
      maxKeys: 1000,
      deleteOnExpire: true,
      enableLegacyCallbacks: false
    });

    this.queryCache = new NodeCache({
      stdTTL: 600,        // 10 minutes for query results
      checkperiod: 90,
      useClones: false,
      maxKeys: 5000,
      deleteOnExpire: true,
      enableLegacyCallbacks: false
    });

    // Performance monitoring
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      flushes: 0
    };

    // Set up event listeners for monitoring
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Monitor all caches
    [this.indicatorCache, this.siteCache, this.queryCache].forEach(cache => {
      cache.on('set', (key, value) => {
        this.stats.sets++;
      });

      cache.on('del', (key, value) => {
        this.stats.deletes++;
      });

      cache.on('flush', () => {
        this.stats.flushes++;
      });
    });
  }

  // Generate cache key with namespace
  generateKey(namespace, ...parts) {
    return `${namespace}:${parts.join(':')}`;
  }

  // Get from appropriate cache based on type
  get(type, key) {
    const cache = this.getCacheByType(type);
    const result = cache.get(key);
    
    if (result !== undefined) {
      this.stats.hits++;
      return result;
    } else {
      this.stats.misses++;
      return undefined;
    }
  }

  // Set in appropriate cache based on type
  set(type, key, value, ttl = null) {
    const cache = this.getCacheByType(type);
    
    if (ttl) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }
  }

  // Delete from appropriate cache
  del(type, key) {
    const cache = this.getCacheByType(type);
    return cache.del(key);
  }

  // Get cache by type
  getCacheByType(type) {
    switch (type) {
      case 'indicator':
        return this.indicatorCache;
      case 'site':
        return this.siteCache;
      case 'query':
        return this.queryCache;
      default:
        return this.indicatorCache;
    }
  }

  // Site-specific cache operations
  getSiteIndicator(siteCode, indicatorId, params) {
    const key = this.generateKey('site_indicator', siteCode, indicatorId, JSON.stringify(params));
    return this.get('indicator', key);
  }

  setSiteIndicator(siteCode, indicatorId, params, data, ttl = 300) {
    const key = this.generateKey('site_indicator', siteCode, indicatorId, JSON.stringify(params));
    this.set('indicator', key, data, ttl);
  }

  getSiteData(siteCode, dataType) {
    const key = this.generateKey('site_data', siteCode, dataType);
    return this.get('site', key);
  }

  setSiteData(siteCode, dataType, data, ttl = 1800) {
    const key = this.generateKey('site_data', siteCode, dataType);
    this.set('site', key, data, ttl);
  }

  getQueryResult(queryHash) {
    const key = this.generateKey('query', queryHash);
    return this.get('query', key);
  }

  setQueryResult(queryHash, result, ttl = 600) {
    const key = this.generateKey('query', queryHash);
    this.set('query', key, result, ttl);
  }

  // Clear site-specific cache
  clearSiteCache(siteCode) {
    const keysToDelete = [];
    
    // Get all keys from all caches
    const allCaches = [this.indicatorCache, this.siteCache, this.queryCache];
    
    allCaches.forEach(cache => {
      const keys = cache.keys();
      keys.forEach(key => {
        if (key.includes(`site_data:${siteCode}`) || key.includes(`site_indicator:${siteCode}`)) {
          keysToDelete.push(key);
        }
      });
    });

    // Delete keys
    keysToDelete.forEach(key => {
      // Determine which cache the key belongs to
      if (key.startsWith('site_indicator:')) {
        this.indicatorCache.del(key);
      } else if (key.startsWith('site_data:')) {
        this.siteCache.del(key);
      } else if (key.startsWith('query:')) {
        this.queryCache.del(key);
      }
    });

    console.log(`🗑️  Cleared ${keysToDelete.length} cache entries for site ${siteCode}`);
    return keysToDelete.length;
  }

  // Clear all cache
  flushAll() {
    this.indicatorCache.flushAll();
    this.siteCache.flushAll();
    this.queryCache.flushAll();
    console.log('🗑️  Cleared all cache');
  }

  // Get cache statistics
  getStats() {
    const indicatorStats = this.indicatorCache.getStats();
    const siteStats = this.siteCache.getStats();
    const queryStats = this.queryCache.getStats();

    const totalKeys = indicatorStats.keys + siteStats.keys + queryStats.keys;
    const totalHits = this.stats.hits;
    const totalMisses = this.stats.misses;
    const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses) * 100).toFixed(2) : 0;

    return {
      keys: totalKeys,
      hits: totalHits,
      misses: totalMisses,
      hitRate: `${hitRate}%`,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      flushes: this.stats.flushes,
      breakdown: {
        indicator: {
          keys: indicatorStats.keys,
          hits: indicatorStats.hits,
          misses: indicatorStats.misses
        },
        site: {
          keys: siteStats.keys,
          hits: siteStats.hits,
          misses: siteStats.misses
        },
        query: {
          keys: queryStats.keys,
          hits: queryStats.hits,
          misses: queryStats.misses
        }
      }
    };
  }

  // Warm up cache with frequently accessed data
  async warmupCache(sites) {
    console.log('🔥 Warming up cache...');
    
    try {
      // Pre-load site information
      for (const site of sites) {
        this.setSiteData(site.code, 'info', site, 3600); // 1 hour
      }
      
      console.log(`✅ Cache warmed up with ${sites.length} sites`);
    } catch (error) {
      console.error('❌ Cache warmup failed:', error);
    }
  }

  // Get memory usage
  getMemoryUsage() {
    const indicatorMem = process.memoryUsage();
    return {
      rss: Math.round(indicatorMem.rss / 1024 / 1024), // MB
      heapTotal: Math.round(indicatorMem.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(indicatorMem.heapUsed / 1024 / 1024), // MB
      external: Math.round(indicatorMem.external / 1024 / 1024) // MB
    };
  }

  // Health check
  healthCheck() {
    const stats = this.getStats();
    const memory = this.getMemoryUsage();
    
    return {
      status: 'healthy',
      cache: {
        totalKeys: stats.keys,
        hitRate: stats.hitRate,
        memoryUsage: memory
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const optimizedCache = new OptimizedCacheService();

// Export both the instance and the class
module.exports = {
  cache: optimizedCache,
  OptimizedCacheService
};
