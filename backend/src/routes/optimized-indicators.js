const express = require('express');
const optimizedIndicators = require('../services/optimizedIndicators');
const siteOptimizedIndicators = require('../services/siteOptimizedIndicators');
const { siteDatabaseManager } = require('../config/siteDatabase');
const { performance } = require('perf_hooks');
const router = express.Router();

// Simple request deduplication
const pendingRequests = new Map();

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const startTime = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - startTime;
    console.log(`📊 ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
  });
  
  next();
};

router.use(performanceMonitor);

// Get all indicators (optimized)
router.get('/all', async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate, siteCode } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31',
      siteCode: siteCode || null
    };

    // Create a unique key for this request
    const requestKey = `all:${JSON.stringify(params)}`;
    
    // Check if there's already a pending request for the same parameters
    if (pendingRequests.has(requestKey)) {
      console.log('🔄 Deduplicating request - waiting for existing request...');
      const existingPromise = pendingRequests.get(requestKey);
      
      try {
        const result = await existingPromise;
        return res.json(result);
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Request failed',
          message: error.message
        });
      }
    }

    // Create a new promise for this request
    const requestPromise = (async () => {
    try {
      let result;
      
      if (params.siteCode) {
        // Use site-specific service when siteCode is provided
        console.log(`🚀 Executing all indicators for site ${params.siteCode} with site-specific service...`);
        
        // Validate site exists
        const siteInfo = await siteDatabaseManager.getSiteInfo(params.siteCode);
        if (!siteInfo) {
          throw new Error(`Site ${params.siteCode} not found`);
        }
        
        result = await siteOptimizedIndicators.executeAllSiteIndicators(params.siteCode, params, false);
        
        console.log('🔍 Site-specific service result:', result);
        console.log('📊 Site-specific results length:', result.results?.length);
        console.log('📋 First site result:', result.results?.[0]);
        
        // Transform the result to match the expected format
        result = {
          results: result.results.map(r => r.data || {}),
          executionTime: result.executionTime,
          successCount: result.successCount,
          errorCount: result.errorCount
        };
      } else {
        // Use site-specific service to aggregate across all sites
        console.log('🚀 Executing all indicators by aggregating across all sites...');
        const startTime = performance.now();
        
        // Get all sites
        const sites = await siteDatabaseManager.getAllSites();
        console.log(`📊 Found ${sites.length} sites to aggregate`);
        
        // Execute indicators for each site and aggregate
        const siteResults = [];
        const indicatorMap = new Map();
        
        for (const site of sites) {
          try {
            console.log(`🏥 Processing site ${site.code} (${site.name})`);
            const siteResult = await siteOptimizedIndicators.executeAllSiteIndicators(site.code, params, false);
            
            // Process each indicator result from this site
            siteResult.results.forEach(indicatorResult => {
              const indicatorData = indicatorResult.data;
              const indicatorName = indicatorData.Indicator;
              
              if (!indicatorMap.has(indicatorName)) {
                indicatorMap.set(indicatorName, {
                  Indicator: indicatorName,
                  TOTAL: 0,
                  Male_0_14: 0,
                  Female_0_14: 0,
                  Male_over_14: 0,
                  Female_over_14: 0,
                  error: null
                });
              }
              
              const aggregated = indicatorMap.get(indicatorName);
              if (indicatorData.error) {
                aggregated.error = indicatorData.error;
              } else {
                // Ensure all values are converted to numbers before aggregation
                aggregated.TOTAL += Number(indicatorData.TOTAL || 0);
                aggregated.Male_0_14 += Number(indicatorData.Male_0_14 || 0);
                aggregated.Female_0_14 += Number(indicatorData.Female_0_14 || 0);
                aggregated.Male_over_14 += Number(indicatorData.Male_over_14 || 0);
                aggregated.Female_over_14 += Number(indicatorData.Female_over_14 || 0);
              }
            });
            
            siteResults.push({
              siteCode: site.code,
              siteName: site.name,
              success: true,
              indicatorCount: siteResult.results.length
            });
          } catch (error) {
            console.error(`❌ Error processing site ${site.code}:`, error.message);
            siteResults.push({
              siteCode: site.code,
              siteName: site.name,
              success: false,
              error: error.message
            });
          }
        }
        
        // Convert map to array
        const aggregatedResults = Array.from(indicatorMap.values());
        
        result = {
          results: aggregatedResults,
          executionTime: performance.now() - startTime,
          successCount: siteResults.filter(s => s.success).length,
          errorCount: siteResults.filter(s => !s.success).length,
          siteResults: siteResults
        };
        
        console.log(`📊 Aggregated ${aggregatedResults.length} indicators across ${sites.length} sites`);
      }

      console.log('\n🔍 API ROUTE RESPONSE ANALYSIS');
      console.log('================================');
      console.log('📊 Backend service result:', result);
      console.log('📈 Results array length:', result.results.length);
      console.log('📋 Sample result (first indicator):', result.results[0]);

      const response = {
        success: true,
        data: result.results,
        performance: {
          executionTime: result.executionTime,
          successCount: result.successCount,
          errorCount: result.errorCount,
          averageTimePerIndicator: result.executionTime / result.results.length
        },
        period: params
      };

      console.log('\n🎯 FINAL API RESPONSE TO FRONTEND:');
      console.log('===================================');
      console.log('📊 Response success:', response.success);
      console.log('📈 Performance data:', response.performance);
      console.log('📅 Period:', response.period);
      console.log('📋 Data array length:', response.data.length);
      console.log('📊 Sample data (first 3 indicators):', response.data.slice(0, 3));

      // Remove from pending requests
      pendingRequests.delete(requestKey);
      return response;
      } catch (error) {
        // Remove from pending requests on error
        pendingRequests.delete(requestKey);
        throw error;
      }
    })();

    // Store the promise
    pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      res.json(result);
    } catch (error) {
      console.error('❌ Error fetching all indicators:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch indicators',
        message: error.message
      });
    }
  } catch (error) {
    console.error('❌ Error in all indicators route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicators',
      message: error.message
    });
  }
});

// Get specific indicator (optimized)
router.get('/:indicatorId', async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, siteCode } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31',
      siteCode: siteCode || null
    };

    console.log(`🚀 Executing indicator ${indicatorId} with optimized service...`);
    const result = await optimizedIndicators.executeIndicator(indicatorId, params, false); // Disable caching

    res.json({
      success: true,
      data: result[0] || {},
      period: params
    });
  } catch (error) {
    console.error(`❌ Error fetching indicator ${req.params.indicatorId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicator',
      message: error.message
    });
  }
});

