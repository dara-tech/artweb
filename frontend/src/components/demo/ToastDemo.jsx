import React from 'react'
import { Button } from '@/components/ui'
import { useToast } from '@/hooks/useToast'

const ToastDemo = () => {
  const { toast } = useToast()

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "Success!",
      description: "Your data has been saved successfully.",
    })
  }

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Something went wrong. Please try again.",
    })
  }

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "Warning",
      description: "Please review your input before proceeding.",
    })
  }

  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "Information",
      description: "Here's some helpful information for you.",
    })
  }

  const showCustomToast = () => {
    toast({
      title: "Custom Toast",
      description: "This is a custom toast with default styling.",
      icon: false, // Hide the default icon
    })
  }

  const showActionToast = () => {
    toast({
      variant: "info",
      title: "Action Required",
      description: "Would you like to proceed with this action?",
      action: (
        <Button variant="outline" size="sm">
          Proceed
        </Button>
      ),
    })
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Demo</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button onClick={showSuccessToast} variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
          Success Toast
        </Button>
        <Button onClick={showErrorToast} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
          Error Toast
        </Button>
        <Button onClick={showWarningToast} variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
          Warning Toast
        </Button>
        <Button onClick={showInfoToast} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
          Info Toast
        </Button>
        <Button onClick={showCustomToast} variant="outline">
          Custom Toast
        </Button>
        <Button onClick={showActionToast} variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
          Action Toast
        </Button>
      </div>
    </div>
  )
}

export default ToastDemo
