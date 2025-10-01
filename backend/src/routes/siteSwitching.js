const express = require('express');
const siteSwitchingService = require('../services/siteSwitchingService');
const { siteMiddleware } = require('../middleware/siteMiddleware');

const router = express.Router();

/**
 * Get all available sites
 */
router.get('/sites', async (req, res, next) => {
  try {
    const sites = await siteSwitchingService.getAvailableSites();
    res.json({
      success: true,
      sites,
      count: sites.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Switch to a specific site
 * Supports both site codes (0201) and site names (Maung Russey RH)
 */
router.post('/switch', async (req, res, next) => {
  try {
    const { site } = req.body;
    
    if (!site) {
      return res.status(400).json({
        success: false,
        error: 'Site parameter required',
        message: 'Please provide a site code or site name'
      });
    }

    // Validate site first
    const validation = await siteSwitchingService.validateSite(site);
    if (!validation.valid) {
      return res.status(404).json({
        success: false,
        error: validation.error,
        availableSites: await siteSwitchingService.getAvailableSites()
      });
    }

    // Switch to the site
    const siteInfo = await siteSwitchingService.switchToSite(site);
    
    res.json({
      success: true,
      message: `Switched to site: ${siteInfo.name} (${siteInfo.code})`,
      currentSite: {
        code: siteInfo.code,
        name: siteInfo.name,
        database: siteInfo.info.database_name
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current site information
 */
router.get('/current', async (req, res, next) => {
  try {
    const currentSite = await siteSwitchingService.getCurrentSiteOrDefault();
    
    res.json({
      success: true,
      currentSite: {
        code: currentSite.code,
        name: currentSite.name,
        database: currentSite.info.database_name,
        province: currentSite.info.province
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Validate a site without switching
 */
router.post('/validate', async (req, res, next) => {
  try {
    const { site } = req.body;
    
    if (!site) {
      return res.status(400).json({
        success: false,
        error: 'Site parameter required'
      });
    }

    const validation = await siteSwitchingService.validateSite(site);
    
    res.json({
      success: validation.valid,
      valid: validation.valid,
      siteCode: validation.siteCode,
      siteName: validation.siteName,
      error: validation.error
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get site-specific data
 * Example: /api/site-switching/data/patients?type=adult&page=1&limit=10
 */
router.get('/data/:dataType', async (req, res, next) => {
  try {
    const { dataType } = req.params;
    const options = {
      ...req.query
    };

    // Get current site or use default
    const currentSite = await siteSwitchingService.getCurrentSiteOrDefault();
    
    const data = await siteSwitchingService.getSiteData(dataType, options);
    
    res.json({
      success: true,
      dataType,
      siteCode: currentSite.code,
      siteName: currentSite.name,
      data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get site-specific lookups
 * Example: /api/site-switching/lookups/drugs
 */
router.get('/lookups/:lookupType', siteMiddleware({ required: true }), async (req, res, next) => {
  try {
    const { lookupType } = req.params;
    const options = { lookupType };

    const data = await siteSwitchingService.getSiteData('lookups', options);
    
    res.json({
      success: true,
      lookupType,
      siteCode: req.siteCode,
      siteName: req.siteName,
      data
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
