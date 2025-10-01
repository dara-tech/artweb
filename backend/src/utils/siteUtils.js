const { siteDatabaseManager } = require('../config/siteDatabase');

/**
 * Convert site name to site code if needed
 * @param {string} site - Site name or code
 * @returns {Promise<{siteCode: string, siteName: string, displayName: string}>}
 */
async function resolveSite(site) {
  if (!site) {
    return { siteCode: '0201', siteName: 'Maung Ruessei Referral Hospital', displayName: 'Maung Russey RH' }; // Default
  }

  // Decode URL encoding
  const decodedSite = decodeURIComponent(site);

  // If it's already a site code (4 digits), return as is
  if (/^\d{4}$/.test(decodedSite)) {
    const sites = await siteDatabaseManager.getAllSites();
    const foundSite = sites.find(s => s.code === decodedSite);
    return {
      siteCode: decodedSite,
      siteName: foundSite ? foundSite.name : decodedSite,
      displayName: foundSite ? (foundSite.display_name || foundSite.short_name || foundSite.name) : decodedSite
    };
  }

  // It's a site name, convert to code using improved matching
  const sites = await siteDatabaseManager.getAllSites();
  const searchTerm = decodedSite.toLowerCase().trim();
  
  // Try multiple matching strategies
  let foundSite = null;
  
  // 1. Exact match on display_name
  foundSite = sites.find(s => 
    s.display_name && s.display_name.toLowerCase() === searchTerm
  );
  
  // 2. Exact match on short_name
  if (!foundSite) {
    foundSite = sites.find(s => 
      s.short_name && s.short_name.toLowerCase() === searchTerm
    );
  }
  
  // 3. Exact match on name
  if (!foundSite) {
    foundSite = sites.find(s => 
      s.name && s.name.toLowerCase() === searchTerm
    );
  }
  
  // 4. Partial match on search_terms
  if (!foundSite) {
    foundSite = sites.find(s => 
      s.search_terms && s.search_terms.toLowerCase().includes(searchTerm)
    );
  }
  
  // 5. Contains match on any name field
  if (!foundSite) {
    foundSite = sites.find(s => 
      (s.name && s.name.toLowerCase().includes(searchTerm)) ||
      (s.short_name && s.short_name.toLowerCase().includes(searchTerm)) ||
      (s.display_name && s.display_name.toLowerCase().includes(searchTerm))
    );
  }

  if (!foundSite) {
    throw new Error(`Site '${site}' not found or inactive`);
  }

  return {
    siteCode: foundSite.code,
    siteName: foundSite.name,
    displayName: foundSite.display_name || foundSite.short_name || foundSite.name
  };
}

/**
 * Get site connection with proper error handling
 * @param {string} site - Site name or code
 * @returns {Promise<{connection: Object, siteCode: string, siteName: string}>}
 */
async function getSiteConnection(site) {
  const { siteCode, siteName } = await resolveSite(site);
  const connection = await siteDatabaseManager.getSiteConnection(siteCode);
  return { connection, siteCode, siteName };
}

module.exports = {
  resolveSite,
  getSiteConnection
};
