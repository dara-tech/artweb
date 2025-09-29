#!/usr/bin/env node

/**
 * System Optimization Script
 * Performs comprehensive optimization of the PreART system
 */

const { siteDatabaseManager } = require('../src/config/siteDatabase');
const { cache } = require('../src/services/optimizedCache');
const performanceMonitor = require('../src/services/performanceMonitor');

class SystemOptimizer {
  constructor() {
    this.optimizations = [];
    this.results = {
      database: {},
      cache: {},
      performance: {},
      recommendations: []
    };
  }

  async run() {
    console.log('🚀 Starting System Optimization');
    console.log('================================\n');

    try {
      // Step 1: Database Optimization
      await this.optimizeDatabase();
      
      // Step 2: Cache Optimization
      await this.optimizeCache();
      
      // Step 3: Performance Optimization
      await this.optimizePerformance();
      
      // Step 4: Generate Recommendations
      this.generateRecommendations();
      
      // Step 5: Display Results
      this.displayResults();
      
      console.log('\n🎉 System optimization completed successfully!');
      
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    } finally {
      await siteDatabaseManager.closeAllConnections();
    }
  }

  async optimizeDatabase() {
    console.log('🗄️  Step 1: Database Optimization');
    console.log('----------------------------------');
    
    try {
      // Test all site connections
      const sites = await siteDatabaseManager.getAllSites();
      console.log(`📊 Found ${sites.length} sites to optimize`);
      
      const connectionResults = [];
      
      for (const site of sites) {
        try {
          const startTime = performance.now();
          const connection = await siteDatabaseManager.getSiteConnection(site.code);
          await connection.authenticate();
          const connectionTime = performance.now() - startTime;
          
          connectionResults.push({
            site: site.code,
            name: site.name,
            status: 'connected',
            connectionTime: Math.round(connectionTime)
          });
          
          console.log(`✅ ${site.name} (${site.code}): Connected in ${Math.round(connectionTime)}ms`);
          
        } catch (error) {
          connectionResults.push({
            site: site.code,
            name: site.name,
            status: 'error',
            error: error.message
          });
          
          console.log(`❌ ${site.name} (${site.code}): ${error.message}`);
        }
      }
      
      this.results.database = {
        totalSites: sites.length,
        connectedSites: connectionResults.filter(r => r.status === 'connected').length,
        failedSites: connectionResults.filter(r => r.status === 'error').length,
        results: connectionResults
      };
      
      console.log(`✅ Database optimization completed: ${this.results.database.connectedSites}/${this.results.database.totalSites} sites connected\n`);
      
    } catch (error) {
      console.error('❌ Database optimization failed:', error);
      this.results.database.error = error.message;
    }
  }

  async optimizeCache() {
    console.log('💾 Step 2: Cache Optimization');
    console.log('------------------------------');
    
    try {
      // Get current cache stats
      const stats = cache.getStats();
      console.log(`📊 Current cache stats: ${stats.keys} keys, ${stats.hitRate} hit rate`);
      
      // Warm up cache with site data
      const sites = await siteDatabaseManager.getAllSites();
      await cache.warmupCache(sites);
      
      // Get updated stats
      const updatedStats = cache.getStats();
      
      this.results.cache = {
        before: stats,
        after: updatedStats,
        improvement: {
          keysAdded: updatedStats.keys - stats.keys,
          hitRateChange: parseFloat(updatedStats.hitRate) - parseFloat(stats.hitRate)
        }
      };
      
      console.log(`✅ Cache optimization completed: ${this.results.cache.improvement.keysAdded} keys added\n`);
      
    } catch (error) {
      console.error('❌ Cache optimization failed:', error);
      this.results.cache.error = error.message;
    }
  }

  async optimizePerformance() {
    console.log('⚡ Step 3: Performance Optimization');
    console.log('-----------------------------------');
    
    try {
      // Get current performance metrics
      const metrics = performanceMonitor.getMetrics();
      const summary = performanceMonitor.getPerformanceSummary();
      
      this.results.performance = {
        current: {
          requests: metrics.requests,
          database: metrics.database,
          cache: metrics.cache,
          indicators: metrics.indicators
        },
        summary: summary,
        memory: performanceMonitor.getMemoryUsage()
      };
      
      console.log('📊 Performance metrics:');
      console.log(`   - Requests: ${metrics.requests.total} total, ${metrics.requests.averageResponseTime}ms avg`);
      console.log(`   - Database: ${metrics.database.queries} queries, ${metrics.database.averageQueryTime}ms avg`);
      console.log(`   - Cache: ${metrics.cache.hitRate}% hit rate`);
      console.log(`   - Indicators: ${metrics.indicators.totalExecutions} executions, ${metrics.indicators.averageExecutionTime}ms avg`);
      console.log(`   - Memory: ${this.results.performance.memory.heapUsed}MB used / ${this.results.performance.memory.heapTotal}MB total`);
      
      console.log('✅ Performance optimization completed\n');
      
    } catch (error) {
      console.error('❌ Performance optimization failed:', error);
      this.results.performance.error = error.message;
    }
  }

