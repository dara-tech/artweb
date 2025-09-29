const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const siteOptimizedIndicators = require('../services/siteOptimizedIndicators');
const { siteDatabaseManager } = require('../config/siteDatabase');

const router = express.Router();

// Request deduplication for site indicators
const pendingRequests = new Map();

// Get all indicators for a specific site
router.get('/sites/:siteCode/indicators', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    const { startDate, endDate, previousEndDate, useCache = 'true' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null,
      lost_code: 0,
      dead_code: 1,
      transfer_out_code: 3,
      mmd_eligible_code: 0,
      mmd_drug_quantity: 60,
      vl_suppression_threshold: 1000,
      tld_regimen_formula: '3TC + DTG + TDF',
      transfer_in_code: 1,
      tpt_drug_list: "'Isoniazid','3HP','6H'"
    };

    // Create request key for deduplication
    const requestKey = `site_${siteCode}_${JSON.stringify(params)}`;
    
    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log(`🔄 Request already pending for site ${siteCode}, waiting...`);
      try {
        const result = await pendingRequests.get(requestKey);
        return res.json(result);
      } catch (error) {
        console.error('Error with pending request:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }

    // Create a new promise for this request
    const requestPromise = (async () => {
      try {
        console.log(`🚀 Executing all indicators for site ${siteCode}...`);
        const result = await siteOptimizedIndicators.executeAllSiteIndicators(
          siteCode, 
          params, 
          useCache === 'true'
        );

        const response = {
          success: true,
          site: siteInfo,
          data: result.results,
          performance: {
            executionTime: result.executionTime,
            successCount: result.successCount,
            errorCount: result.errorCount,
            averageTimePerIndicator: result.averageTimePerIndicator
          },
          period: params,
          timestamp: result.timestamp
        };

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
      console.error(`Site indicators error for ${siteCode}:`, error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.stack
      });
    }
  } catch (error) {
    console.error(`Site indicators error:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific indicator for a site
router.get('/sites/:siteCode/indicators/:indicatorId', authenticateToken, async (req, res) => {
  try {
    const { siteCode, indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, useCache = 'true' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null,
      lost_code: 0,
      dead_code: 1,
      transfer_out_code: 3,
      mmd_eligible_code: 0,
      mmd_drug_quantity: 60,
      vl_suppression_threshold: 1000,
      tld_regimen_formula: '3TC + DTG + TDF',
      transfer_in_code: 1,
      tpt_drug_list: "'Isoniazid','3HP','6H'"
    };

    console.log(`Executing ${indicatorId} for site ${siteCode}...`);
    
    const result = await siteOptimizedIndicators.executeSiteIndicator(
      siteCode, 
      indicatorId, 
      params, 
      useCache === 'true'
    );
    
    res.json({
      success: true,
      site: siteInfo,
      data: result.data,
      performance: {
        executionTime: result.executionTime
      },
      period: params,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error(`Site indicator ${req.params.indicatorId} error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get indicator details for a site
router.get('/sites/:siteCode/indicators/:indicatorId/details', authenticateToken, async (req, res) => {
  try {
    const { siteCode, indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, page = 1, limit = 50, search = '', ageGroup = '', gender = '' } = req.query;
    
    console.log('🔍 Site details request params:', { siteCode, indicatorId, search, ageGroup, gender });
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null,
      lost_code: 0,
      dead_code: 1,
      transfer_out_code: 3,
      mmd_eligible_code: 0,
      mmd_drug_quantity: 60,
      vl_suppression_threshold: 1000,
      tld_regimen_formula: '3TC + DTG + TDF',
      transfer_in_code: 1,
      tpt_drug_list: "'Isoniazid','3HP','6H'"
    };

    const result = await siteOptimizedIndicators.executeSiteIndicatorDetails(
      siteCode,
      indicatorId,
      params,
      parseInt(page),
      parseInt(limit),
      search,
      ageGroup,
      gender
    );
    
    res.json({
      success: true,
      site: siteInfo,
      data: result.data,
      pagination: result.pagination,
      period: params,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error(`Site indicator details ${req.params.indicatorId} error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get all indicators for all sites
router.get('/all-sites/indicators', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate, useCache = 'true' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null,
      lost_code: 0,
      dead_code: 1,
      transfer_out_code: 3,
      mmd_eligible_code: 0,
      mmd_drug_quantity: 60,
      vl_suppression_threshold: 1000,
      tld_regimen_formula: '3TC + DTG + TDF',
      transfer_in_code: 1,
      tpt_drug_list: "'Isoniazid','3HP','6H'"
    };

    // Create request key for deduplication
    const requestKey = `all_sites_${JSON.stringify(params)}`;
    
    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log('🔄 Request already pending for all sites, waiting...');
      try {
        const result = await pendingRequests.get(requestKey);
        return res.json(result);
      } catch (error) {
        console.error('Error with pending request:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }

    // Create a new promise for this request
    const requestPromise = (async () => {
      try {
        console.log('🚀 Executing all indicators for all sites...');
        const result = await siteOptimizedIndicators.executeAllSitesIndicators(
          params, 
          useCache === 'true'
        );

        const response = {
          success: true,
          data: result.sites,
          performance: {
            executionTime: result.executionTime,
            totalSuccess: result.totalSuccess,
            totalErrors: result.totalErrors,
            siteCount: result.siteCount
          },
          period: params,
          timestamp: result.timestamp
        };

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
      console.error('All sites indicators error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.stack
      });
    }
  } catch (error) {
    console.error('All sites indicators error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear cache for a specific site
router.post('/sites/:siteCode/cache/clear', authenticateToken, async (req, res) => {
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

    siteOptimizedIndicators.clearSiteCache(siteCode);
    
    res.json({
      success: true,
      message: `Cache cleared for site ${siteInfo.name}`,
      site: siteInfo
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear all cache
router.post('/cache/clear', authenticateToken, async (req, res) => {
  try {
    siteOptimizedIndicators.clearAllCache();
    
    res.json({
      success: true,
      message: 'All cache cleared'
    });
  } catch (error) {
    console.error('Clear all cache error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get cache statistics
router.get('/cache/stats', authenticateToken, async (req, res) => {
  try {
    const { cache } = require('../services/cache');
    const stats = cache.getStats();
    
    res.json({
      success: true,
      cache: {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: stats.hitRate
      }
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
