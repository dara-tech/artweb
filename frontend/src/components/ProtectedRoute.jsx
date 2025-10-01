import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/indicators' }) => {
  const { user } = useAuth()
  
  // If no specific roles are provided, allow all authenticated users
  if (allowedRoles.length === 0) {
    return children
  }
  
  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(user?.role)
  
  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />
  }
  
  return children
}

export default ProtectedRoute
