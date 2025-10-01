import * as React from "react"
import { cva } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground hover:shadow-lg",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground hover:shadow-red-500/20",
        success: "border-success/20 bg-success/5 text-success-foreground hover:shadow-green-500/20",
        warning: "border-warning/20 bg-warning/5 text-warning-foreground hover:shadow-yellow-500/20",
        info: "border-info/20 bg-info/5 text-info-foreground hover:shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

const ToastIcon = ({ variant, className }) => {
  const iconProps = { className: cn("h-5 w-5 flex-shrink-0", className) }
  
  switch (variant) {
    case "success":
      return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-success")} />
    case "destructive":
      return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-destructive")} />
    case "warning":
      return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-warning")} />
    case "info":
      return <Info {...iconProps} className={cn(iconProps.className, "text-info")} />
    default:
      return <Info {...iconProps} className={cn(iconProps.className, "text-primary")} />
  }
}

const ToastContent = React.forwardRef(({ className, variant, title, description, icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start space-x-3", className)}
    {...props}
  >
    {icon !== false && <ToastIcon variant={variant} />}
    <div className="flex-1 space-y-1">
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
  </div>
))
ToastContent.displayName = "ToastContent"

export { 
  Toast, 
  ToastAction, 
  ToastClose, 
  ToastTitle, 
  ToastDescription, 
  ToastContent,
  ToastIcon,
  toastVariants 
}
