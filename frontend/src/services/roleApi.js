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

const API_BASE_URL = getApiUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const roleApi = {
  // Get all available roles
  getRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/roles`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Get all users with their roles
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Create new user
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Update user role
  updateUserRole: async (userId, roleData) => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData)
    });
    return response.json();
  },

  // Get user permissions
  getPermissions: async () => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/permissions`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Delete user (super admin only)
  deleteUser: async (userId, confirmDelete = true) => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ confirmDelete })
    });
    return response.json();
  },

  // Change user password
  changePassword: async (userId, newPassword, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users/${userId}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword, confirmPassword })
    });
    return response.json();
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    const response = await fetch(`${API_BASE_URL}/apiv1/roles/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

export default roleApi;
