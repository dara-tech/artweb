const express = require('express');
const { AdultArvDrug, sequelize } = require('../models');
const router = express.Router();

// Test endpoint to check table structure
router.get('/test-arv-table', async (req, res) => {
  try {
    const [results] = await sequelize.query("DESCRIBE tblavarvdrug");
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error checking table structure:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking table structure',
      error: error.message
    });
  }
});

// Get ARV drugs for a specific visit
router.get('/visits/:visitId/arv-drugs', async (req, res) => {
  try {
    const { visitId } = req.params;
    
    const arvDrugs = await AdultArvDrug.findAll({
      where: { visitId }
    });
    
    res.json({
      success: true,
      data: arvDrugs
    });
  } catch (error) {
    console.error('Error fetching ARV drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ARV drugs',
      error: error.message
    });
  }
});

// Create ARV drug for a visit
router.post('/visits/:visitId/arv-drugs', async (req, res) => {
  try {
    const { visitId } = req.params;
    const { drugName, dose, quantity, frequency, form, status, date, reason, remarks } = req.body;
    
    const arvDrug = await AdultArvDrug.create({
      drugName,
      dose,
      quantity,
      frequency,
      form,
      status,
      date,
      reason,
      remarks,
      visitId
    });
    
    res.status(201).json({
      success: true,
      data: arvDrug
    });
  } catch (error) {
    console.error('Error creating ARV drug:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ARV drug',
      error: error.message
    });
  }
});

// Update ARV drug (using visitId and drugName as composite key)
router.put('/visits/:visitId/arv-drugs/:drugName', async (req, res) => {
  try {
    const { visitId, drugName } = req.params;
    const { dose, quantity, frequency, form, status, date, reason, remarks } = req.body;
    
    const arvDrug = await AdultArvDrug.findOne({
      where: { visitId, drugName }
    });
    if (!arvDrug) {
      return res.status(404).json({
        success: false,
        message: 'ARV drug not found'
      });
    }
    
    await arvDrug.update({
      dose,
      quantity,
      frequency,
      form,
      status,
      date,
      reason,
      remarks
    });
    
    res.json({
      success: true,
      data: arvDrug
    });
  } catch (error) {
    console.error('Error updating ARV drug:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ARV drug',
      error: error.message
    });
  }
});

// Delete ARV drug (using visitId and drugName as composite key)
router.delete('/visits/:visitId/arv-drugs/:drugName', async (req, res) => {
  try {
    const { visitId, drugName } = req.params;
    
    const arvDrug = await AdultArvDrug.findOne({
      where: { visitId, drugName }
    });
    if (!arvDrug) {
      return res.status(404).json({
        success: false,
        message: 'ARV drug not found'
      });
    }
    
    await arvDrug.destroy();
    
    res.json({
      success: true,
      message: 'ARV drug deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ARV drug:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ARV drug',
      error: error.message
    });
  }
});

// Delete all ARV drugs for a visit
router.delete('/visits/:visitId/arv-drugs', async (req, res) => {
  try {
    const { visitId } = req.params;
    
    await AdultArvDrug.destroy({
      where: { visitId }
    });
    
    res.json({
      success: true,
      message: 'All ARV drugs deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ARV drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ARV drugs',
      error: error.message
    });
  }
});

module.exports = router;
