import api from './api';

const auditApi = {
  // Get all available audit reports
  getReports: async () => {
    try {
      const response = await api.get('/audit/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching audit reports:', error);
      throw error;
    }
  },

  // Execute audit report for specific site
  getReportForSite: async (reportId, siteCode, startDate, endDate) => {
    try {
      const response = await api.get(`/audit/reports/${reportId}/sites/${siteCode}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit report for site:', error);
      throw error;
    }
  },

  // Execute audit report for all sites
  getReportForAllSites: async (reportId, startDate, endDate) => {
    try {
      const response = await api.get(`/audit/reports/${reportId}/all-sites`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit report for all sites:', error);
      throw error;
    }
  },

  // Get audit logs (user actions)
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }
};

export default auditApi;
