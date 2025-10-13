import { toast } from '@/hooks/use-toast'

// Helper function to check if current user is a viewer
const isViewerUser = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    // Decode JWT token (simple base64 decode of payload)
    const payload = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payload))
    
    // Check if user role is 'viewer'
    return decodedPayload.role === 'viewer'
  } catch (error) {
    // If there's any error decoding, allow toasts to show
    return false
  }
}

export const toastService = {
  // Success toast
  success: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'success',
      duration: 5000,
    })
  },

  // Error toast
  error: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'destructive',
      duration: 7000,
    })
  },

  // Warning toast
  warning: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'warning',
      duration: 6000,
    })
  },

  // Info toast
  info: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'info',
      duration: 5000,
    })
  },

  // Default toast
  default: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'default',
      duration: 5000,
    })
  },

  // Custom toast with action
  withAction: (title, description = '', action) => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      action,
      duration: 10000,
    })
  },

  // Loading toast (for long operations)
  loading: (title, description = '') => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return
    
    return toast({
      title,
      description,
      variant: 'info',
      duration: 0, // Don't auto-dismiss
    })
  }
}

export default toastService
