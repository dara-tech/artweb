const { sequelize } = require('../config/database');
const { cache, cacheKeys } = require('./cache');
const fs = require('fs');
const path = require('path');

// Pre-load all SQL queries at startup for maximum performance
class OptimizedIndicators {
  constructor() {
    this.queries = new Map();
    this.loadAllQueries();
  }

  // Load all SQL queries into memory at startup
  loadAllQueries() {
    const queriesDir = path.join(__dirname, '../queries/indicators');
    
    // Only load aggregate queries for the main indicators endpoint
    const aggregateQueryFiles = [
      '01_active_art_previous.sql',
      '02_active_pre_art_previous.sql',
      '03_newly_enrolled.sql',
      '04_retested_positive.sql',
      '05_newly_initiated.sql',
      '05.1.1_art_same_day.sql',
      '05.1.2_art_1_7_days.sql',
      '05.1.3_art_over_7_days.sql',
      '05.2_art_with_tld.sql',
      '06_transfer_in.sql',
      '07_lost_and_return.sql',
      '08.1_dead.sql',
      '08.2_lost_to_followup.sql',
      '08.3_transfer_out.sql',
      '09_active_pre_art.sql',
      '10_active_art_current.sql',
      '10.1_eligible_mmd.sql',
      '10.2_mmd.sql',
      '10.3_tld.sql',
      '10.4_tpt_start.sql',
      '10.5_tpt_complete.sql',
      '10.6_eligible_vl_test.sql',
      '10.7_vl_tested_12m.sql',
      '10.8_vl_suppression.sql'
    ];
    
    // Load detail queries separately
    const detailQueryFiles = [
      '01_active_art_previous_details.sql',
      '02_active_pre_art_previous_details.sql',
      '03_newly_enrolled_details.sql',
      '04_retested_positive_details.sql',
      '05_newly_initiated_details.sql',
      '05.1.1_art_same_day_details.sql',
      '05.1.2_art_1_7_days_details.sql',
      '05.1.3_art_over_7_days_details.sql',
      '05.2_art_with_tld_details.sql',
      '06_transfer_in_details.sql',
      '07_lost_and_return_details.sql',
      '08.1_dead_details.sql',
      '08.2_lost_to_followup_details.sql',
      '08.3_transfer_out_details.sql',
      '09_active_pre_art_details.sql',
      '10_active_art_current_details.sql',
      '10.1_eligible_mmd_details.sql',
      '10.2_mmd_details.sql',
      '10.3_tld_details.sql',
      '10.4_tpt_start_details.sql',
      '10.5_tpt_complete_details.sql',
      '10.6_eligible_vl_test_details.sql',
      '10.7_vl_tested_12m_details.sql',
      '10.8_vl_suppression_details.sql'
    ];

    // Load aggregate queries
    this.loadQueries(aggregateQueryFiles, 'aggregate');
    
    // Load detail queries
    this.loadQueries(detailQueryFiles, 'detail');
  }

  loadQueries(files, type) {
    const queriesDir = path.join(__dirname, '../queries/indicators');
    
    files.forEach(filename => {
      const filePath = path.join(queriesDir, filename);
      if (fs.existsSync(filePath)) {
        const query = fs.readFileSync(filePath, 'utf8');
        const indicatorId = filename.replace('.sql', '');
        this.queries.set(indicatorId, query);
        console.log(`✅ Loaded: ${indicatorId}`);
      } else {
        console.warn(`⚠️  File not found: ${filename}`);
      }
    });

    console.log(`📊 Loaded ${this.queries.size} ${type} indicator queries into memory`);
  }



  // Execute single indicator with caching
  async executeIndicator(indicatorId, params, useCache = true) {
    const startTime = performance.now();
    
    // Check cache first
    if (useCache) {
      const cacheKey = cacheKeys.indicators(indicatorId, params.startDate, params.endDate, params.previousEndDate);
      const cachedResult = cache.get('medium', cacheKey);
      if (cachedResult) {
        console.log(`📦 Cache hit for ${indicatorId} (${(performance.now() - startTime).toFixed(2)}ms)`);
        return cachedResult;
      }
    }

    // Get the query
    const query = this.queries.get(indicatorId);
    if (!query) {
      throw new Error(`Indicator ${indicatorId} not found`);
    }

    try {
      // Execute the query
      const result = await sequelize.query(query, {
        replacements: {
          StartDate: params.startDate,
          EndDate: params.endDate,
          PreviousEndDate: params.previousEndDate,
          lost_code: 0,
          dead_code: 1,
          transfer_out_code: 3,
          transfer_in_code: 1,
          mmd_eligible_code: 0,
          mmd_drug_quantity: 60,
          vl_suppression_threshold: 1000,
          tld_regimen_formula: '3TC + DTG + TDF',
          tpt_start_code: 0,
          tpt_complete_code: 1
        },
        type: sequelize.QueryTypes.SELECT
      });

      const executionTime = performance.now() - startTime;
      console.log(`⚡ Executed ${indicatorId} in ${executionTime.toFixed(2)}ms`);

      // Cache the result
      if (useCache) {
        const cacheKey = cacheKeys.indicators(indicatorId, params.startDate, params.endDate, params.previousEndDate);
        cache.set('medium', cacheKey, result, 300000); // 5 minutes
      }

      return result;
    } catch (error) {
      console.error(`❌ Error executing ${indicatorId}:`, error.message);
      throw error;
    }
  }

