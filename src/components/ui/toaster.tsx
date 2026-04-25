"use client"

import { useToast } from "../../hooks/use_toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        return (
          <div key={id} className={`mb-2 p-4 rounded-md shadow-lg border ${variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
            {title && <div className="font-bold">{title}</div>}
            {description && <div className="text-sm opacity-90">{description}</div>}
          </div>
        )
      })}
    </div>
  )
}