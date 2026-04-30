
"use client"

import React, { createContext, useContext, useState } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({
    title,
    description,
    variant = "default",
  }: Omit<ToastProps, "id">) => {
    const id = crypto.randomUUID()

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        description,
        variant,
      },
    ])

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      )
    }, 3000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }

  return (
    <ToastContext.Provider
      value={{ toasts, toast, dismiss }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      "useToast must be used within ToastProvider"
    )
  }

  return context
}