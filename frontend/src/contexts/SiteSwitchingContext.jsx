import React, { createContext, useContext, useState, useEffect } from 'react';
import siteSwitchingApi from '../services/siteSwitchingApi';

const SiteSwitchingContext = createContext();

export const useSiteSwitching = () => {
  const context = useContext(SiteSwitchingContext);
  if (!context) {
    throw new Error('useSiteSwitching must be used within a SiteSwitchingProvider');
  }
  return context;
};

export const SiteSwitchingProvider = ({ children }) => {
  const [currentSite, setCurrentSite] = useState(null);
  const [availableSites, setAvailableSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load available sites on mount
  useEffect(() => {
    loadAvailableSites();
    loadCurrentSite();
  }, []);

  /**
   * Load all available sites
   */
  const loadAvailableSites = async () => {
    try {
      setLoading(true);
      const response = await siteSwitchingApi.getAvailableSites();
      setAvailableSites(response.sites || []);
      setError(null);
    } catch (err) {
      console.error('Error loading available sites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load current site information
   */
  const loadCurrentSite = async () => {
    try {
      const response = await siteSwitchingApi.getCurrentSite();
      if (response.success) {
        setCurrentSite(response.currentSite);
      }
    } catch (err) {
      console.error('Error loading current site:', err);
      // Don't set error here as it's expected if no site is selected
    }
  };

  /**
   * Switch to a specific site
   * @param {string} site - Site code or name
   */
  const switchToSite = async (site) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await siteSwitchingApi.switchToSite(site);
      
      if (response.success) {
        setCurrentSite(response.currentSite);
        return { success: true, site: response.currentSite };
      } else {
        throw new Error(response.message || 'Failed to switch site');
      }
    } catch (err) {
      console.error('Error switching to site:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate a site
   * @param {string} site - Site code or name to validate
   */
  const validateSite = async (site) => {
    try {
      const response = await siteSwitchingApi.validateSite(site);
      return response;
    } catch (err) {
      console.error('Error validating site:', err);
      return { success: false, valid: false, error: err.message };
    }
  };

  /**
   * Get site-specific data
   * @param {string} dataType - Type of data
   * @param {Object} options - Query options
   */
  const getSiteData = async (dataType, options = {}) => {
    try {
      const response = await siteSwitchingApi.getSiteData(dataType, options);
      return response;
    } catch (err) {
      console.error(`Error fetching ${dataType} data:`, err);
      throw err;
    }
  };

  /**
   * Get site-specific lookups
   * @param {string} lookupType - Type of lookup
   */
  const getSiteLookups = async (lookupType) => {
    try {
      const response = await siteSwitchingApi.getSiteLookups(lookupType);
      return response;
    } catch (err) {
      console.error(`Error fetching ${lookupType} lookups:`, err);
      throw err;
    }
  };

  /**
   * Get patients from current site
   * @param {string} patientType - Type of patients
   * @param {Object} options - Query options
   */
  const getSitePatients = async (patientType, options = {}) => {
    try {
      const response = await siteSwitchingApi.getSitePatients(patientType, options);
      return response;
    } catch (err) {
      console.error(`Error fetching ${patientType} patients:`, err);
      throw err;
    }
  };

  /**
   * Clear current site
   */
  const clearCurrentSite = () => {
    setCurrentSite(null);
  };

  /**
   * Refresh current site information
   */
  const refreshCurrentSite = async () => {
    await loadCurrentSite();
  };

  const value = {
    // State
    currentSite,
    availableSites,
    loading,
    error,
    
    // Actions
    switchToSite,
    validateSite,
    getSiteData,
    getSiteLookups,
    getSitePatients,
    clearCurrentSite,
    refreshCurrentSite,
    loadAvailableSites,
    loadCurrentSite,
    
    // Computed
    isSiteSelected: !!currentSite,
    currentSiteCode: currentSite?.code,
    currentSiteName: currentSite?.name,
  };

  return (
    <SiteSwitchingContext.Provider value={value}>
      {children}
    </SiteSwitchingContext.Provider>
  );
};

export default SiteSwitchingContext;
