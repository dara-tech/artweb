const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const siteOptimizedIndicators = require('../services/siteOptimizedIndicators');
const { siteDatabaseManager } = require('../config/siteDatabase');

const router = express.Router();

// Request deduplication for reporting indicators
const pendingRequests = new Map();

// Get all indicators for reporting (supports both site-specific and aggregated)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate, siteCode, useCache = 'true' } = req.query;
    
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
    const requestKey = `reporting_all_${siteCode || 'all'}_${JSON.stringify(params)}`;
    
    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log(`🔄 Request already pending for reporting indicators, waiting...`);
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
        let result;
        
        if (siteCode) {
          // Site-specific indicators
          console.log(`🚀 Executing reporting indicators for site ${siteCode}...`);
          
          // Validate site exists
          const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
          if (!siteInfo) {
            throw new Error('Site not found');
          }
          
          result = await siteOptimizedIndicators.executeAllSiteIndicators(
            siteCode, 
            params, 
            useCache === 'true'
          );
          
          const response = {
            success: true,
            data: result.results,
            site: siteInfo,
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
          
        } else {
          // All sites aggregated indicators
          console.log('🚀 Executing reporting indicators for all sites...');
          
          result = await siteOptimizedIndicators.executeAllSitesIndicators(
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
        }
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
      console.error('Reporting indicators error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.stack
      });
    }
  } catch (error) {
    console.error('Reporting indicators error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get indicators by category (supports both site-specific and aggregated)
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const { startDate, endDate, previousEndDate, siteCode, useCache = 'true' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    // Define category mappings
    const categoryMappings = {
      'enrollment': ['03_newly_enrolled', '04_retested_positive', '05_newly_initiated'],
      'art': ['01_active_art_previous', '10_active_art_current', '05.2_art_with_tld'],
      'preart': ['02_active_pre_art_previous', '09_active_pre_art'],
      'outcomes': ['08.1_dead', '08.2_lost_to_followup', '08.3_transfer_out', '07_lost_and_return'],
      'quality': ['10.1_eligible_mmd', '10.2_mmd', '10.3_tld', '10.4_tpt_start', '10.5_tpt_complete'],
      'viral_load': ['10.6_eligible_vl_test', '10.7_vl_tested_12m', '10.8_vl_suppression'],
      'timing': ['05.1.1_art_same_day', '05.1.2_art_1_7_days', '05.1.3_art_over_7_days']
    };

    const indicatorIds = categoryMappings[category] || [];
    if (indicatorIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
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

    let results = [];

    if (siteCode) {
      // Site-specific category indicators
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      if (!siteInfo) {
        return res.status(404).json({
          success: false,
          error: 'Site not found'
        });
      }

      for (const indicatorId of indicatorIds) {
        try {
          const result = await siteOptimizedIndicators.executeSiteIndicator(
            siteCode,
            indicatorId,
            params,
            useCache === 'true'
          );
          results.push({
            indicatorId,
            data: result.data[0] || {},
            success: true,
            executionTime: result.executionTime
          });
        } catch (error) {
          console.error(`Error with ${indicatorId} for site ${siteCode}:`, error);
          results.push({
            indicatorId,
            data: {
              Indicator: indicatorId.replace(/^\d+\.?\d*_/, '').replace(/_/g, ' '),
              TOTAL: 0,
              Male_0_14: 0,
              Female_0_14: 0,
              Male_over_14: 0,
              Female_over_14: 0,
              error: error.message
            },
            success: false,
            executionTime: 0
          });
        }
      }

      res.json({
        success: true,
        data: results,
        site: siteInfo,
        category,
        period: params,
        timestamp: new Date().toISOString()
      });

    } else {
      // All sites aggregated category indicators
      const sites = await siteDatabaseManager.getAllSites();
      const siteResults = [];

      for (const site of sites) {
        const siteCategoryResults = [];
        
        for (const indicatorId of indicatorIds) {
          try {
            const result = await siteOptimizedIndicators.executeSiteIndicator(
              site.code,
              indicatorId,
              params,
              useCache === 'true'
            );
            siteCategoryResults.push({
              indicatorId,
              data: result.data[0] || {},
              success: true,
              executionTime: result.executionTime
            });
          } catch (error) {
            console.error(`Error with ${indicatorId} for site ${site.code}:`, error);
            siteCategoryResults.push({
              indicatorId,
              data: {
                Indicator: indicatorId.replace(/^\d+\.?\d*_/, '').replace(/_/g, ' '),
                TOTAL: 0,
                Male_0_14: 0,
                Female_0_14: 0,
                Male_over_14: 0,
                Female_over_14: 0,
                error: error.message
              },
              success: false,
              executionTime: 0
            });
          }
        }

        siteResults.push({
          site: {
            code: site.code,
            name: site.name,
            province: site.province,
            type: site.type
          },
          indicators: siteCategoryResults
        });
      }

      res.json({
        success: true,
        data: siteResults,
        category,
        period: params,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`Category indicators error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get specific indicator details (supports both site-specific and aggregated)
router.get('/:indicatorId/details', authenticateToken, async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { 
      startDate, 
      endDate, 
      previousEndDate, 
      siteCode, 
      page = 1, 
      limit = 50,
      searchTerm = '',
      ageGroup = '',
      gender = '',
      useCache = 'true' 
    } = req.query;
    
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

    if (siteCode) {
      // Site-specific indicator details
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      if (!siteInfo) {
        return res.status(404).json({
          success: false,
          error: 'Site not found'
        });
      }

      const result = await siteOptimizedIndicators.executeSiteIndicatorDetails(
        siteCode,
        indicatorId,
        params,
        parseInt(page),
        parseInt(limit)
      );

      // Apply additional filters if provided
      let filteredData = result.data;
      
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      if (ageGroup) {
        filteredData = filteredData.filter(item => {
          const age = parseInt(item.Age) || 0;
          switch (ageGroup) {
            case '0-14':
              return age >= 0 && age <= 14;
            case '15+':
              return age >= 15;
            default:
              return true;
          }
        });
      }

      if (gender) {
        filteredData = filteredData.filter(item => 
          item.Gender && item.Gender.toLowerCase() === gender.toLowerCase()
        );
      }

      res.json({
        success: true,
        data: filteredData,
        site: siteInfo,
        pagination: {
          ...result.pagination,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          filteredCount: filteredData.length
        },
        filters: {
          searchTerm,
          ageGroup,
          gender
        },
        period: params,
        timestamp: result.timestamp
      });

    } else {
      // All sites aggregated indicator details
      const sites = await siteDatabaseManager.getAllSites();
      const allSiteDetails = [];

      for (const site of sites) {
        try {
          const result = await siteOptimizedIndicators.executeSiteIndicatorDetails(
            site.code,
            indicatorId,
            params,
            1, // Get first page only for aggregation
            1000 // Large limit for aggregation
          );

          // Add site information to each record
          const siteDetails = result.data.map(item => ({
            ...item,
            SiteCode: site.code,
            SiteName: site.name,
            Province: site.province,
            SiteType: site.type
          }));

          allSiteDetails.push(...siteDetails);
        } catch (error) {
          console.error(`Error getting details for site ${site.code}:`, error);
        }
      }

      // Apply filters to aggregated data
      let filteredData = allSiteDetails;
      
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      if (ageGroup) {
        filteredData = filteredData.filter(item => {
          const age = parseInt(item.Age) || 0;
          switch (ageGroup) {
            case '0-14':
              return age >= 0 && age <= 14;
            case '15+':
              return age >= 15;
            default:
              return true;
          }
        });
      }

      if (gender) {
        filteredData = filteredData.filter(item => 
          item.Gender && item.Gender.toLowerCase() === gender.toLowerCase()
        );
      }

      // Paginate aggregated results
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedData = filteredData.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / parseInt(limit)),
          hasNext: endIndex < filteredData.length,
          hasPrev: parseInt(page) > 1,
          filteredCount: filteredData.length
        },
        filters: {
          searchTerm,
          ageGroup,
          gender
        },
        period: params,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`Indicator details error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get specific indicator (supports both site-specific and aggregated)
router.get('/:indicatorId', authenticateToken, async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, siteCode, useCache = 'true' } = req.query;
    
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

    if (siteCode) {
      // Site-specific indicator
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      if (!siteInfo) {
        return res.status(404).json({
          success: false,
          error: 'Site not found'
        });
      }

      const result = await siteOptimizedIndicators.executeSiteIndicator(
        siteCode,
        indicatorId,
        params,
        useCache === 'true'
      );

      res.json({
        success: true,
        data: result.data[0] || {},
        site: siteInfo,
        performance: {
          executionTime: result.executionTime
        },
        period: params,
        timestamp: result.timestamp
      });

    } else {
      // All sites aggregated indicator
      const sites = await siteDatabaseManager.getAllSites();
      const siteResults = [];

      for (const site of sites) {
        try {
          const result = await siteOptimizedIndicators.executeSiteIndicator(
            site.code,
            indicatorId,
            params,
            useCache === 'true'
          );
          
          siteResults.push({
            site: {
              code: site.code,
              name: site.name,
              province: site.province,
              type: site.type
            },
            data: result.data[0] || {},
            executionTime: result.executionTime
          });
        } catch (error) {
          console.error(`Error with ${indicatorId} for site ${site.code}:`, error);
          siteResults.push({
            site: {
              code: site.code,
              name: site.name,
              province: site.province,
              type: site.type
            },
            data: {
              Indicator: indicatorId.replace(/^\d+\.?\d*_/, '').replace(/_/g, ' '),
              TOTAL: 0,
              Male_0_14: 0,
              Female_0_14: 0,
              Male_over_14: 0,
              Female_over_14: 0,
              error: error.message
            },
            executionTime: 0
          });
        }
      }

      res.json({
        success: true,
        data: siteResults,
        period: params,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`Indicator ${req.params.indicatorId} error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

module.exports = router;