  generateRecommendations() {
    console.log('💡 Step 4: Generating Recommendations');
    console.log('-------------------------------------');
    
    const recommendations = [];
    
    // Database recommendations
    if (this.results.database.failedSites > 0) {
      recommendations.push({
        type: 'database',
        priority: 'high',
        title: 'Fix Database Connections',
        description: `${this.results.database.failedSites} site(s) have connection issues`,
        action: 'Check database credentials and network connectivity',
        impact: 'Critical for data access'
      });
    }
    
    // Cache recommendations
    const hitRate = parseFloat(this.results.cache.after?.hitRate || '0');
    if (hitRate < 70) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        title: 'Improve Cache Performance',
        description: `Cache hit rate is ${hitRate}%, should be > 70%`,
        action: 'Increase cache TTL and optimize cache keys',
        impact: 'Better response times'
      });
    }
    
    // Memory recommendations
    const memoryUsage = this.results.performance.memory?.heapUsed / this.results.performance.memory?.heapTotal;
    if (memoryUsage > 0.8) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        title: 'Optimize Memory Usage',
        description: `Memory usage is ${(memoryUsage * 100).toFixed(1)}%, should be < 80%`,
        action: 'Review memory leaks and optimize queries',
        impact: 'Prevent system crashes'
      });
    }
    
    // Response time recommendations
    const avgResponseTime = this.results.performance.current?.requests?.averageResponseTime || 0;
    if (avgResponseTime > 2000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: 'Improve Response Times',
        description: `Average response time is ${avgResponseTime}ms, should be < 2000ms`,
        action: 'Optimize queries and add indexes',
        impact: 'Better user experience'
      });
    }
    
    // Query performance recommendations
    const avgQueryTime = this.results.performance.current?.database?.averageQueryTime || 0;
    if (avgQueryTime > 1000) {
      recommendations.push({
        type: 'database',
        priority: 'medium',
        title: 'Optimize Database Queries',
        description: `Average query time is ${avgQueryTime}ms, should be < 1000ms`,
        action: 'Add indexes and optimize slow queries',
        impact: 'Faster data retrieval'
      });
    }
    
    this.results.recommendations = recommendations;
    
    console.log(`✅ Generated ${recommendations.length} recommendations\n`);
  }

  displayResults() {
    console.log('📊 OPTIMIZATION RESULTS');
    console.log('========================\n');
    
    // Database Results
    console.log('🗄️  DATABASE:');
    console.log(`   Total Sites: ${this.results.database.totalSites}`);
    console.log(`   Connected: ${this.results.database.connectedSites}`);
    console.log(`   Failed: ${this.results.database.failedSites}`);
    console.log(`   Success Rate: ${((this.results.database.connectedSites / this.results.database.totalSites) * 100).toFixed(1)}%\n`);
    
    // Cache Results
    console.log('💾 CACHE:');
    console.log(`   Keys: ${this.results.cache.after?.keys || 0}`);
    console.log(`   Hit Rate: ${this.results.cache.after?.hitRate || '0%'}`);
    console.log(`   Improvement: ${this.results.cache.improvement?.keysAdded || 0} keys added\n`);
    
    // Performance Results
    console.log('⚡ PERFORMANCE:');
    console.log(`   Memory Usage: ${this.results.performance.memory?.heapUsed || 0}MB / ${this.results.performance.memory?.heapTotal || 0}MB`);
    console.log(`   Response Time: ${this.results.performance.current?.requests?.averageResponseTime || 0}ms`);
    console.log(`   Query Time: ${this.results.performance.current?.database?.averageQueryTime || 0}ms`);
    console.log(`   Cache Hit Rate: ${this.results.performance.current?.cache?.hitRate || '0%'}\n`);
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priority} ${rec.title}`);
        console.log(`      ${rec.description}`);
        console.log(`      Action: ${rec.action}`);
        console.log(`      Impact: ${rec.impact}\n`);
      });
    } else {
      console.log('✅ No critical issues found. System is running optimally!\n');
    }
    
    console.log('🎯 NEXT STEPS:');
    console.log('   1. Address high-priority recommendations first');
    console.log('   2. Monitor performance metrics regularly');
    console.log('   3. Run this optimization script weekly');
    console.log('   4. Check /api/performance endpoints for real-time monitoring\n');
  }
}

// Run the optimization
if (require.main === module) {
  const optimizer = new SystemOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = SystemOptimizer;
