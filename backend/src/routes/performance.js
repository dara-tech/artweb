const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const performanceMonitor = require('../services/performanceMonitor');
const { siteDatabaseManager } = require('../config/siteDatabase');
const { cache } = require('../services/optimizedCache');

const router = express.Router();

// Get performance metrics
router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get performance summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const summary = performanceMonitor.getPerformanceSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Performance summary error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get health check
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const health = performanceMonitor.healthCheck();
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get cache statistics
router.get('/cache', authenticateToken, async (req, res) => {
  try {
    const stats = cache.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get database connection status
router.get('/database', authenticateToken, async (req, res) => {
  try {
    const sites = await siteDatabaseManager.getAllSites();
    const connectionStatus = [];

    for (const site of sites) {
      try {
        const connection = await siteDatabaseManager.getSiteConnection(site.code);
        await connection.authenticate();
        connectionStatus.push({
          site: site.code,
          name: site.name,
          status: 'connected',
          database: site.database_name
        });
      } catch (error) {
        connectionStatus.push({
          site: site.code,
          name: site.name,
          status: 'disconnected',
          error: error.message,
          database: site.database_name
        });
      }
    }

    res.json({
      success: true,
      data: {
        sites: connectionStatus,
        totalSites: sites.length,
        connectedSites: connectionStatus.filter(s => s.status === 'connected').length,
        disconnectedSites: connectionStatus.filter(s => s.status === 'disconnected').length
      }
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get system information
router.get('/system', authenticateToken, async (req, res) => {
  try {
    const os = require('os');
    const process = require('process');
    
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: {
        process: Math.round(process.uptime()),
        system: Math.round(os.uptime())
      },
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024 / 1024), // GB
        free: Math.round(os.freemem() / 1024 / 1024 / 1024), // GB
        used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024) // GB
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        speed: os.cpus()[0].speed
      },
      loadAverage: os.loadavg(),
      process: {
        pid: process.pid,
        memory: performanceMonitor.getMemoryUsage(),
        uptime: Math.round(process.uptime())
      }
    };

    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reset performance metrics
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    performanceMonitor.reset();
    res.json({
      success: true,
      message: 'Performance metrics reset successfully'
    });
  } catch (error) {
    console.error('Reset metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear all caches
router.post('/cache/clear', authenticateToken, async (req, res) => {
  try {
    cache.flushAll();
    res.json({
      success: true,
      message: 'All caches cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear site-specific cache
router.post('/cache/clear/:siteCode', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    
    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    const clearedCount = cache.clearSiteCache(siteCode);
    
    res.json({
      success: true,
      message: `Cleared ${clearedCount} cache entries for site ${siteInfo.name}`,
      site: siteInfo
    });
  } catch (error) {
    console.error('Clear site cache error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get detailed performance report
router.get('/report', authenticateToken, async (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    const summary = performanceMonitor.getPerformanceSummary();
    const health = performanceMonitor.healthCheck();
    const cacheStats = cache.getStats();
    
    // Get database status
    const sites = await siteDatabaseManager.getAllSites();
    const dbStatus = {
      totalSites: sites.length,
      connectedSites: 0,
      disconnectedSites: 0
    };

    for (const site of sites) {
      try {
        const connection = await siteDatabaseManager.getSiteConnection(site.code);
        await connection.authenticate();
        dbStatus.connectedSites++;
      } catch (error) {
        dbStatus.disconnectedSites++;
      }
    }

    const report = {
      timestamp: new Date().toISOString(),
      health,
      performance: {
        metrics,
        summary
      },
      cache: cacheStats,
      database: dbStatus,
      recommendations: generateRecommendations(metrics, cacheStats, dbStatus)
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Performance report error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate performance recommendations
function generateRecommendations(metrics, cacheStats, dbStatus) {
  const recommendations = [];

  // Memory recommendations
  const memoryUsage = metrics.memory.heapUsed / metrics.memory.heapTotal;
  if (memoryUsage > 0.8) {
    recommendations.push({
      type: 'memory',
      priority: 'high',
      message: 'High memory usage detected. Consider increasing server memory or optimizing queries.',
      action: 'Monitor memory usage and consider query optimization'
    });
  }

  // Cache recommendations
  const hitRate = parseFloat(cacheStats.hitRate);
  if (hitRate < 70) {
    recommendations.push({
      type: 'cache',
      priority: 'medium',
      message: 'Low cache hit rate. Consider increasing cache TTL or optimizing cache keys.',
      action: 'Review cache configuration and increase TTL for frequently accessed data'
    });
  }

  // Database recommendations
  if (dbStatus.disconnectedSites > 0) {
    recommendations.push({
      type: 'database',
      priority: 'high',
      message: `${dbStatus.disconnectedSites} site(s) have database connection issues.`,
      action: 'Check database connections and network connectivity'
    });
  }

  // Response time recommendations
  if (metrics.requests.averageResponseTime > 2000) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      message: 'Slow response times detected. Consider optimizing queries or increasing server resources.',
      action: 'Review slow queries and consider adding indexes'
    });
  }

  // Query performance recommendations
  if (metrics.database.averageQueryTime > 1000) {
    recommendations.push({
      type: 'database',
      priority: 'medium',
      message: 'Slow database queries detected. Consider optimizing query performance.',
      action: 'Review and optimize slow queries, add indexes where needed'
    });
  }

  return recommendations;
}

module.exports = router;
