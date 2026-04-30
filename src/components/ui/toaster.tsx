"use client"

import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-[350px] max-w-[95vw] pointer-events-none">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`pointer-events-auto rounded-xl border shadow-2xl p-4 animate-in slide-in-from-top-2 ${
            variant === "destructive"
              ? "bg-red-600 text-white border-red-700"
              : "bg-white text-black border-gray-200"
          }`}
        >
          {title && <div className="font-bold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90 mt-1">{description}</div>
          )}
        </div>
      ))}
    </div>
  )
}