const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Patient, AdultPatient, ChildPatient, InfantPatient, PatientVisit, PatientTest, PatientStatus } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all patients with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['adult', 'child', 'infant']).withMessage('Type must be adult, child, or infant'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { type, search } = req.query;

    // Build where clause
    const whereClause = {};
    if (type) {
      whereClause.patientType = type;
    }
    if (search) {
      whereClause[Op.or] = [
        { clinicId: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: patients } = await Patient.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['dateFirstVisit', 'DESC']]
      // Temporarily removed associations until models are properly configured
    });

    res.json({
      patients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get patient by ID
router.get('/:clinicId', async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const patient = await Patient.findOne({
      where: { clinicId },
      include: [
        {
          model: AdultPatient,
          as: 'adultDetails',
          required: false
        },
        {
          model: ChildPatient,
          as: 'childDetails',
          required: false
        },
        {
          model: InfantPatient,
          as: 'infantDetails',
          required: false
        },
        {
          model: PatientVisit,
          as: 'visits',
          limit: 10,
          order: [['visitDate', 'DESC']]
        },
        {
          model: PatientTest,
          as: 'tests',
          limit: 10,
          order: [['testDate', 'DESC']]
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Patient Not Found',
        message: `Patient with ID ${clinicId} not found`
      });
    }

    res.json({ patient });

  } catch (error) {
    next(error);
  }
});

// Create new adult patient
router.post('/adult', [
  requireRole(['admin', 'doctor', 'nurse']),
  body('clinicId').isLength({ min: 6, max: 10 }).withMessage('Clinic ID must be 6-10 characters'),
  body('dateFirstVisit').isISO8601().withMessage('Date first visit must be a valid date'),
  body('dateOfBirth').isISO8601().withMessage('Date of birth must be a valid date'),
  body('sex').isIn([0, 1]).withMessage('Sex must be 0 (Female) or 1 (Male)')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const patientData = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findByPk(patientData.clinicId);
    if (existingPatient) {
      return res.status(409).json({
        error: 'Patient Exists',
        message: `Patient with ID ${patientData.clinicId} already exists`
      });
    }

    // Create patient record
    const patient = await Patient.create({
      clinicId: patientData.clinicId,
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      dateOfBirth: patientData.dateOfBirth,
      sex: patientData.sex,
      dateFirstVisit: patientData.dateFirstVisit,
      patientType: 'adult'
    });

    // Create adult-specific details
    const adultDetails = await AdultPatient.create({
      clinicId: patientData.clinicId,
      ...patientData
    });

    res.status(201).json({
      message: 'Adult patient created successfully',
      patient: {
        ...patient.toJSON(),
        adultDetails
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update patient
router.put('/:clinicId', [
  requireRole(['admin', 'doctor', 'nurse']),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('sex').optional().isIn([0, 1]).withMessage('Sex must be 0 (Female) or 1 (Male)')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { clinicId } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByPk(clinicId);
    if (!patient) {
      return res.status(404).json({
        error: 'Patient Not Found',
        message: `Patient with ID ${clinicId} not found`
      });
    }

    // Update patient basic info
    await patient.update(updateData);

    // Update type-specific details if provided
    if (patient.patientType === 'adult' && updateData.adultDetails) {
      const adultDetails = await AdultPatient.findByPk(clinicId);
      if (adultDetails) {
        await adultDetails.update(updateData.adultDetails);
      }
    }

    res.json({
      message: 'Patient updated successfully',
      patient
    });

  } catch (error) {
    next(error);
  }
});

// Delete patient (soft delete)
router.delete('/:clinicId', [
  requireRole(['admin'])
], async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const patient = await Patient.findByPk(clinicId);
    if (!patient) {
      return res.status(404).json({
        error: 'Patient Not Found',
        message: `Patient with ID ${clinicId} not found`
      });
    }

    // Soft delete by setting status to 0
    await patient.update({ status: 0 });

    res.json({
      message: 'Patient deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
