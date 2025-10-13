import api from './api';

const userLogsApi = {
  // Get user activity logs
  getUserLogs: async (params = {}) => {
    try {
      const response = await api.get('/apiv1/user-logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user logs:', error);
      throw error;
    }
  },

  // Get user log statistics
  getUserLogStats: async (params = {}) => {
    try {
      const response = await api.get('/apiv1/user-logs/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user log stats:', error);
      throw error;
    }
  }
};

export default userLogsApi;
