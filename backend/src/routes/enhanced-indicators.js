const express = require('express');
const router = express.Router();
const enhancedIndicators = require('../services/enhancedIndicators');

// Get all indicators with enhanced features
router.get('/all', async (req, res) => {
  try {
    const { startDate, endDate, previousEndDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null
    };

    console.log('Enhanced indicators request:', params);
    
    const result = await enhancedIndicators.executeWithProgress('all', params, res);
    
    res.json({
      success: true,
      data: result || [],
      performance: {
        executionTime: 0,
        successCount: 0,
        errorCount: 0,
        averageTimePerIndicator: 0
      },
      period: params,
      errors: [],
      progress: {
        progress: 100,
        status: 'completed',
        message: 'Successfully processed indicators',
        details: ['Cache hit']
      }
    });
  } catch (error) {
    console.error('Enhanced indicators error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get specific indicator
router.get('/:indicatorId', async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      });
    }

    const params = {
      startDate,
      endDate,
      previousEndDate: previousEndDate || null
    };

    console.log(`Enhanced indicator request: ${indicatorId}`, params);
    
    const result = await enhancedIndicators.executeWithProgress(indicatorId, params, res);
    
    res.json({
      success: true,
      data: result || [],
      performance: {
        executionTime: 0,
        successCount: 1,
        errorCount: 0,
        averageTimePerIndicator: 0
      },
      period: params,
      errors: [],
      progress: {
        progress: 100,
        status: 'completed',
        message: `Successfully processed ${indicatorId}`,
        details: ['Cache hit']
      }
    });
  } catch (error) {
    console.error(`Enhanced indicator ${req.params.indicatorId} error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Get indicator details
router.get('/:indicatorId/details', async (req, res) => {
  try {
    const { indicatorId } = req.params;
    const { startDate, endDate, previousEndDate, page = 1, limit = 100 } = req.query;
    
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
      page: parseInt(page),
      limit: parseInt(limit)
    };

    console.log(`Enhanced indicator details request: ${indicatorId}`, params);
    
    const detailIndicatorId = `${indicatorId}_details`;
    const result = await enhancedIndicators.executeWithProgress(detailIndicatorId, params, res);

    res.json({
      success: true,
      data: result || [],
      pagination: {
        totalCount: result?.length || 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      period: params
    });
  } catch (error) {
    console.error(`Enhanced indicator details ${req.params.indicatorId} error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

module.exports = router;