import * as React from "react"
import { Toast } from "./toast"
import { useToast } from "@/hooks/useToast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, variant, icon, ...props }) {
        return (
          <Toast
            key={id}
            variant={variant}
            title={title}
            description={description}
            icon={icon}
            {...props}
          >
            {action}
          </Toast>
        )
      })}
    </div>
  )
}
