const express = require('express');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');
const router = express.Router();

// Helper function to execute SQL query
const executeQuery = async (query, variables = {}) => {
  try {
    const results = await sequelize.query(query, {
      replacements: variables,
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to load SQL file
const loadSqlFile = (filename) => {
  const filePath = path.join(__dirname, '../queries/indicators', filename);
  return fs.readFileSync(filePath, 'utf8');
};

// Helper function to set variables and execute query
const executeIndicatorQuery = async (indicatorFile, startDate, endDate, previousEndDate) => {
  try {
    // Load indicator query
    const indicatorQuery = loadSqlFile(indicatorFile);
    
    // Set variables using replacements
    const variables = {
      StartDate: startDate || '2025-01-01',
      EndDate: endDate || '2025-03-31',
      PreviousEndDate: previousEndDate || '2024-12-31',
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
    
    return await executeQuery(indicatorQuery, variables);
  } catch (error) {
    console.error(`Error executing ${indicatorFile}:`, error);
    throw error;
  }
};

// Get all indicators
router.get('/all', async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate } = req.query;
    
    const indicators = [
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

    const results = [];
    
    for (const indicator of indicators) {
      try {
        const data = await executeIndicatorQuery(indicator, startDate, endDate, previousEndDate);
        if (data && data.length > 0) {
          results.push(data[0]);
        }
      } catch (error) {
        console.error(`Error with ${indicator}:`, error);
        // Continue with other indicators even if one fails
        results.push({
          Indicator: indicator.replace('.sql', '').replace(/^\d+\.?\d*_/, '').replace(/_/g, ' '),
          TOTAL: 0,
          Male_0_14: 0,
          Female_0_14: 0,
          Male_over_14: 0,
          Female_over_14: 0,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      period: {
        startDate: startDate || '2025-01-01',
        endDate: endDate || '2025-03-31',
        previousEndDate: previousEndDate || '2024-12-31'
      }
    });
  } catch (error) {
    console.error('Error fetching all indicators:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicators',
      message: error.message
    });
  }
});

// Get specific indicator
router.get('/:indicatorId', async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate } = req.query;
    
    // Map old indicator IDs to new file names
    const indicatorMap = {
      '1': '01_active_art_previous.sql',
      '2': '02_active_pre_art_previous.sql',
      '3': '03_newly_enrolled.sql',
      '4': '04_retested_positive.sql',
      '5': '05_newly_initiated.sql',
      '5.1.1': '05.1.1_art_same_day.sql',
      '5.1.2': '05.1.2_art_1_7_days.sql',
      '5.1.3': '05.1.3_art_over_7_days.sql',
      '5.2': '05.2_art_with_tld.sql',
      '6': '06_transfer_in.sql',
      '7': '07_lost_and_return.sql',
      '8.1': '08.1_dead.sql',
      '8.2': '08.2_lost_to_followup.sql',
      '8.3': '08.3_transfer_out.sql',
      '9': '09_active_pre_art.sql',
      '10': '10_active_art_current.sql',
      '10.1': '10.1_eligible_mmd.sql',
      '10.2': '10.2_mmd.sql',
      '10.3': '10.3_tld.sql',
      '10.4': '10.4_tpt_start.sql',
      '10.5': '10.5_tpt_complete.sql',
      '10.6': '10.6_eligible_vl_test.sql',
      '10.7': '10.7_vl_tested_12m.sql',
      '10.8': '10.8_vl_suppression.sql'
    };
    
    const indicatorFile = indicatorMap[indicatorId] || `indicator${indicatorId}.sql`;
    const data = await executeIndicatorQuery(indicatorFile, startDate, endDate, previousEndDate);
    
    res.json({
      success: true,
      data: data[0] || {},
      period: {
        startDate: startDate || '2025-01-01',
        endDate: endDate || '2025-03-31',
        previousEndDate: previousEndDate || '2024-12-31'
      }
    });
  } catch (error) {
    console.error(`Error fetching indicator ${req.params.indicatorId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicator',
      message: error.message
    });
  }
});

// Get indicators by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { startDate, endDate, previousEndDate } = req.query;
    
    let indicators = [];
    
    switch (category) {
      case 'enrollment':
        indicators = ['03_newly_enrolled.sql', '05_newly_initiated.sql', '05.1.1_art_same_day.sql', '05.1.2_art_1_7_days.sql', '05.1.3_art_over_7_days.sql', '05.2_art_with_tld.sql', '06_transfer_in.sql'];
        break;
      case 'retention':
        indicators = ['01_active_art_previous.sql', '10_active_art_current.sql', '07_lost_and_return.sql'];
        break;
      case 'outcomes':
        indicators = ['08.1_dead.sql', '08.2_lost_to_followup.sql', '08.3_transfer_out.sql'];
        break;
      case 'treatment':
        indicators = ['10.1_eligible_mmd.sql', '10.2_mmd.sql', '10.3_tld.sql', '10.4_tpt_start.sql', '10.5_tpt_complete.sql'];
        break;
      case 'viral-load':
        indicators = ['10.6_eligible_vl_test.sql', '10.7_vl_tested_12m.sql', '10.8_vl_suppression.sql'];
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid category. Valid categories: enrollment, retention, outcomes, treatment, viral-load'
        });
    }

    const results = [];
    
    for (const indicator of indicators) {
      try {
        const data = await executeIndicatorQuery(indicator, startDate, endDate, previousEndDate);
        if (data && data.length > 0) {
          results.push(data[0]);
        }
      } catch (error) {
        console.error(`Error with ${indicator}:`, error);
        results.push({
          Indicator: indicator.replace('.sql', ''),
          TOTAL: 0,
          Male_0_14: 0,
          Female_0_14: 0,
          Male_over_14: 0,
          Female_over_14: 0,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      category,
      period: {
        startDate: startDate || '2025-01-01',
        endDate: endDate || '2025-03-31',
        previousEndDate: previousEndDate || '2024-12-31'
      }
    });
  } catch (error) {
    console.error(`Error fetching indicators for category ${req.params.category}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicators by category',
      message: error.message
    });
  }
});

// Get summary statistics
router.get('/summary/stats', async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate } = req.query;
    
    // Get key indicators for summary
    const keyIndicators = [
      '01_active_art_previous.sql',   // Active ART patients previous quarter
      '03_newly_enrolled.sql',   // Newly enrolled
      '05_newly_initiated.sql',   // Newly initiated
      '10_active_art_current.sql',  // Active ART patients this quarter
      '10.8_vl_suppression.sql' // VL suppressed
    ];

    const results = {};
    
    for (const indicator of keyIndicators) {
      try {
        const data = await executeIndicatorQuery(indicator, startDate, endDate, previousEndDate);
        if (data && data.length > 0) {
          const indicatorName = data[0].Indicator;
          results[indicatorName] = {
            total: data[0].TOTAL,
            male_0_14: data[0].Male_0_14,
            female_0_14: data[0].Female_0_14,
            male_over_14: data[0].Male_over_14,
            female_over_14: data[0].Female_over_14
          };
        }
      } catch (error) {
        console.error(`Error with ${indicator}:`, error);
      }
    }

    res.json({
      success: true,
      data: results,
      period: {
        startDate: startDate || '2025-01-01',
        endDate: endDate || '2025-03-31',
        previousEndDate: previousEndDate || '2024-12-31'
      }
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary statistics',
      message: error.message
    });
  }
});

module.exports = router;
