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
        console.log('Login request timed out after 30 seconds')
        controller.abort()
      }, 30000) // 30 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      console.log('📡 Response received:')
      console.log('  Status:', response.status)
      console.log('  OK:', response.ok)
      console.log('  URL:', response.url)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ Login failed:', errorData)
        return {
          success: false,
          error: errorData.message || `Login failed (${response.status})`
        }
      }
      
      const data = await response.json()
      console.log('✅ Login successful:', data)
      
      if (data.token) {
        console.log('Setting token and user:', data.user)
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
      console.log('🔍 Checking auth status, token exists:', !!token)
      
      if (token) {
        // First, try to decode the token locally to avoid unnecessary API calls
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Date.now() / 1000
          
          console.log('Token payload:', payload)
          console.log('Token expired:', payload.exp < now)
          
          // Check if token is expired
          if (payload.exp && payload.exp < now) {
            console.log('Token expired, removing...')
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
          
          console.log('Setting user from token:', userData)
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
        console.log('No token found, setting loading to false')
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
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
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