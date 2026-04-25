"use client"

import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RoleGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, isInitialized, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || !user) {
        router.replace("/auth/login")
      } else if (!allowedRoles.includes(user.role)) {
        router.replace("/dashboard/unauthorized")
      }
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router])
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
         <p className="animate-pulse font-bold text-[#1A2517]">Verifying Session...</p>
      </div>
    )
  }
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null 
  }
 
  return <>{children}</>
}