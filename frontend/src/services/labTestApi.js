// Lab Test Result API Service
// Handles integration with external lab test result API

// Determine API URL based on current hostname
const getApiUrl = () => {
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001'
  } else {
    // For network access, use the same hostname but port 3001
    return `http://${hostname}:3001`
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const labTestApi = {
  // Get lab test results from external API
  getTestResults: async (params) => {
    const { startDate, endDate, type, siteCode } = params;
    
    const response = await fetch(`${API_BASE_URL}/apiv1/lab-tests/results`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        startDate,
        endDate,
        type,
        siteCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch lab test results');
    }

    return response.json();
  },

  // Get available test types
  getTestTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/apiv1/lab-tests/types`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch test types');
    }

    return response.json();
  },

  // Get lab test statistics
  getTestStats: async (params) => {
    const { startDate, endDate, siteCode } = params;
    
    const response = await fetch(`${API_BASE_URL}/apiv1/lab-tests/stats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        startDate,
        endDate,
        siteCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch lab test statistics');
    }

    return response.json();
  },

  // Test external lab API connection
  testConnection: async () => {
    const response = await fetch(`${API_BASE_URL}/apiv1/lab-tests/test-connection`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to test lab API connection');
    }

    return response.json();
  }
};

export default labTestApi;

