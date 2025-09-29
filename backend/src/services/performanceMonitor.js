const { performance } = require('perf_hooks');

/**
 * Performance Monitoring Service
 * Tracks and analyzes system performance metrics
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0
      },
      database: {
        queries: 0,
        averageQueryTime: 0,
        slowQueries: [],
        connectionPool: {
          active: 0,
          idle: 0,
          total: 0
        }
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      },
      indicators: {
        totalExecutions: 0,
        averageExecutionTime: 0,
        siteBreakdown: new Map()
      }
    };

    this.startTime = Date.now();
    this.requestTimes = [];
    this.queryTimes = [];
    this.indicatorTimes = [];

    // Start monitoring
    this.startMonitoring();
  }

  // Start background monitoring
  startMonitoring() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateMetrics();
    }, 30000);

    // Log performance summary every 5 minutes
    setInterval(() => {
      this.logPerformanceSummary();
    }, 300000);
  }

  // Track request performance
  trackRequest(method, url, responseTime, success = true) {
    this.metrics.requests.total++;
    
    if (success) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    this.requestTimes.push(responseTime);
    
    // Keep only last 1000 request times for average calculation
    if (this.requestTimes.length > 1000) {
      this.requestTimes = this.requestTimes.slice(-1000);
    }

    this.metrics.requests.averageResponseTime = this.calculateAverage(this.requestTimes);
  }

  // Track database query performance
  trackQuery(query, executionTime, success = true) {
    this.metrics.database.queries++;
    this.queryTimes.push(executionTime);

    // Keep only last 1000 query times
    if (this.queryTimes.length > 1000) {
      this.queryTimes = this.queryTimes.slice(-1000);
    }

    this.metrics.database.averageQueryTime = this.calculateAverage(this.queryTimes);

    // Track slow queries (> 1 second)
    if (executionTime > 1000) {
      this.metrics.database.slowQueries.push({
        query: query.substring(0, 100) + '...',
        executionTime,
        timestamp: new Date().toISOString()
      });

      // Keep only last 50 slow queries
      if (this.metrics.database.slowQueries.length > 50) {
        this.metrics.database.slowQueries = this.metrics.database.slowQueries.slice(-50);
      }
    }
  }

  // Track indicator execution performance
  trackIndicator(siteCode, indicatorId, executionTime, success = true) {
    this.metrics.indicators.totalExecutions++;
    this.indicatorTimes.push(executionTime);

    // Keep only last 1000 indicator times
    if (this.indicatorTimes.length > 1000) {
      this.indicatorTimes = this.indicatorTimes.slice(-1000);
    }

    this.metrics.indicators.averageExecutionTime = this.calculateAverage(this.indicatorTimes);

    // Track per-site performance
    if (!this.metrics.indicators.siteBreakdown.has(siteCode)) {
      this.metrics.indicators.siteBreakdown.set(siteCode, {
        executions: 0,
        totalTime: 0,
        averageTime: 0,
        successCount: 0,
        errorCount: 0
      });
    }

    const siteMetrics = this.metrics.indicators.siteBreakdown.get(siteCode);
    siteMetrics.executions++;
    siteMetrics.totalTime += executionTime;
    siteMetrics.averageTime = siteMetrics.totalTime / siteMetrics.executions;

    if (success) {
      siteMetrics.successCount++;
    } else {
      siteMetrics.errorCount++;
    }
  }

  // Track cache performance
  trackCache(hit = true) {
    if (hit) {
      this.metrics.cache.hits++;
    } else {
      this.metrics.cache.misses++;
    }

    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0 ? (this.metrics.cache.hits / total * 100).toFixed(2) : 0;
  }

  // Calculate average from array
  calculateAverage(times) {
    if (times.length === 0) return 0;
    return Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
  }

  // Update metrics
  updateMetrics() {
    // Update request metrics
    this.metrics.requests.averageResponseTime = this.calculateAverage(this.requestTimes);
    
    // Update database metrics
    this.metrics.database.averageQueryTime = this.calculateAverage(this.queryTimes);
    
    // Update indicator metrics
    this.metrics.indicators.averageExecutionTime = this.calculateAverage(this.indicatorTimes);
  }

  // Get current metrics
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    
    return {
      ...this.metrics,
      uptime: {
        seconds: Math.round(uptime / 1000),
        minutes: Math.round(uptime / 60000),
        hours: Math.round(uptime / 3600000)
      },
      memory: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  // Get memory usage
  getMemoryUsage() {
    const memUsage = process.memoryUsage();
    return {
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
      arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024) // MB
    };
  }

  // Get performance summary
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    
    return {
      overview: {
        uptime: `${metrics.uptime.hours}h ${metrics.uptime.minutes % 60}m`,
        requestsPerMinute: Math.round(metrics.requests.total / (metrics.uptime.minutes || 1)),
        averageResponseTime: `${metrics.requests.averageResponseTime}ms`,
        successRate: `${((metrics.requests.successful / metrics.requests.total) * 100).toFixed(2)}%`
      },
      database: {
        queriesPerMinute: Math.round(metrics.database.queries / (metrics.uptime.minutes || 1)),
        averageQueryTime: `${metrics.database.averageQueryTime}ms`,
        slowQueries: metrics.database.slowQueries.length
      },
      cache: {
        hitRate: `${metrics.cache.hitRate}%`,
        totalRequests: metrics.cache.hits + metrics.cache.misses
      },
      indicators: {
        executionsPerMinute: Math.round(metrics.indicators.totalExecutions / (metrics.uptime.minutes || 1)),
        averageExecutionTime: `${metrics.indicators.averageExecutionTime}ms`,
        siteBreakdown: Object.fromEntries(metrics.indicators.siteBreakdown)
      },
      memory: metrics.memory
    };
  }

  // Log performance summary
  logPerformanceSummary() {
    const summary = this.getPerformanceSummary();
    
    console.log('\n📊 PERFORMANCE SUMMARY');
    console.log('======================');
    console.log(`⏱️  Uptime: ${summary.overview.uptime}`);
    console.log(`📈 Requests/min: ${summary.overview.requestsPerMinute}`);
    console.log(`⚡ Avg Response: ${summary.overview.averageResponseTime}`);
    console.log(`✅ Success Rate: ${summary.overview.successRate}`);
    console.log(`🗄️  DB Queries/min: ${summary.database.queriesPerMinute}`);
    console.log(`⚡ Avg Query Time: ${summary.database.averageQueryTime}`);
    console.log(`🐌 Slow Queries: ${summary.database.slowQueries}`);
    console.log(`💾 Cache Hit Rate: ${summary.cache.hitRate}`);
    console.log(`📊 Indicators/min: ${summary.indicators.executionsPerMinute}`);
    console.log(`⚡ Avg Indicator Time: ${summary.indicators.averageExecutionTime}`);
    console.log(`🧠 Memory: ${summary.memory.heapUsed}MB used / ${summary.memory.heapTotal}MB total`);
    console.log('======================\n');
  }

  // Reset metrics
  reset() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0
      },
      database: {
        queries: 0,
        averageQueryTime: 0,
        slowQueries: [],
        connectionPool: {
          active: 0,
          idle: 0,
          total: 0
        }
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      },
      indicators: {
        totalExecutions: 0,
        averageExecutionTime: 0,
        siteBreakdown: new Map()
      }
    };

    this.requestTimes = [];
    this.queryTimes = [];
    this.indicatorTimes = [];
    this.startTime = Date.now();

    console.log('🔄 Performance metrics reset');
  }

  // Health check
  healthCheck() {
    const metrics = this.getMetrics();
    const memory = metrics.memory;
    
    // Determine health status
    let status = 'healthy';
    const issues = [];

    // Check memory usage
    if (memory.heapUsed > memory.heapTotal * 0.9) {
      status = 'warning';
      issues.push('High memory usage');
    }

    // Check response times
    if (metrics.requests.averageResponseTime > 5000) {
      status = 'warning';
      issues.push('Slow response times');
    }

    // Check query times
    if (metrics.database.averageQueryTime > 2000) {
      status = 'warning';
      issues.push('Slow database queries');
    }

    // Check error rate
    const errorRate = metrics.requests.total > 0 ? (metrics.requests.failed / metrics.requests.total) * 100 : 0;
    if (errorRate > 10) {
      status = 'critical';
      issues.push('High error rate');
    }

    return {
      status,
      issues,
      metrics: this.getPerformanceSummary(),
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor;
