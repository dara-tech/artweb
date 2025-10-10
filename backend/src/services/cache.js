const NodeCache = require('node-cache');

// Cache configuration
const cacheConfig = {
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Don't clone objects for better performance
  maxKeys: 1000 // Maximum number of keys in cache
};

// Create cache instances for different data types
const caches = {
  // Short-term cache for frequently accessed data (1 minute)
  short: new NodeCache({ ...cacheConfig, stdTTL: 60 }),
  
  // Medium-term cache for lookup data (30 minutes)
  medium: new NodeCache({ ...cacheConfig, stdTTL: 1800 }),
  
  // Long-term cache for static data (30 minutes)
  long: new NodeCache({ ...cacheConfig, stdTTL: 1800 }),
  
  // Very long-term cache for configuration data (2 hours)
  config: new NodeCache({ ...cacheConfig, stdTTL: 7200 })
};

// Cache key generators
const cacheKeys = {
  // Visit data cache keys
  visits: (type, siteCode, page, limit, filters) => 
    `visits:${type}:${siteCode}:${page}:${limit}:${JSON.stringify(filters)}`,
  
  // Patient data cache keys
  patients: (type, siteCode, page, limit, filters) => 
    `patients:${type}:${siteCode}:${page}:${limit}:${JSON.stringify(filters)}`,
  
  // Lookup data cache keys
  lookups: (type) => `lookups:${type}`,
  
  // Database statistics cache keys
  dbStats: (databaseName) => `dbstats:${databaseName}`,
  
  // Indicator data cache keys
  indicators: (indicatorId, startDate, endDate, previousEndDate, siteCode = null) => 
    `indicators:${indicatorId}:${startDate}:${endDate}:${previousEndDate}:${siteCode || 'all'}`,
  
  // Site data cache keys
  sites: () => 'sites:all'
};

// Cache helper functions
const cache = {
  // Get data from cache
  get: (cacheTypeOrKey, key) => {
    try {
      console.log('[Cache] get called with:', cacheTypeOrKey, key);
      console.log('[Cache] caches object:', typeof caches, caches ? Object.keys(caches) : 'undefined');
      
      // Handle both calling patterns: cache.get(cacheType, key) and cache.get(key)
      if (key !== undefined) {
        // Called with cacheType and key
        if (!caches || !caches[cacheTypeOrKey]) {
          console.error('[Cache] caches object or cache type not found:', cacheTypeOrKey);
          return null;
        }
        return caches[cacheTypeOrKey].get(key);
      } else {
        // Called with just key - use default cache (short)
        if (!caches || !caches.short) {
          console.error('[Cache] caches object or short cache not found');
          return null;
        }
        return caches.short.get(cacheTypeOrKey);
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // Set data in cache
  set: (cacheType, key, data, ttl = null) => {
    try {
      if (ttl) {
        caches[cacheType].set(key, data, ttl);
      } else {
        caches[cacheType].set(key, data);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // Delete data from cache
  del: (cacheType, key) => {
    try {
      return caches[cacheType].del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  // Clear all data from cache
  clear: (cacheType) => {
    try {
      caches[cacheType].flushAll();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  },

  // Get cache statistics
  getStats: (cacheType) => {
    try {
      return caches[cacheType].getStats();
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  },

  // Check if key exists
  has: (cacheType, key) => {
    try {
      return caches[cacheType].has(key);
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }
};

// Cache invalidation patterns
const invalidatePattern = (cacheType, pattern) => {
  try {
    const keys = caches[cacheType].keys();
    const regex = new RegExp(pattern);
    const matchingKeys = keys.filter(key => regex.test(key));
    
    matchingKeys.forEach(key => {
      caches[cacheType].del(key);
    });
    
    return matchingKeys.length;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return 0;
  }
};

// Cache warming functions
const warmCache = {
  // Warm up lookup data
  warmLookups: async (lookupService) => {
    try {
      const lookupTypes = ['sites', 'drugs', 'clinics', 'reasons', 'allergies', 'nationalities', 'target-groups', 'provinces', 'hospitals', 'drug-treatments'];
      
      for (const type of lookupTypes) {
        const key = cacheKeys.lookups(type);
        if (!cache.has('medium', key)) {
          const data = await lookupService.getLookupData(type);
          cache.set('medium', key, data);
        }
      }
      
      console.log('✅ Lookup cache warmed up');
    } catch (error) {
      console.error('❌ Error warming lookup cache:', error);
    }
  },

  // Warm up site data
  warmSites: async (siteService) => {
    try {
      const key = cacheKeys.sites();
      if (!cache.has('long', key)) {
        const data = await siteService.getAllSites();
        cache.set('long', key, data);
      }
      
      console.log('✅ Site cache warmed up');
    } catch (error) {
      console.error('❌ Error warming site cache:', error);
    }
  }
};

module.exports = {
  cache,
  cacheKeys,
  invalidatePattern,
  warmCache,
  caches
};
