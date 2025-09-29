import * as React from "react"
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden"

const VisuallyHidden = React.forwardRef(({ className, ...props }, ref) => (
  <VisuallyHiddenPrimitive.Root
    ref={ref}
    className={className}
    {...props}
  />
))
VisuallyHidden.displayName = VisuallyHiddenPrimitive.Root.displayName

export { VisuallyHidden }
