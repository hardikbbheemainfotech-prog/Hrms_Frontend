"use client"

import { useToast } from "@/hooks/use-toast"
import { X, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "./button"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full items-center pointer-events-none px-4">
      {toasts.map(({ id, title, description, variant }) => {
        const isDestructive = variant === "destructive"

        return (
          <div
            key={id}
            className="pointer-events-auto relative overflow-hidden rounded-[2.2rem] shadow-2xl backdrop-blur-3xl border animate-in slide-in-from-top-5 fade-in duration-500 group"
            style={{
              width: "min(340px, 92vw)",
              backgroundColor: "#F1E9E4",
              borderColor: isDestructive ? "#b42318" : "#d8c8c0",
              color: "#5A0F2E",
              boxShadow:
                "0 10px 30px rgba(90, 15, 46, 0.12), 0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Progress Line */}
            <div
              className="absolute bottom-0 left-0 h-[3px] rounded-full animate-[toast-progress_3s_linear_forwards]"
              style={{
                width: "100%",
                backgroundColor: isDestructive ? "#b42318" : "#5A0F2E",
              }}
            />

            <div className="flex items-start gap-3 px-5 py-4">
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {isDestructive ? (
                  <div className="p-1.5 rounded-full bg-red-100">
                    <AlertTriangle
                      className="w-4 h-4"
                      style={{ color: "#b42318" }}
                    />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-full bg-[#e8d9df]">
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "#5A0F2E" }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <div
                    className="font-semibold text-[13px] leading-tight truncate"
                    style={{
                      color: isDestructive ? "#b42318" : "#5A0F2E",
                    }}
                  >
                    {title}
                  </div>
                )}

                {description && (
                  <div
                    className="text-[12px] mt-1 leading-snug line-clamp-2"
                    style={{
                      color: isDestructive ? "#7a1c15" : "#5A0F2E",
                    }}
                  >
                    {description}
                  </div>
                )}
              </div>

              {/* Close */}
              <Button
                onClick={() => dismiss(id)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full p-1.5 shrink-0"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDestructive
                    ? "#f8d7da"
                    : "#e5d8d2"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <X
                  className="w-3.5 h-3.5"
                  style={{
                    color: isDestructive ? "#b42318" : "#5A0F2E",
                  }}
                />
              </Button>
            </div>
          </div>
        )
      })}

      <style jsx global>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}