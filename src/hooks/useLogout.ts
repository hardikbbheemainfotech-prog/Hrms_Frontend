"use client"
import api from "@/lib/axios"
import { logout } from "@/feature/auth/authslice"
import { resetSession } from "@/feature/sessionSlice/employeeSessionSlice"
import { useAppDispatch } from "@/lib/hooks"

export const useLogout = () => {
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.warn("Backend already invalidated the session.");
    } finally {
      dispatch(logout());
      dispatch(resetSession());

      localStorage.removeItem("persist:root");
    }
  }

  return handleLogout
}