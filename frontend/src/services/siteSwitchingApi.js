import api from './api';

class SiteSwitchingApi {
  /**
   * Get all available sites
   */
  async getAvailableSites() {
    try {
      const response = await api.get('/site-switching/sites');
      return response.data;
    } catch (error) {
      console.error('Error fetching available sites:', error);
      throw error;
    }
  }

  /**
   * Switch to a specific site
   * @param {string} site - Site code (0201) or site name (Maung Russey RH)
   */
  async switchToSite(site) {
    try {
      const response = await api.post('/site-switching/switch', { site });
      return response.data;
    } catch (error) {
      console.error('Error switching to site:', error);
      throw error;
    }
  }

  /**
   * Get current site information
   */
  async getCurrentSite() {
    try {
      const response = await api.get('/site-switching/current');
      return response.data;
    } catch (error) {
      console.error('Error getting current site:', error);
      throw error;
    }
  }

  /**
   * Validate a site without switching
   * @param {string} site - Site code or name to validate
   */
  async validateSite(site) {
    try {
      const response = await api.post('/site-switching/validate', { site });
      return response.data;
    } catch (error) {
      console.error('Error validating site:', error);
      throw error;
    }
  }

  /**
   * Get site-specific data
   * @param {string} dataType - Type of data (patients, lookups, indicators)
   * @param {Object} options - Query options
   */
  async getSiteData(dataType, options = {}) {
    try {
      const params = new URLSearchParams(options);
      const response = await api.get(`/site-switching/data/${dataType}?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${dataType} data:`, error);
      throw error;
    }
  }

  /**
   * Get site-specific lookups
   * @param {string} lookupType - Type of lookup (drugs, sites, nationalities, etc.)
   */
  async getSiteLookups(lookupType) {
    try {
      const response = await api.get(`/site-switching/lookups/${lookupType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${lookupType} lookups:`, error);
      throw error;
    }
  }

  /**
   * Get patients from current site
   * @param {string} patientType - Type of patients (adult, child, infant)
   * @param {Object} options - Query options (page, limit, filters, etc.)
   */
  async getSitePatients(patientType, options = {}) {
    try {
      const params = new URLSearchParams({
        type: patientType,
        ...options
      });
      const response = await api.get(`/site-switching/data/patients?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${patientType} patients:`, error);
      throw error;
    }
  }
}

export default new SiteSwitchingApi();
