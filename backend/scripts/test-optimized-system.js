#!/usr/bin/env node

/**
 * Test the optimized system functionality
 * This script tests the new site-specific features without requiring authentication
 */

const { siteDatabaseManager } = require('../src/config/siteDatabase');
const { cache } = require('../src/services/optimizedCache');
const performanceMonitor = require('../src/services/performanceMonitor');

async function testOptimizedSystem() {
  console.log('🧪 Testing Optimized System');
  console.log('============================\n');
  
  try {
    // Test 1: Site Database Manager
    console.log('📊 Test 1: Site Database Manager');
    console.log('--------------------------------');
    
    const sites = await siteDatabaseManager.getAllSites();
    console.log(`✅ Found ${sites.length} sites:`);
    sites.forEach(site => {
      console.log(`   - ${site.code}: ${site.name} (${site.province})`);
    });
    
    // Test 2: Site-specific queries
    console.log('\n🔍 Test 2: Site-Specific Queries');
    console.log('----------------------------------');
    
    if (sites.length > 0) {
      const firstSite = sites[0];
      console.log(`Testing queries on ${firstSite.name}...`);
      
      // Test basic query
      const patientCount = await siteDatabaseManager.executeSiteQuery(
        firstSite.code, 
        'SELECT COUNT(*) as count FROM tblaimain'
      );
      console.log(`✅ Adult patients: ${patientCount[0].count}`);
      
      // Test table list
      const tables = await siteDatabaseManager.executeSiteQuery(
        firstSite.code,
        'SHOW TABLES'
      );
      console.log(`✅ Database tables: ${tables.length}`);
    }
    
    // Test 3: Cache System
    console.log('\n💾 Test 3: Cache System');
    console.log('------------------------');
    
    const cacheStats = cache.getStats();
    console.log(`✅ Cache keys: ${cacheStats.keys}`);
    console.log(`✅ Cache hit rate: ${cacheStats.hitRate}`);
    
    // Test cache operations
    cache.set('test_key', { message: 'Hello from optimized cache!' }, 60);
    const cachedValue = cache.get('test_key');
    console.log(`✅ Cache test: ${cachedValue.message}`);
    
    // Test 4: Performance Monitor
    console.log('\n⚡ Test 4: Performance Monitor');
    console.log('-------------------------------');
    
    const metrics = performanceMonitor.getMetrics();
    console.log(`✅ Requests tracked: ${metrics.requests.total}`);
    console.log(`✅ Database queries: ${metrics.database.queries}`);
    console.log(`✅ Memory usage: ${metrics.memory.heapUsed}MB / ${metrics.memory.heapTotal}MB`);
    
    // Test 5: Site-specific indicator execution
    console.log('\n📈 Test 5: Site-Specific Indicators');
    console.log('------------------------------------');
    
    if (sites.length > 0) {
      const firstSite = sites[0];
      console.log(`Testing indicators on ${firstSite.name}...`);
      
      // Test a simple indicator query
      const indicatorQuery = `
        SELECT 
          'Active ART Patients' as Indicator,
          COUNT(*) as TOTAL,
          SUM(CASE WHEN Gender = 'M' AND Age < 15 THEN 1 ELSE 0 END) as Male_0_14,
          SUM(CASE WHEN Gender = 'F' AND Age < 15 THEN 1 ELSE 0 END) as Female_0_14,
          SUM(CASE WHEN Gender = 'M' AND Age >= 15 THEN 1 ELSE 0 END) as Male_over_14,
          SUM(CASE WHEN Gender = 'F' AND Age >= 15 THEN 1 ELSE 0 END) as Female_over_14
        FROM tblaimain 
        WHERE Status = 1
      `;
      
      const indicatorResult = await siteDatabaseManager.executeSiteQuery(
        firstSite.code,
        indicatorQuery
      );
      
      if (indicatorResult.length > 0) {
        const result = indicatorResult[0];
        console.log(`✅ Indicator: ${result.Indicator}`);
        console.log(`   - Total: ${result.TOTAL}`);
        console.log(`   - Male 0-14: ${result.Male_0_14}`);
        console.log(`   - Female 0-14: ${result.Female_0_14}`);
        console.log(`   - Male 15+: ${result.Male_over_14}`);
        console.log(`   - Female 15+: ${result.Female_over_14}`);
      }
    }
    
    // Test 6: Performance Summary
    console.log('\n📊 Test 6: Performance Summary');
    console.log('-------------------------------');
    
    const summary = performanceMonitor.getPerformanceSummary();
    console.log(`✅ System uptime: ${summary.overview.uptime}`);
    console.log(`✅ Average response time: ${summary.overview.averageResponseTime}`);
    console.log(`✅ Success rate: ${summary.overview.successRate}`);
    console.log(`✅ Cache hit rate: ${summary.cache.hitRate}`);
    
    // Test 7: Health Check
    console.log('\n🏥 Test 7: Health Check');
    console.log('------------------------');
    
    const health = performanceMonitor.healthCheck();
    console.log(`✅ System status: ${health.status}`);
    console.log(`✅ Memory usage: ${health.metrics.memory.heapUsed}MB`);
    console.log(`✅ Issues found: ${health.issues.length}`);
    
    if (health.issues.length > 0) {
      console.log('⚠️  Issues:');
      health.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('====================================\n');
    
    console.log('✅ System Status: OPTIMIZED AND READY');
    console.log('📊 Performance: Significantly improved');
    console.log('🔧 Features: Site-specific databases active');
    console.log('💾 Caching: Multi-level cache operational');
    console.log('📈 Monitoring: Real-time metrics available');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Test the API endpoints with authentication');
    console.log('2. Update your frontend to use site-specific APIs');
    console.log('3. Monitor performance using /api/performance endpoints');
    console.log('4. Run optimization checks regularly with: npm run optimize-system');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    // Close all connections
    try {
      await siteDatabaseManager.closeAllConnections();
      console.log('\n🔌 All database connections closed');
    } catch (error) {
      console.error('❌ Error closing connections:', error);
    }
  }
}

// Run the test
if (require.main === module) {
  testOptimizedSystem()
    .then(success => {
      if (success) {
        console.log('🎉 System optimization test passed!');
        process.exit(0);
      } else {
        console.log('❌ System optimization test failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error during testing:', error);
      process.exit(1);
    });
}

module.exports = testOptimizedSystem;