// Get detailed records for specific indicator
router.get('/:indicatorId/details', async (req, res) => {
  const { indicatorId } = req.params;
  
  try {
    const { startDate, endDate, previousEndDate, page = 1, limit = 100, search = '', gender, ageGroup } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31',
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 10000), // Max 10000 records per page for exports
      search: search.trim(),
      gender: gender || null,
      ageGroup: ageGroup || null
    };

    console.log(`🚀 Fetching detailed records for indicator ${indicatorId}...`);
    console.log(`🔍 Request parameters:`, {
      gender: params.gender,
      ageGroup: params.ageGroup,
      search: params.search,
      page: params.page,
      limit: params.limit
    });
    
    const result = await optimizedIndicators.executeIndicatorDetails(indicatorId, params, false); // Disable caching

    console.log('🔍 Backend result:', {
      dataLength: result.data?.length || 0,
      pagination: result.pagination,
      totalCount: result.pagination?.totalCount
    });

    res.json({
      success: true,
      data: result.data || [],
      pagination: result.pagination || {
        page: 1,
        limit: 100,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      search: result.search || '',
      performance: {
        executionTime: result.executionTime || 0,
        recordCount: (result.data || []).length
      },
      period: {
        startDate: params.startDate,
        endDate: params.endDate,
        previousEndDate: params.previousEndDate
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching detailed records for indicator ${indicatorId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detailed records',
      message: error.message
    });
  }
});

// Get indicators by category (optimized)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { startDate, endDate, previousEndDate } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31'
    };

    console.log(`🚀 Executing ${category} indicators with optimized service...`);
    const result = await optimizedIndicators.executeByCategory(category, params);

    res.json({
      success: true,
      data: result.results,
      performance: {
        executionTime: result.executionTime,
        successCount: result.successCount,
        category: result.category
      },
      period: params
    });
  } catch (error) {
    console.error(`❌ Error fetching ${req.params.category} indicators:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category indicators',
      message: error.message
    });
  }
});

// Get details for a specific indicator with pagination
router.get('/details/:indicatorId', async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, page = 1, limit = 100, search = '', gender, ageGroup } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31',
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 10000), // Max 10000 records per page for exports
      search: search.trim(),
      gender: gender || null,
      ageGroup: ageGroup || null
    };

    console.log(`🔍 DETAIL API REQUEST PARAMETERS:`);
    console.log(`  Indicator: ${indicatorId}`);
    console.log(`  Gender: ${params.gender}`);
    console.log(`  Age Group: ${params.ageGroup}`);
    console.log(`  Search: ${params.search}`);
    console.log(`  Page: ${params.page}, Limit: ${params.limit}`);

    // Create a unique key for this request
    const requestKey = `details:${indicatorId}:${JSON.stringify(params)}`;
    
    // Check if there's already a pending request for the same parameters
    if (pendingRequests.has(requestKey)) {
      console.log('🔄 Deduplicating request - waiting for existing request...');
      const existingPromise = pendingRequests.get(requestKey);
      
      try {
        const result = await existingPromise;
        return res.json(result);
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Request failed',
          message: error.message
        });
      }
    }

    // Create new request promise
    const requestPromise = (async () => {
      const startTime = performance.now();
      
      try {
        const details = await optimizedIndicators.executeIndicatorDetails(indicatorId, params, false); // Disable caching
        const executionTime = performance.now() - startTime;
        
        const result = {
          success: true,
          data: details.data || [],
          pagination: details.pagination || {
            page: 1,
            limit: 100,
            totalCount: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          search: details.search || '',
          performance: {
            executionTime: details.executionTime || 0,
            recordCount: (details.data || []).length
          },
          period: {
            startDate: params.startDate,
            endDate: params.endDate,
            previousEndDate: params.previousEndDate
          }
        };
        
        return result;
      } catch (error) {
        console.error(`❌ Error fetching details for ${indicatorId}:`, error);
        return {
          success: false,
          error: 'Failed to fetch indicator details',
          message: error.message,
          period: params
        };
      } finally {
        // Remove from pending requests
        pendingRequests.delete(requestKey);
      }
    })();

    // Store the promise
    pendingRequests.set(requestKey, requestPromise);
    
    // Wait for the result
    const result = await requestPromise;
    
    // Return appropriate status code
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ Error in details endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get performance statistics
router.get('/stats/performance', async (req, res) => {
  try {
    const stats = optimizedIndicators.getStats();
    
    res.json({
      success: true,
      stats: {
        ...stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error fetching performance stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance statistics',
      message: error.message
    });
  }
});

// Clear cache
router.post('/cache/clear', async (req, res) => {
  try {
    const { pattern = '.*' } = req.body;
    const clearedCount = optimizedIndicators.clearCache(pattern);
    
    res.json({
      success: true,
      message: `Cleared ${clearedCount} cache entries`,
      clearedCount
    });
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

// Performance comparison endpoint
router.get('/compare/performance', async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate } = req.query;
    
    const params = {
      startDate: startDate || '2025-01-01',
      endDate: endDate || '2025-03-31',
      previousEndDate: previousEndDate || '2024-12-31'
    };

    console.log('🔬 Running performance comparison...');
    
    // Test optimized approach
    const optimizedStart = performance.now();
    const optimizedResult = await optimizedIndicators.executeAllIndicators(params, false); // No cache
    const optimizedTime = performance.now() - optimizedStart;

    // Test with cache
    const cachedStart = performance.now();
    const cachedResult = await optimizedIndicators.executeAllIndicators(params, true); // With cache
    const cachedTime = performance.now() - cachedStart;

    res.json({
      success: true,
      comparison: {
        optimized: {
          executionTime: optimizedTime,
          successCount: optimizedResult.successCount,
          errorCount: optimizedResult.errorCount
        },
        cached: {
          executionTime: cachedTime,
          successCount: cachedResult.successCount,
          errorCount: cachedResult.errorCount
        },
        improvement: {
          timeSaved: optimizedTime - cachedTime,
          percentageImprovement: ((optimizedTime - cachedTime) / optimizedTime * 100).toFixed(2)
        }
      },
      period: params
    });
  } catch (error) {
    console.error('❌ Error running performance comparison:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run performance comparison',
      message: error.message
    });
  }
});

module.exports = router;
