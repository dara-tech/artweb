const { performance } = require('perf_hooks');

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    
    const responseTime = endTime - startTime;
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
    
    // Log performance metrics
    console.log(`📊 Performance Metrics:`);
    console.log(`   Route: ${req.method} ${req.originalUrl}`);
    console.log(`   Response Time: ${responseTime.toFixed(2)}ms`);
    console.log(`   Memory Delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Status Code: ${res.statusCode}`);
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);
    res.setHeader('X-Memory-Delta', `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Database query performance monitor
const dbPerformanceMonitor = (query, replacements, options) => {
  const startTime = performance.now();
  
  return {
    start: startTime,
    end: (error = null) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) { // Log slow queries (>1 second)
        console.warn(`🐌 Slow Query Detected:`);
        console.warn(`   Duration: ${duration.toFixed(2)}ms`);
        console.warn(`   Query: ${query.substring(0, 100)}...`);
        console.warn(`   Replacements: ${JSON.stringify(replacements)}`);
      }
      
      if (error) {
        console.error(`❌ Query Error (${duration.toFixed(2)}ms):`, error.message);
      }
      
      return duration;
    }
  };
};

// Memory usage monitor
const memoryMonitor = {
  getCurrentUsage: () => {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
      arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024) // MB
    };
  },

  logUsage: (label = 'Memory Usage') => {
    const usage = memoryMonitor.getCurrentUsage();
    console.log(`📊 ${label}:`, usage);
    return usage;
  },

  checkMemoryThreshold: (thresholdMB = 500) => {
    const usage = memoryMonitor.getCurrentUsage();
    if (usage.heapUsed > thresholdMB) {
      console.warn(`⚠️ High Memory Usage: ${usage.heapUsed}MB (threshold: ${thresholdMB}MB)`);
      return true;
    }
    return false;
  }
};

// Connection pool monitor
const connectionPoolMonitor = (sequelize) => {
  return {
    getPoolStats: () => {
      const pool = sequelize.connectionManager.pool;
      return {
        total: pool.size,
        used: pool.used,
        waiting: pool.pending,
        available: pool.size - pool.used
      };
    },

    logPoolStats: () => {
      const stats = connectionPoolMonitor(sequelize).getPoolStats();
      console.log(`🔗 Connection Pool Stats:`, stats);
      return stats;
    },

    checkPoolHealth: () => {
      const stats = connectionPoolMonitor(sequelize).getPoolStats();
      const health = {
        healthy: stats.available > 0,
        warning: stats.used / stats.total > 0.8,
        critical: stats.used / stats.total > 0.95
      };
      
      if (health.critical) {
        console.error(`🚨 Connection Pool Critical: ${stats.used}/${stats.total} connections used`);
      } else if (health.warning) {
        console.warn(`⚠️ Connection Pool Warning: ${stats.used}/${stats.total} connections used`);
      }
      
      return health;
    }
  };
};

// Performance metrics collector
const metricsCollector = {
  metrics: {
    requests: 0,
    totalResponseTime: 0,
    slowQueries: 0,
    errors: 0,
    cacheHits: 0,
    cacheMisses: 0
  },

  recordRequest: (responseTime) => {
    metricsCollector.metrics.requests++;
    metricsCollector.metrics.totalResponseTime += responseTime;
  },

  recordSlowQuery: () => {
    metricsCollector.metrics.slowQueries++;
  },

  recordError: () => {
    metricsCollector.metrics.errors++;
  },

  recordCacheHit: () => {
    metricsCollector.metrics.cacheHits++;
  },

  recordCacheMiss: () => {
    metricsCollector.metrics.cacheMisses++;
  },

  getMetrics: () => {
    const avgResponseTime = metricsCollector.metrics.requests > 0 
      ? metricsCollector.metrics.totalResponseTime / metricsCollector.metrics.requests 
      : 0;

    return {
      ...metricsCollector.metrics,
      averageResponseTime: avgResponseTime,
      cacheHitRate: metricsCollector.metrics.cacheHits + metricsCollector.metrics.cacheMisses > 0
        ? metricsCollector.metrics.cacheHits / (metricsCollector.metrics.cacheHits + metricsCollector.metrics.cacheMisses)
        : 0
    };
  },

  reset: () => {
    metricsCollector.metrics = {
      requests: 0,
      totalResponseTime: 0,
      slowQueries: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }
};

// Performance report generator
const generatePerformanceReport = () => {
  const metrics = metricsCollector.getMetrics();
  const memory = memoryMonitor.getCurrentUsage();
  
  console.log('\n📊 Performance Report:');
  console.log('====================');
  console.log(`Total Requests: ${metrics.requests}`);
  console.log(`Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
  console.log(`Slow Queries: ${metrics.slowQueries}`);
  console.log(`Errors: ${metrics.errors}`);
  console.log(`Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%`);
  console.log(`Memory Usage: ${memory.heapUsed}MB / ${memory.heapTotal}MB`);
  console.log('====================\n');
  
  return {
    metrics,
    memory,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  performanceMonitor,
  dbPerformanceMonitor,
  memoryMonitor,
  connectionPoolMonitor,
  metricsCollector,
  generatePerformanceReport
};
