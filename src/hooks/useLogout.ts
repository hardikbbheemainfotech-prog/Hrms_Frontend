"use client"

import api from "@/lib/axios"
import { logout } from "@/feature/auth/authslice"
import { logoutSession } from "@/feature/sessionSlice/employeeSessionSlice"
import { useAppDispatch } from "@/lib/hooks"

export const useLogout = () => {
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    let currentLoginTime: number | null = null
    let dailyWorkedMs = 0
    let loginDate: string | null = null

    try {
      const persistedRoot = localStorage.getItem("persist:root")

      if (persistedRoot) {
        const parsedRoot = JSON.parse(persistedRoot)

        if (parsedRoot.employeeSession) {
          const employeeSession = JSON.parse(parsedRoot.employeeSession)

          currentLoginTime = employeeSession.loginTime || null
          dailyWorkedMs = employeeSession.dailyWorkedMs || 0
          loginDate = employeeSession.loginDate || null
        }
      }
    } catch (error) {
      console.warn("Failed to parse persisted session.")
    }

    const today = new Date().toDateString()
    const logoutTime = Date.now()

    const sessionWorkedMs = currentLoginTime
      ? logoutTime - currentLoginTime
      : 0

    const updatedDailyWorkedMs =
      loginDate === today
        ? dailyWorkedMs + sessionWorkedMs
        : sessionWorkedMs

    const total_hours = {
      hours: Math.floor(updatedDailyWorkedMs / (1000 * 60 * 60)),
      minutes: Math.floor(
        (updatedDailyWorkedMs % (1000 * 60 * 60)) / (1000 * 60)
      ),
      seconds: Math.floor(
        (updatedDailyWorkedMs % (1000 * 60)) / 1000
      ),
    }

    try {
      await api.post("/auth/logout", {
        loginDate: today,
        loginTime: currentLoginTime,
        logoutTime,
        sessionWorkedMs,
        totalWorkedTodayMs: updatedDailyWorkedMs,
        total_hours,
      })
    } catch (error) {
      console.warn("Backend already invalidated the session.")
    } finally {
      dispatch(logoutSession())

      dispatch(logout())
    }
  }

  return handleLogout
}