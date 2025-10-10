import api from './api';

const analyticsApi = {
  // Get analytics health status
  getAnalyticsHealth: async () => {
    try {
      const response = await api.get('/apiv1/analytics/health');
      return response.data;
    } catch (error) {
      console.error('Analytics health check failed:', error);
      throw error;
    }
  },

  // Get analytics summary
  getAnalyticsSummary: async () => {
    try {
      const response = await api.get('/apiv1/analytics/summary');
      return response.data;
    } catch (error) {
      console.error('Analytics summary failed:', error);
      throw error;
    }
  },

  // Run yearly analytics
  runYearlyAnalytics: async (year, siteCode = null) => {
    try {
      const response = await api.post('/apiv1/analytics/run-yearly', {
        year,
        siteCode
      });
      return response.data;
    } catch (error) {
      console.error('Yearly analytics failed:', error);
      throw error;
    }
  },

  // Enable analytics engine
  enableAnalytics: async () => {
    try {
      const response = await api.post('/apiv1/analytics/enable');
      return response.data;
    } catch (error) {
      console.error('Enable analytics failed:', error);
      throw error;
    }
  },

  // Disable analytics engine
  disableAnalytics: async () => {
    try {
      const response = await api.post('/apiv1/analytics/disable');
      return response.data;
    } catch (error) {
      console.error('Disable analytics failed:', error);
      throw error;
    }
  },

  // Get analytics data for a specific period
  getAnalyticsData: async (siteCode, periodType, periodYear, periodQuarter = null, periodMonth = null) => {
    try {
      const params = new URLSearchParams({
        periodType,
        periodYear: periodYear.toString()
      });
      
      if (periodQuarter) params.append('periodQuarter', periodQuarter.toString());
      if (periodMonth) params.append('periodMonth', periodMonth.toString());

      const response = await api.get(`/apiv1/analytics/indicators/${siteCode}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get analytics data failed:', error);
      throw error;
    }
  },

  // Get single indicator data
  getIndicatorData: async (indicatorId, siteCode, periodType, periodYear, periodQuarter = null, periodMonth = null) => {
    try {
      const params = new URLSearchParams({
        periodType,
        periodYear: periodYear.toString()
      });
      
      if (periodQuarter) params.append('periodQuarter', periodQuarter.toString());
      if (periodMonth) params.append('periodMonth', periodMonth.toString());

      const response = await api.get(`/apiv1/analytics/indicator/${indicatorId}/${siteCode}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get indicator data failed:', error);
      throw error;
    }
  },

  // Batch calculate indicators
  batchCalculate: async (calculations) => {
    try {
      const response = await api.post('/apiv1/analytics/batch-calculate', {
        calculations
      });
      return response.data;
    } catch (error) {
      console.error('Batch calculate failed:', error);
      throw error;
    }
  },

  // Get all analytics data with filters
  getAllAnalyticsData: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.indicatorId) params.append('indicatorId', filters.indicatorId);
      if (filters.siteCode) params.append('siteCode', filters.siteCode);
      if (filters.periodType) params.append('periodType', filters.periodType);
      if (filters.periodYear) params.append('periodYear', filters.periodYear);
      if (filters.periodQuarter && filters.periodQuarter !== '') params.append('periodQuarter', filters.periodQuarter);

      const response = await api.get(`/apiv1/analytics/data?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get all analytics data failed:', error);
      throw error;
    }
  },

  // Get unique sites from analytics_indicators table
  getAnalyticsSites: async () => {
    try {
      const response = await api.get('/apiv1/analytics/sites');
      return response.data;
    } catch (error) {
      console.error('Get analytics sites failed:', error);
      throw error;
    }
  },

  // Get unique indicators from analytics_indicators table
  getAnalyticsIndicators: async () => {
    try {
      const response = await api.get('/apiv1/analytics/indicators');
      return response.data;
    } catch (error) {
      console.error('Get analytics indicators failed:', error);
      throw error;
    }
  },

  // Get unique years from analytics_indicators table
  getAnalyticsYears: async () => {
    try {
      const response = await api.get('/apiv1/analytics/years');
      return response.data;
    } catch (error) {
      console.error('Get analytics years failed:', error);
      throw error;
    }
  },

  // Clear analytics cache
  clearCache: async () => {
    try {
      const response = await api.post('/apiv1/analytics/clear-cache');
      return response.data;
    } catch (error) {
      console.error('Clear cache failed:', error);
      throw error;
    }
  },

  // Reset auto-increment counters
  resetAutoIncrement: async () => {
    try {
      const response = await api.post('/apiv1/admin/reset-auto-increment');
      return response.data;
    } catch (error) {
      console.error('Reset auto-increment failed:', error);
      throw error;
    }
  }
};

export default analyticsApi;
