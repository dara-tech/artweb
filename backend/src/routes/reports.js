const express = require('express');
const { query, validationResult } = require('express-validator');
const { Patient, AdultPatient, ChildPatient, InfantPatient, PatientVisit, PatientTest, PatientStatus } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get patient statistics
router.get('/statistics', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.dateFirstVisit = {};
      if (startDate) dateFilter.dateFirstVisit[Op.gte] = startDate;
      if (endDate) dateFilter.dateFirstVisit[Op.lte] = endDate;
    }

    // Get patient counts by type
    const [adultCount, childCount, infantCount, totalCount] = await Promise.all([
      Patient.count({ where: { ...dateFilter, patientType: 'adult' } }),
      Patient.count({ where: { ...dateFilter, patientType: 'child' } }),
      Patient.count({ where: { ...dateFilter, patientType: 'infant' } }),
      Patient.count({ where: dateFilter })
    ]);

    // Get patients by sex
    const [maleCount, femaleCount] = await Promise.all([
      Patient.count({ where: { ...dateFilter, sex: 1 } }),
      Patient.count({ where: { ...dateFilter, sex: 0 } })
    ]);

    // Get active vs inactive patients
    const [activeCount, inactiveCount] = await Promise.all([
      Patient.count({ where: { ...dateFilter, status: 1 } }),
      Patient.count({ where: { ...dateFilter, status: 0 } })
    ]);

    res.json({
      statistics: {
        totalPatients: totalCount,
        byType: {
          adult: adultCount,
          child: childCount,
          infant: infantCount
        },
        bySex: {
          male: maleCount,
          female: femaleCount
        },
        byStatus: {
          active: activeCount,
          inactive: inactiveCount
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get patient list for reports
router.get('/patients', [
  query('type').optional().isIn(['adult', 'child', 'infant']).withMessage('Type must be adult, child, or infant'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { type, startDate, endDate, status } = req.query;
    
    // Build where clause
    const whereClause = {};
    
    if (type) whereClause.patientType = type;
    if (status) whereClause.status = status === 'active' ? 1 : 0;
    
    if (startDate || endDate) {
      whereClause.dateFirstVisit = {};
      if (startDate) whereClause.dateFirstVisit[Op.gte] = startDate;
      if (endDate) whereClause.dateFirstVisit[Op.lte] = endDate;
    }

    const patients = await Patient.findAll({
      where: whereClause,
      order: [['dateFirstVisit', 'DESC']]
      // Temporarily removed associations until models are properly configured
    });

    res.json({ patients });

  } catch (error) {
    next(error);
  }
});

// Get visit statistics
router.get('/visits', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.visitDate = {};
      if (startDate) dateFilter.visitDate[Op.gte] = startDate;
      if (endDate) dateFilter.visitDate[Op.lte] = endDate;
    }

    const visits = await PatientVisit.findAll({
      where: dateFilter,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['clinicId', 'patientType', 'sex']
        }
      ],
      order: [['visitDate', 'DESC']]
    });

    res.json({ visits });

  } catch (error) {
    next(error);
  }
});

// Get test statistics
router.get('/tests', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid'),
  query('testType').optional().isIn(['hiv', 'cd4', 'viral_load', 'tb', 'other']).withMessage('Invalid test type')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate, testType } = req.query;
    
    // Build where clause
    const whereClause = {};
    
    if (testType) whereClause.testType = testType;
    
    if (startDate || endDate) {
      whereClause.testDate = {};
      if (startDate) whereClause.testDate[Op.gte] = startDate;
      if (endDate) whereClause.testDate[Op.lte] = endDate;
    }

    const tests = await PatientTest.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['clinicId', 'patientType', 'sex']
        }
      ],
      order: [['testDate', 'DESC']]
    });

    res.json({ tests });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
