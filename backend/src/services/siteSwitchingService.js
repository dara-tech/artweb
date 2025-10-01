const { siteDatabaseManager } = require('../config/siteDatabase');

class SiteSwitchingService {
  constructor() {
    this.currentSite = null;
    this.siteCache = new Map();
    this.defaultSite = '0201'; // Set a default site
  }

  /**
   * Switch to a specific site
   * @param {string} siteIdentifier - Site code (0201) or site name (Maung Russey RH)
   * @returns {Object} Site information
   */
  async switchToSite(siteIdentifier) {
    try {
      // Determine if it's a site code or site name
      let siteCode, siteName;
      
      if (this.isSiteCode(siteIdentifier)) {
        siteCode = siteIdentifier;
        siteName = await this.getSiteName(siteCode);
      } else {
        siteName = siteIdentifier;
        siteCode = await this.getSiteCode(siteName);
      }

      if (!siteCode) {
        throw new Error(`Site '${siteIdentifier}' not found`);
      }

      // Get site connection
      const siteConnection = await siteDatabaseManager.getSiteConnection(siteCode);
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);

      // Update current site
      this.currentSite = {
        code: siteCode,
        name: siteName,
        connection: siteConnection,
        info: siteInfo
      };

      // Cache site info
      this.siteCache.set(siteCode, this.currentSite);

      return this.currentSite;
    } catch (error) {
      console.error('Error switching to site:', error);
      throw error;
    }
  }

  /**
   * Get current site information
   */
  getCurrentSite() {
    return this.currentSite;
  }

  /**
   * Get or initialize current site
   */
  async getCurrentSiteOrDefault() {
    if (!this.currentSite) {
      // Initialize with default site
      await this.switchToSite(this.defaultSite);
    }
    return this.currentSite;
  }

  /**
   * Get site connection for current site
   */
  getCurrentSiteConnection() {
    if (!this.currentSite) {
      throw new Error('No site selected. Please switch to a site first.');
    }
    return this.currentSite.connection;
  }

  /**
   * Get all available sites
   */
  async getAvailableSites() {
    try {
      const sites = await siteDatabaseManager.getAllSites();
      return sites.map(site => ({
        code: site.code,
        name: site.name,
        database: site.database_name,
        province: site.province,
        isActive: site.status === 1
      }));
    } catch (error) {
      console.error('Error getting available sites:', error);
      return [];
    }
  }

  /**
   * Validate site exists and is active
   */
  async validateSite(siteIdentifier) {
    try {
      let siteCode;
      
      if (this.isSiteCode(siteIdentifier)) {
        siteCode = siteIdentifier;
      } else {
        siteCode = await this.getSiteCode(siteIdentifier);
      }

      if (!siteCode) {
        return { valid: false, error: `Site '${siteIdentifier}' not found` };
      }

      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      if (!siteInfo) {
        return { valid: false, error: `Site '${siteIdentifier}' not found or inactive` };
      }

      return { 
        valid: true, 
        siteCode, 
        siteName: siteInfo.name,
        siteInfo 
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Check if the parameter looks like a site code (4 digits)
   */
  isSiteCode(param) {
    return /^\d{4}$/.test(param);
  }

  /**
   * Get site name from site code
   */
  async getSiteName(siteCode) {
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
  async getSiteCode(siteName) {
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
   * Get site-specific data (patients, lookups, etc.)
   */
  async getSiteData(dataType, options = {}) {
    // Get current site or use default
    const currentSite = await this.getCurrentSiteOrDefault();
    const connection = currentSite.connection;
    
    switch (dataType) {
      case 'patients':
        return this.getPatients(connection, options);
      case 'lookups':
        return this.getLookups(connection, options);
      case 'indicators':
        return this.getIndicators(connection, options);
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * Get patients from current site
   */
  async getPatients(connection, options = {}) {
    const { patientType = 'adult', page = 1, limit = 25, filters = {} } = options;
    
    let tableName;
    switch (patientType) {
      case 'adult':
        tableName = 'tblaimain';
        break;
      case 'child':
        tableName = 'tblcimain';
        break;
      case 'infant':
        tableName = 'tbleimain';
        break;
      default:
        throw new Error(`Unknown patient type: ${patientType}`);
    }
    
    // Build query based on patient type and filters
    const query = this.buildPatientQuery(tableName, filters, page, limit);
    
    const [countResult, dataResult] = await Promise.all([
      connection.query(query.count, { type: connection.QueryTypes.SELECT }),
      connection.query(query.data, { type: connection.QueryTypes.SELECT })
    ]);

    return {
      patients: dataResult,
      total: countResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].count / limit)
    };
  }

  /**
   * Get lookups from current site
   */
  async getLookups(connection, options = {}) {
    const { lookupType } = options;
    
    const lookupQueries = {
      sites: 'SELECT SiteCode as code, NameEn as name FROM tblsitename ORDER BY SiteCode',
      drugs: 'SELECT Did as id, DrugName as name, Status FROM tbldrug ORDER BY DrugName',
      nationalities: 'SELECT nid as id, nationality as name FROM tblnationality ORDER BY nationality',
      targetGroups: 'SELECT Tid as id, Targroup as name FROM tbltargroup WHERE Status = "1" ORDER BY Tid',
      clinics: 'SELECT Cid as id, ClinicName as name FROM tblclinic ORDER BY ClinicName',
      reasons: 'SELECT Rid as id, Reason as name FROM tblreason ORDER BY Reason',
      allergies: 'SELECT Aid as id, AllergyStatus as name, Type as status FROM tblallergy ORDER BY Type, AllergyStatus',
      provinces: 'SELECT pid as id, provinceeng as name FROM tblprovince ORDER BY pid',
      hospitals: 'SELECT DISTINCT HospitalName as name, HospitalName as code FROM tbleimain WHERE HospitalName IS NOT NULL AND HospitalName != "" ORDER BY HospitalName',
      drugTreatments: 'SELECT Tid as id, DrugName as name FROM tbldrugtreat ORDER BY DrugName',
      vcctSites: 'SELECT Vid as code, SiteName as name FROM tblvcctsite WHERE Status = "1" ORDER BY Vid'
    };

    if (!lookupType || !lookupQueries[lookupType]) {
      throw new Error(`Unknown lookup type: ${lookupType}`);
    }

    const result = await connection.query(lookupQueries[lookupType], {
      type: connection.QueryTypes.SELECT
    });

    return result;
  }

  /**
   * Build patient query based on table and filters
   */
  buildPatientQuery(tableName, filters, page, limit) {
    const offset = (page - 1) * limit;
    
    // Base query structure
    const baseQuery = `
      FROM ${tableName} p
      LEFT JOIN tblsitename s ON p.SiteName = s.SiteCode
    `;

    // Add patient status join based on table
    let statusJoin = '';
    if (tableName === 'tblaimain') {
      statusJoin = 'LEFT JOIN tblavpatientstatus ps ON p.ClinicID = ps.ClinicID';
    } else if (tableName === 'tblcimain') {
      statusJoin = 'LEFT JOIN tblcvpatientstatus ps ON p.ClinicID = ps.ClinicID';
    } else if (tableName === 'tbleimain') {
      statusJoin = 'LEFT JOIN tblevpatientstatus ps ON p.ClinicID = ps.ClinicID';
    }

    const countQuery = `
      SELECT COUNT(*) as count
      ${baseQuery}
      ${statusJoin}
    `;

    const dataQuery = `
      SELECT 
        p.ClinicID as clinicId,
        p.DafirstVisit as dateFirstVisit,
        p.DaBirth as dateOfBirth,
        p.Sex as sex,
        p.SiteName as siteCode,
        s.NameEn as siteName,
        COALESCE(ps.Status, -1) as patientStatus
      ${baseQuery}
      ${statusJoin}
      ORDER BY p.ClinicID DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return { count: countQuery, data: dataQuery };
  }
}

// Create singleton instance
const siteSwitchingService = new SiteSwitchingService();

module.exports = siteSwitchingService;
