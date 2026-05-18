"use client"

import React, { useEffect } from "react"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { LogIn, LogOut, Pause } from "lucide-react"
import IconTooltip from "../ui/IconTooltip"
import EmployeeIDCard from "../shared/EmployeeIDCard"
import GlobalSupportModal from "@/app/dashboard/employee/components/GlobalSupportModal"
import { useToast } from "@/hooks/use-toast"
import CompanySpinner from "./loader/spinner"
import api from "@/lib/axios"
import {
  setCheckIn,
  setCheckOut,
  resetAttendance,
  hydrateAttendance,
  saveWorkedMs,
  loadWorkedMs,
  clearWorkedMs,
} from "@/feature/attendance/attendanceSlice"

type Props = {
  role: "hr" | "system-admin" | "admin" | "employee" | "intern"
}

const TIMER_ROLES = ["employee", "hr", "intern"]

const toISTDateString = (d: Date) =>
  d.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })

const getShiftRemainingMs = () => {
  const now = new Date()
  const shiftEnd = new Date()
  shiftEnd.setHours(19, 30, 0, 0)
  return Math.max(0, shiftEnd.getTime() - now.getTime())
}

export default function Navbar({ role }: Props) {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const router   = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const { user, isInitialized } = useSelector((state: any) => state.auth)
  const { isCheckedIn, checkInTime, totalWorkedMs } = useSelector(
    (state: any) => state.attendance
  )

  const logoutAction = useLogout()
  const empId = user?.employee_id
  const [currentTime, setCurrentTime] = React.useState(new Date())

  // ─── Clock tick ───────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ─── Day-change reset (IST) ───────────────────────────────────────────────
  useEffect(() => {
    const today    = toISTDateString(new Date())
    const lastDate = localStorage.getItem("last_attendance_date")
    if (lastDate !== today) {
      clearWorkedMs()
      dispatch(resetAttendance())
      localStorage.setItem("last_attendance_date", today)
    }
  }, [dispatch])

  // ─── Sync from server on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!empId) return
    const syncAttendanceStatus = async () => {
      try {
        const res = await api.get(`/attendance/status/${empId}`)
        if (!res.data?.success) return
        const { check_in } = res.data.data
        const isTodayCheckIn =
          toISTDateString(new Date(check_in)) === toISTDateString(new Date())
        if (isTodayCheckIn) {
          dispatch(hydrateAttendance({ ...res.data.data, restoredWorkedMs: loadWorkedMs() }))
        } else {
          clearWorkedMs()
          dispatch(resetAttendance())
        }
      } catch (err) {
        console.error("Attendance sync failed:", err)
      }
    }
    syncAttendanceStatus()
  }, [empId])

  // ─── Check-in / Resume ────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!empId) return
    try {
      const res = await api.post(`/attendance/check_in/${empId}/session_in`)
      if (res.data?.success) {
        dispatch(setCheckIn({
          time: new Date(res.data.data.check_in).getTime(),
          id:   res.data.data.attendance_id,
        }))
        toast({ title: "✅ Checked In", description: "Timer started" })
      }
    } catch (err) { console.error(err) }
  }

  // ─── Pause (break / lunch) ────────────────────────────────────────────────
  const handlePause = async () => {
    if (!empId) return
    try {
      const sessionMs = checkInTime ? Date.now() - checkInTime : 0
      const res = await api.post(`/attendance/check_out/${empId}/session_out`)
      if (res.data?.success) {
        const newTotal = (totalWorkedMs ?? 0) + sessionMs
        dispatch(setCheckOut({ sessionMs }))
        saveWorkedMs(newTotal)
        toast({ title: "⏸ Paused", description: "Session paused — resume anytime" })
      }
    } catch (err) { console.error(err) }
  }

  // ─── Check-out (end of day) ───────────────────────────────────────────────
  const handleCheckOut = async () => {
    if (!empId) return
    try {
      const sessionMs = checkInTime ? Date.now() - checkInTime : 0
      const res = await api.post(`/attendance/check_out/${empId}/session_out`)
      if (res.data?.success) {
        const newTotal = (totalWorkedMs ?? 0) + sessionMs
        dispatch(setCheckOut({ sessionMs }))
        saveWorkedMs(newTotal)
        toast({ title: "🔴 Checked Out", description: "See you tomorrow!" })
      }
    } catch (err) { console.error(err) }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  const performLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutAction()
    } catch {
      setIsLoggingOut(false)
    }
  }

  // ─── Time calculations ────────────────────────────────────────────────────
  const remainingTime = getShiftRemainingMs()

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60
    const min = Math.floor(ms / 60000) % 60
    const hr  = Math.floor(ms / 3600000)
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const date = currentTime.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
  })
  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Kolkata",
  })

  // ─── Guards ───────────────────────────────────────────────────────────────
  if (isLoggingOut) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <CompanySpinner />
    </div>
  )

  if (!isInitialized) return (
    <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50">
      <div className="w-[95%] h-16 bg-white/20 animate-pulse rounded-2xl border border-white/10 shadow-lg" />
    </div>
  )

  const showTimer = TIMER_ROLES.includes(role)

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg flex items-center justify-between px-6">

        {/* Logo */}
        <div
          className="text-sm font-bold text-[#5A0F2E] cursor-pointer tracking-wide shrink-0"
          onClick={() => router.push("/")}
        >
          Bheema InfoTech
        </div>

        {/* Center */}
        <div className="flex items-center justify-center flex-1 px-4">
          {showTimer ? (

            /* ── Glassmorphic Timer Pill ── */
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-2 shadow-[0_2px_16px_rgba(90,15,46,0.07),inset_0_1px_0_rgba(255,255,255,0.9)]">

              {/* Animated status dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isCheckedIn ? "bg-green-400" : "bg-yellow-400"}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isCheckedIn ? "bg-green-500" : "bg-yellow-500"}`} />
              </span>

              {/* Status label */}
              <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${isCheckedIn ? "text-green-700" : "text-yellow-700"}`}>
                {isCheckedIn ? "Remaining" : "Paused"}
              </span>

              {/* Divider */}
              <div className="w-px h-4 bg-[#5A0F2E]/10 shrink-0" />

              {/* Timer digits */}
              <span className="font-mono text-[15px] font-bold tracking-wider text-[#3b0764] tabular-nums shrink-0">
                {isCheckedIn ? formatTime(remainingTime) : formatTime(totalWorkedMs)}
              </span>

              {/* Divider */}
              <div className="w-px h-4 bg-[#5A0F2E]/10 shrink-0" />

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                {isCheckedIn ? (
                  <>
                    {/* Pause */}
                    <IconTooltip
                      label="Pause (lunch / break)"
                      icon={
                        <button
                          onClick={handlePause}
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-amber-200 bg-amber-50/70 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                        >
                          <Pause size={12} fill="currentColor" />
                        </button>
                      }
                    />

                    {/* Check Out */}
                    <IconTooltip
                      label="Check Out (end of day)"
                      icon={
                        <button
                          onClick={handleCheckOut}
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-red-200 bg-red-50/70 text-red-500 hover:bg-red-100 hover:border-red-300 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                        >
                          <LogOut size={12} />
                        </button>
                      }
                    />
                  </>
                ) : (
                  /* Resume / Check In */
                  <IconTooltip
                    label={totalWorkedMs > 0 ? "Resume" : "Check In"}
                    icon={
                      <button
                        onClick={handleCheckIn}
                        className="flex items-center justify-center w-7 h-7 rounded-lg border border-green-200 bg-green-50/70 text-green-600 hover:bg-green-100 hover:border-green-300 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                      >
                        <LogIn size={12} />
                      </button>
                    }
                  />
                )}
              </div>
            </div>

          ) : (
            /* Date + time for admin / system-admin */
            <div className="flex flex-col items-center leading-tight">
              <span className="text-xs font-semibold text-gray-700 bg-white/40 px-4 py-1 rounded-full backdrop-blur border">{date}</span>
              <span className="text-xs mt-1 font-mono tracking-wide">{time}</span>
            </div>
          )}
        </div>

        {/* Right: user info + avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-[#5A0F2E] uppercase">
              {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.name || "User"}
            </span>
            <span className="text-[10px] text-[#5A0F2E]">{user?.email}</span>
            <span className="text-[10px] text-[#5A0F2E] uppercase">{user?.role}</span>
          </div>

          <DropdownMenu>
            {showTimer ? (
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Avatar className="cursor-pointer border hover:scale-105 transition">
                      <AvatarImage
                        src={user?.profile_image || user?.profile_url || user?.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {(user?.first_name || user?.name || role).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="end"
                    sideOffset={10}
                    className="w-auto border-none bg-transparent shadow-none -translate-x-6"
                  >
                    <EmployeeIDCard user={user} checkInTime={checkInTime} />
                  </HoverCardContent>
                </HoverCard>

                <GlobalSupportModal />

                <button
                  onClick={performLogout}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/60 bg-white/50 backdrop-blur text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:scale-105 active:scale-95 transition-all duration-150"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border hover:scale-105 transition">
                    <AvatarImage
                      src={user?.profile_image || user?.profile_url || user?.avatar}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {(user?.first_name || user?.name || role).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={performLogout}
                    className="cursor-pointer text-red-500 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </>
            )}
          </DropdownMenu>
        </div>

      </nav>
    </div>
  )
}