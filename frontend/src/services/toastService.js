import { toast } from '@/hooks/use-toast'

export const toastService = {
  // Success toast
  success: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'success',
      duration: 5000,
    })
  },

  // Error toast
  error: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'destructive',
      duration: 7000,
    })
  },

  // Warning toast
  warning: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'warning',
      duration: 6000,
    })
  },

  // Info toast
  info: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'info',
      duration: 5000,
    })
  },

  // Default toast
  default: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'default',
      duration: 5000,
    })
  },

  // Custom toast with action
  withAction: (title, description = '', action) => {
    return toast({
      title,
      description,
      action,
      duration: 10000,
    })
  },

  // Loading toast (for long operations)
  loading: (title, description = '') => {
    return toast({
      title,
      description,
      variant: 'info',
      duration: 0, // Don't auto-dismiss
    })
  }
}

export default toastService
