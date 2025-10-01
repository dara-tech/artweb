const { siteDatabaseManager } = require('../config/siteDatabase');

/**
 * Middleware to handle site switching and validation
 * Supports both site codes (0201) and site names (Maung Russey RH)
 */
const siteMiddleware = (options = {}) => {
  return async (req, res, next) => {
    try {
      // Get site parameter from query, body, or headers
      const siteParam = req.query.site || req.body.site || req.headers['x-site-code'];
      
      if (!siteParam) {
        // If no site specified, use default or return error
        if (options.required) {
          return res.status(400).json({
            error: 'Site parameter required',
            message: 'Please specify a site code or site name',
            availableSites: await getAvailableSites()
          });
        }
        
        // Use default site
        req.siteCode = options.defaultSite || '0201';
        req.siteName = await getSiteName(req.siteCode);
        return next();
      }

      // Determine if it's a site code or site name
      let siteCode, siteName;
      
      if (isSiteCode(siteParam)) {
        // It's a site code (e.g., '0201')
        siteCode = siteParam;
        siteName = await getSiteName(siteCode);
      } else {
        // It's a site name (e.g., 'Maung Russey RH')
        siteName = siteParam;
        siteCode = await getSiteCode(siteName);
      }

      // Validate site exists and is active
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      if (!siteInfo) {
        return res.status(404).json({
          error: 'Site not found',
          message: `Site '${siteParam}' not found or inactive`,
          availableSites: await getAvailableSites()
        });
      }

      // Set site information in request
      req.siteCode = siteCode;
      req.siteName = siteInfo.name;
      req.siteInfo = siteInfo;

      next();
    } catch (error) {
      console.error('Site middleware error:', error);
      res.status(500).json({
        error: 'Site validation failed',
        message: error.message
      });
    }
  };
};

/**
 * Check if the parameter looks like a site code (4 digits)
 */
function isSiteCode(param) {
  return /^\d{4}$/.test(param);
}

/**
 * Get site name from site code
 */
async function getSiteName(siteCode) {
  try {
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    return siteInfo ? siteInfo.name : null;
  } catch (error) {
    console.error('Error getting site name:', error);
    return null;
  }
}

/**
 * Get site code from site name
 */
async function getSiteCode(siteName) {
  try {
    const sites = await siteDatabaseManager.getAllSites();
    const site = sites.find(s => 
      s.name.toLowerCase() === siteName.toLowerCase() ||
      s.name.toLowerCase().includes(siteName.toLowerCase())
    );
    return site ? site.code : null;
  } catch (error) {
    console.error('Error getting site code:', error);
    return null;
  }
}

/**
 * Get list of available sites
 */
async function getAvailableSites() {
  try {
    const sites = await siteDatabaseManager.getAllSites();
    return sites.map(site => ({
      code: site.code,
      name: site.name,
      database: site.database_name
    }));
  } catch (error) {
    console.error('Error getting available sites:', error);
    return [];
  }
}

module.exports = {
  siteMiddleware,
  getAvailableSites,
  getSiteName,
  getSiteCode
};
