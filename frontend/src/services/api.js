import axios from 'axios'

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

let API_BASE_URL = import.meta.env.VITE_API_URL || getApiUrl()

// Ensure API_BASE_URL doesn't end with /api to avoid double /api
if (API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace('/api', '')
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
})

// Request interceptor to add auth token and cache-busting
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add cache-busting parameter for GET requests to indicators
    if (config.method === 'get' && config.url?.includes('/indicators-optimized/')) {
      config.params = {
        ...config.params,
        _t: Date.now() // Add timestamp to prevent caching
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
