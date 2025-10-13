import api from './api';

const patientTestApi = {
  // Get patient test results with pagination and filtering
  getPatientTests: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.clinicId) queryParams.append('clinicId', params.clinicId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.testType) queryParams.append('testType', params.testType);
    if (params.search) queryParams.append('search', params.search);
    if (params.site) queryParams.append('site', params.site);

    const response = await api.get(`/apiv1/patient-tests?${queryParams.toString()}`);
    return response.data;
  },

  // Get test statistics
  getTestStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.site) queryParams.append('site', params.site);

    const response = await api.get(`/apiv1/patient-tests/stats/summary?${queryParams.toString()}`);
    return response.data;
  },

  // Get a specific test by ID
  getTestById: async (testId, site) => {
    const queryParams = new URLSearchParams();
    if (site) queryParams.append('site', site);

    const response = await api.get(`/apiv1/patient-tests/detail/${testId}?${queryParams.toString()}`);
    return response.data;
  },

  // Create a new test
  createTest: async (testData, site) => {
    const queryParams = new URLSearchParams();
    if (site) queryParams.append('site', site);

    const response = await api.post(`/apiv1/patient-tests?${queryParams.toString()}`, testData);
    return response.data;
  },

  // Test API connection
  testConnection: async () => {
    const response = await api.get('/apiv1/patient-tests/test');
    return response.data;
  }
};

export default patientTestApi;