  // Execute indicator and return detailed records with pagination and search
  async executeIndicatorDetails(indicatorId, params, useCache = true) {
    const startTime = performance.now();
    
    try {
      // Check cache first (only for non-paginated, non-search requests)
      if (useCache && params.page === 1 && !params.search) {
        const cacheKey = `indicator_details:${indicatorId}:${JSON.stringify({
          startDate: params.startDate,
          endDate: params.endDate,
          previousEndDate: params.previousEndDate
        })}`;
        const cached = cache.get('medium', cacheKey);
        if (cached) {
          console.log(`📦 Cache hit for ${indicatorId} details (${(performance.now() - startTime).toFixed(2)}ms)`);
          return this.processDetailsWithPagination(cached, params);
        }
      }

      // Try to get the details version of the query first
      const query = this.queries.get(`${indicatorId}_details`);
      if (!query) {
        // Fallback to regular query if details version doesn't exist
        const fallbackQuery = this.queries.get(indicatorId);
        if (!fallbackQuery) {
          throw new Error(`Indicator ${indicatorId} not found`);
        }
        // Use fallback query
        const result = await sequelize.query(fallbackQuery, {
          replacements: {
            StartDate: params.startDate,
            EndDate: params.endDate,
            PreviousEndDate: params.previousEndDate,
            SiteCode: params.siteCode || null,
            lost_code: 0,
            dead_code: 1,
            transfer_out_code: 3,
            transfer_in_code: 1,
            mmd_eligible_code: 0,
            mmd_drug_quantity: 60,
            vl_suppression_threshold: 1000,
            tld_regimen_formula: '3TC + DTG + TDF',
            tpt_start_code: 0,
            tpt_complete_code: 1
          },
          type: sequelize.QueryTypes.SELECT
        });
        const totalCount = countResult[0].total;
        
        // Use fallback query with pagination
        const fallbackResult = await sequelize.query(paginatedFallbackQuery, {
          replacements: {
            StartDate: params.startDate,
            EndDate: params.endDate,
            PreviousEndDate: params.previousEndDate,
            SiteCode: params.siteCode || null,
            lost_code: 0,
            dead_code: 1,
            transfer_out_code: 3,
            transfer_in_code: 1,
            mmd_eligible_code: 0,
            mmd_drug_quantity: 60,
            vl_suppression_threshold: 1000,
            tld_regimen_formula: '3TC + DTG + TDF',
            tpt_start_code: 0,
            tpt_complete_code: 1
          },
          type: sequelize.QueryTypes.SELECT
        });
        
        // Transform and filter the result
        const transformedResult = fallbackResult.map(record => ({
          ...record,
          site_code: record.site_code || record.clinicid
        }));
        
        let filteredResult = this.applyFilters(transformedResult, params);
        
        // Calculate pagination info
        const filteredCount = filteredResult.length;
        const totalPages = Math.ceil(totalCount / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        
        return {
          data: filteredResult,
          pagination: {
            page,
            limit,
            totalCount,
            filteredCount,
            totalPages,
            hasNext,
            hasPrev
          }
        };
      }

      // Add LIMIT and OFFSET to the query for database-level pagination
      const page = params.page || 1;
      const limit = Math.min(params.limit || 100, 100000); // Cap at 100k
      const offset = (page - 1) * limit;
      
      // Add pagination to the query (remove semicolon first if present)
      const cleanQuery = query.trim().replace(/;+$/, '');
      const paginatedQuery = `${cleanQuery} LIMIT ${limit} OFFSET ${offset}`;
      
      console.log(`🔍 Executing paginated query: LIMIT ${limit} OFFSET ${offset}`);
      console.log(`🔍 Query length: ${paginatedQuery.length} characters`);
      
      // Execute the paginated query to get detailed records
      const result = await sequelize.query(paginatedQuery, {
        replacements: {
          StartDate: params.startDate,
          EndDate: params.endDate,
          PreviousEndDate: params.previousEndDate,
          lost_code: 0,
          dead_code: 1,
          transfer_out_code: 3,
          transfer_in_code: 1,
          mmd_eligible_code: 0,
          mmd_drug_quantity: 60,
          vl_suppression_threshold: 1000,
          tld_regimen_formula: '3TC + DTG + TDF',
          tpt_start_code: 0,
          tpt_complete_code: 1
        },
        type: sequelize.QueryTypes.SELECT
      });
      
      // Get total count for pagination info
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as count_query`;
      const countResult = await sequelize.query(countQuery, {
        replacements: {
          StartDate: params.startDate,
          EndDate: params.endDate,
          PreviousEndDate: params.previousEndDate,
          lost_code: 0,
          dead_code: 1,
          transfer_out_code: 3,
          transfer_in_code: 1,
          mmd_eligible_code: 0,
          mmd_drug_quantity: 60,
          vl_suppression_threshold: 1000,
          tld_regimen_formula: '3TC + DTG + TDF',
          tpt_start_code: 0,
          tpt_complete_code: 1
        },
        type: sequelize.QueryTypes.SELECT
      });
      
      const totalCount = countResult[0].total;

      // Transform the result to add site_code column if it doesn't exist
      const transformedResult = result.map(record => {
        // If site_code doesn't exist, use clinicid as site_code
        if (!record.site_code && record.clinicid) {
          return {
            ...record,
            site_code: record.clinicid // Use clinicid as site_code
          };
        }
        return record;
      });

      // Debug: Log sample records to understand data structure
      if (transformedResult.length > 0) {
        console.log(`🔍 Sample record structure:`, {
          sex: transformedResult[0].sex,
          sex_display: transformedResult[0].sex_display,
          typepatients: transformedResult[0].typepatients,
          age: transformedResult[0].age,
          clinicid: transformedResult[0].clinicid
        });
      }

      console.log(`📊 Total records in database: ${totalCount}`);
      console.log(`📊 Records fetched: ${transformedResult.length}`);
      
      // Apply filtering to the fetched records
      let filteredResult = this.applyFilters(transformedResult, params);
      
      // Calculate pagination info
      const filteredCount = filteredResult.length;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      
      const executionTime = performance.now() - startTime;
      
      console.log(`✅ Indicator ${indicatorId} details executed successfully:`, {
        totalRecords: totalCount,
        fetchedRecords: transformedResult.length,
        filteredRecords: filteredCount,
        page: page,
        limit: limit,
        executionTime: `${executionTime.toFixed(2)}ms`
      });
      
      return {
        data: filteredResult,
        pagination: {
          page,
          limit,
          totalCount,
          filteredCount,
          totalPages,
          hasNext,
          hasPrev
        },
        executionTime
      };
    } catch (error) {
      console.error(`❌ Error executing ${indicatorId} details:`, error.message);
      console.error(`❌ Error stack:`, error.stack);
      console.error(`❌ Query that failed:`, paginatedQuery.substring(0, 500) + '...');
      throw error;
    }
  }

  // Apply filters to data (gender, age group)
  applyFilters(data, params) {
    let filteredData = [...data];

    console.log(`🔍 Starting with ${data.length} records for filtering`);

    // Apply gender filter if provided
    if (params.gender) {
      console.log(`🔍 Filtering by gender: ${params.gender}`);
      const beforeCount = filteredData.length;
      
      filteredData = filteredData.filter(record => {
        // Check both sex field (0/1) and sex_display field
        const isMale = record.sex === 1 || record.sex_display === 'Male' || record.sex_display === 'male';
        const isFemale = record.sex === 0 || record.sex_display === 'Female' || record.sex_display === 'female';
        
        if (params.gender === 'male') {
          return isMale;
        } else if (params.gender === 'female') {
          return isFemale;
        }
        return true;
      });
      
      console.log(`  Gender filter: ${beforeCount} -> ${filteredData.length} records`);
    }

    // Apply age group filter if provided
    if (params.ageGroup) {
      console.log(`🔍 Filtering by age group: ${params.ageGroup}`);
      const beforeCount = filteredData.length;
      
      filteredData = filteredData.filter(record => {
        // Use typepatients field to match aggregate query logic
        const typepatients = record.typepatients;
        let correctAgeGroup = '15+';
        
        // Map typepatients field to age groups
        if (typepatients === '≤14') {
          correctAgeGroup = '0-14';
        } else if (typepatients === '15+') {
          correctAgeGroup = '15+';
        } else {
          // Fallback to actual age calculation if typepatients is not available
          const age = parseInt(record.age) || 0;
          if (age >= 0 && age <= 14) {
            correctAgeGroup = '0-14';
          } else if (age > 14) {
            correctAgeGroup = '15+';
          }
        }
        
        if (params.ageGroup === '0-14') {
          return correctAgeGroup === '0-14';
        } else if (params.ageGroup === '15+' || params.ageGroup === '>14') {
          return correctAgeGroup === '15+';
        }
        return true;
      });
      
      console.log(`  Age group filter: ${beforeCount} -> ${filteredData.length} records`);
    }

    console.log(`🔍 Final filtered data count: ${filteredData.length}`);
    return filteredData;
  }

  // Process detailed records with pagination and search only
  processDetailsWithPagination(data, params, originalTotalCount = null) {
    let filteredData = [...data];

    // Apply search filter if search term is provided
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.toLowerCase().trim();
      filteredData = filteredData.filter(record => {
        // Search across common fields
        const searchableFields = [
          record.clinicid,
          record.sex_display,
          record.patient_type,
          record.transfer_status
        ].filter(field => field !== null && field !== undefined);
        
        return searchableFields.some(field => 
          field.toString().toLowerCase().includes(searchTerm)
        );
      });
    }

    // Calculate pagination
    const page = params.page || 1;
    const limit = params.limit || 100;
    // Use original total count if provided, otherwise use filtered data length
    const totalCount = originalTotalCount !== null ? originalTotalCount : filteredData.length;
    const filteredCount = filteredData.length;
    const totalPages = Math.ceil(filteredCount / limit);
    const offset = (page - 1) * limit;
    
    // Get the page of data
    const paginatedData = filteredData.slice(offset, offset + limit);

    console.log(`📊 Pagination: Total=${totalCount}, Filtered=${filteredCount}, Page=${page}, Limit=${limit}, Showing=${paginatedData.length}`);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalCount, // This is the original total count before filtering
        filteredCount, // This is the count after filtering
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  // Execute all indicators in parallel with caching and batching
  async executeAllIndicators(params, useCache = true) {
    const startTime = performance.now();
    console.log('🚀 Starting parallel execution of all indicators...');

    // Get only aggregate indicator IDs (exclude detail queries)
    const aggregateIndicatorIds = Array.from(this.queries.keys()).filter(id => !id.includes('_details'));
    
    // Separate fast and slow queries for better batching
    const fastQueries = aggregateIndicatorIds.filter(id => 
      !id.includes('vl') && !id.includes('10.6') && !id.includes('10.7') && !id.includes('10.8')
    );
    const slowQueries = aggregateIndicatorIds.filter(id => 
      id.includes('vl') || id.includes('10.6') || id.includes('10.7') || id.includes('10.8')
    );

    // Execute fast queries first (batch of 8)
    const fastPromises = fastQueries.map(async (indicatorId) => {
      try {
        const result = await this.executeIndicator(indicatorId, params, useCache);
        return {
          indicatorId,
          data: result[0] || {},
          success: true
        };
      } catch (error) {
        console.error(`❌ Error with ${indicatorId}:`, error.message);
        return {
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
          success: false
        };
      }
    });

    // Execute slow queries in smaller batches (batch of 2)
    const slowPromises = slowQueries.map(async (indicatorId) => {
      try {
        const result = await this.executeIndicator(indicatorId, params, useCache);
        return {
          indicatorId,
          data: result[0] || {},
          success: true
        };
      } catch (error) {
        console.error(`❌ Error with ${indicatorId}:`, error.message);
        return {
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
          success: false
        };
      }
    });

    // Execute all promises in parallel
    const allPromises = [...fastPromises, ...slowPromises];
    const results = await Promise.all(allPromises);

    const executionTime = performance.now() - startTime;
    console.log(`🎯 All indicators completed in ${executionTime.toFixed(2)}ms`);

    // Log detailed results for comparison
    console.log('\n🔍 BACKEND INDICATOR RESULTS ANALYSIS');
    console.log('======================================');
    console.log('📊 Total indicators processed:', results.length);
    console.log('✅ Successful indicators:', results.filter(r => r.success).length);
    console.log('❌ Failed indicators:', results.filter(r => !r.success).length);
    
    // Log each indicator result
    console.log('\n🔍 DETAILED BACKEND INDICATOR BREAKDOWN:');
    results.forEach((result, index) => {
      console.log(`\n📊 Backend Indicator ${index + 1}:`, {
        indicatorId: result.indicatorId,
        success: result.success,
        data: result.data,
        error: result.success ? 'none' : 'failed'
      });
    });

    const finalResults = results.map(r => r.data);
    
    console.log('\n🎯 FINAL BACKEND RESULTS SUMMARY:');
    console.log('==================================');
    console.log('📊 Final results array length:', finalResults.length);
    console.log('📋 Sample result (first indicator):', finalResults[0]);
    
    return {
      results: finalResults,
      executionTime,
      successCount: results.filter(r => r.success).length,
      errorCount: results.filter(r => !r.success).length
    };
  }
}

// Create singleton instance
const optimizedIndicators = new OptimizedIndicators();

module.exports = optimizedIndicators;
