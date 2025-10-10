import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Start with loading true

  const login = async (credentials) => {
    try {
      // Use the same API URL detection logic as the API service
      const getApiUrl = () => {
        const hostname = window.location.hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        } else {
          // For network access, use the same hostname but port 3001
          return `http://${hostname}:3001`
        }
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || getApiUrl()
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 120000) // 2 minute timeout
      
      const response = await fetch(`${API_BASE_URL}/apiv1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || `Login failed (${response.status})`
        }
      }
      
      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setLoading(false)
        return { success: true }
      } else {
        return {
          success: false,
          error: data.message || 'Login failed - no token received'
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Login timeout - please check your connection'
        }
      }
      return {
        success: false,
        error: error.message || 'Network error - please try again'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Check for existing token on app load
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        // First, try to decode the token locally to avoid unnecessary API calls
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Date.now() / 1000
          
          // Check if token is expired
          if (payload.exp && payload.exp < now) {
            localStorage.removeItem('token')
            setUser(null)
            setLoading(false)
            return
          }
          
          // Set user from token payload (basic info)
          const userData = {
            id: payload.userId,
            username: payload.username,
            fullName: payload.fullName,
            role: payload.role,
            assignedSites: payload.assignedSites
          }
          
          setUser(userData)
          setLoading(false)
          
          // Verify with backend in background (non-blocking)
          verifyTokenWithBackend(token)
        } catch (decodeError) {
          console.error('Token decode error:', decodeError)
          // Token is malformed, remove it
          localStorage.removeItem('token')
          setUser(null)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      localStorage.removeItem('token')
      setUser(null)
      setLoading(false)
    }
  }

  // Background token verification
  const verifyTokenWithBackend = async (token) => {
    try {
      // Use the same API URL detection logic
      const getApiUrl = () => {
        const hostname = window.location.hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        } else {
          return `http://${hostname}:3001`
        }
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || getApiUrl()
      const response = await fetch(`${API_BASE_URL}/apiv1/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token')
        setUser(null)
      }
    } catch (error) {
      console.error('Background token verification failed:', error)
      // Don't remove token on network errors, just log
    }
  }

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])


  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}