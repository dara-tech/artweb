import React, { useState } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles,
  Zap,
  Heart,
  Star,
  Rocket,
  Shield
} from 'lucide-react'

const ToastShowcase = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "🎉 Success!",
      description: "Your data has been saved successfully. All changes are now live.",
    })
  }

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: "❌ Error",
      description: "Something went wrong. Please check your connection and try again.",
    })
  }

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "⚠️ Warning",
      description: "Please review your input before proceeding. Some fields are incomplete.",
    })
  }

  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "ℹ️ Information",
      description: "Here's some helpful information about the current process.",
    })
  }

  const showCustomIconToast = () => {
    toast({
      variant: "success",
      title: "Custom Icon Toast",
      description: "This toast uses a custom icon instead of the default one.",
      icon: <Sparkles className="h-5 w-5 text-purple-500" />
    })
  }

  const showActionToast = () => {
    toast({
      variant: "info",
      title: "Action Required",
      description: "Would you like to proceed with this action?",
      action: (
        <Button variant="outline" size="sm" className="ml-2">
          Proceed
        </Button>
      ),
    })
  }

  const showLongToast = () => {
    toast({
      variant: "info",
      title: "Detailed Information",
      description: "This is a longer toast message that demonstrates how the component handles extended text content. It should wrap properly and maintain good readability while providing comprehensive information to the user.",
    })
  }

  const showMultipleToasts = () => {
    toast({
      variant: "success",
      title: "First Toast",
      description: "This is the first toast in a sequence.",
    })
    
    setTimeout(() => {
      toast({
        variant: "info",
        title: "Second Toast",
        description: "This is the second toast.",
      })
    }, 500)
    
    setTimeout(() => {
      toast({
        variant: "warning",
        title: "Third Toast",
        description: "This is the third toast.",
      })
    }, 1000)
  }

  const showLoadingToast = () => {
    setIsLoading(true)
    toast({
      variant: "info",
      title: "Processing...",
      description: "Please wait while we process your request.",
    })
    
    setTimeout(() => {
      setIsLoading(false)
      toast({
        variant: "success",
        title: "Complete!",
        description: "Your request has been processed successfully.",
      })
    }, 3000)
  }

  const showSpecialEffectToast = () => {
    toast({
      variant: "success",
      title: "Special Effects",
      description: "This toast has special styling and effects!",
      className: "toast-glow-success toast-bounce-enter"
    })
  }

  const showMedicalToast = () => {
    toast({
      variant: "success",
      title: "Patient Data Updated",
      description: "Patient information has been successfully updated in the system.",
      icon: <Heart className="h-5 w-5 text-green-500" />
    })
  }

  const showSystemToast = () => {
    toast({
      variant: "info",
      title: "System Maintenance",
      description: "Scheduled maintenance will begin in 30 minutes. Please save your work.",
      icon: <Shield className="h-5 w-5 text-blue-500" />
    })
  }

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Beautiful Toast Notifications
        </h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive showcase of our beautiful toast notification system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Basic Toasts
            </CardTitle>
            <CardDescription>
              Standard toast notifications for different states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={showSuccessToast} variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-50">
              Success Toast
            </Button>
            <Button onClick={showErrorToast} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
              Error Toast
            </Button>
            <Button onClick={showWarningToast} variant="outline" className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50">
              Warning Toast
            </Button>
            <Button onClick={showInfoToast} variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
              Info Toast
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Advanced Features
            </CardTitle>
            <CardDescription>
              Toasts with custom icons, actions, and effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={showCustomIconToast} variant="outline" className="w-full">
              Custom Icon
            </Button>
            <Button onClick={showActionToast} variant="outline" className="w-full">
              With Action Button
            </Button>
            <Button onClick={showLongToast} variant="outline" className="w-full">
              Long Message
            </Button>
            <Button onClick={showSpecialEffectToast} variant="outline" className="w-full">
              Special Effects
            </Button>
          </CardContent>
        </Card>

        {/* Medical Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Medical Context
            </CardTitle>
            <CardDescription>
              Toasts designed for healthcare applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={showMedicalToast} variant="outline" className="w-full">
              Patient Update
            </Button>
            <Button onClick={showSystemToast} variant="outline" className="w-full">
              System Alert
            </Button>
            <Button onClick={showLoadingToast} variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Loading Demo"}
            </Button>
          </CardContent>
        </Card>

        {/* Multiple Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Multiple Toasts
            </CardTitle>
            <CardDescription>
              Demonstrating toast stacking and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={showMultipleToasts} variant="outline" className="w-full">
              Show Multiple Toasts
            </Button>
          </CardContent>
        </Card>

        {/* Animation Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-500" />
              Animations
            </CardTitle>
            <CardDescription>
              Beautiful entrance and exit animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p>• Smooth slide-in animations</p>
              <p>• Hover effects and scaling</p>
              <p>• Glow effects for different types</p>
              <p>• Bounce and shake animations</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Usage
            </CardTitle>
            <CardDescription>
              How to use the toast system in your components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`import { useToast } from '@/hooks/useToast'

const { toast } = useToast()

toast({
  variant: "success",
  title: "Success!",
  description: "Your action completed successfully."
})`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ToastShowcase
