// Determine API URL based on current hostname
const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  } else {
    // For network access, use the same hostname but port 3001
    return `http://${hostname}:3001`;
  }
};

const API_BASE_URL = getApiUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type for FormData - let browser set it with boundary
  };
};

export const importApi = {
  // Import SQL file
  importSqlFile: async (formData, onProgress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/apiv1/import/sql`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Import failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Import API error:', error);
      throw error;
    }
  },

  // Get import history
  getImportHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/apiv1/import/history`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch import history');
      }

      return await response.json();
    } catch (error) {
      console.error('Import history API error:', error);
      throw error;
    }
  },

  // Validate SQL file before import
  validateSqlFile: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/apiv1/import/validate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Validation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('SQL validation API error:', error);
      throw error;
    }
  },

  // Get available sites for import
  getAvailableSites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/apiv1/import/sites`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available sites');
      }

      return await response.json();
    } catch (error) {
      console.error('Available sites API error:', error);
      throw error;
    }
  }
};

export default importApi;
