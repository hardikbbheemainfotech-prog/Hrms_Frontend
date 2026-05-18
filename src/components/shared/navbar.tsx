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
import { LogIn, LogOut } from "lucide-react"
import IconTooltip from "../ui/IconTooltip"
import EmployeeIDCard from "../shared/EmployeeIDCard"
import GlobalSupportModal from "@/app/dashboard/employee/components/GlobalSupportModal"
import { useToast } from "@/hooks/use-toast"
import CompanySpinner from "./loader/spinner"
import api from "@/lib/axios"
import {
  setCheckIn,
  setCheckOut,
  resetAttendance
} from "@/feature/attendance/attendanceSlice"

type Props = {
  role: "hr" | "system-admin" | "admin" | "employee"
}

export default function Navbar({ role }: Props) {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const router = useRouter()
  const { user, isInitialized } = useSelector((state: any) => state.auth)
  const logoutAction = useLogout()
  const { toast } = useToast()
  const dispatch = useDispatch()
  
  const { isCheckedIn, checkInTime, totalWorkedMs } = useSelector(
    (state: any) => state.attendance
  )
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const empId = user?.employee_id;

  const performLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutAction()
    } catch (error) {
      setIsLoggingOut(false)
    }
  }


const handleCheckOut = async () => {
  if (!empId) return
  try {
    const sessionMs = checkInTime ? Date.now() - checkInTime : 0
    const res = await api.post(`/attendance/check_out/${empId}/session_out`)
    if (res.data?.success) {
      dispatch(setCheckOut({ sessionMs }))
      toast({ title: "Checked Out", description: "Session Paused" })
    }
  } catch (err) {
    console.error(err)
  }
}

const handleCheckIn = async () => {
  try {
    const res = await api.post(`/attendance/check_in/${empId}/session_in`)
    if (res.data?.success) {
      dispatch(setCheckIn({
        time: new Date(res.data.data.check_in).getTime(), 
        id: res.data.data.attendance_id,
      }))
      toast({ title: "Checked In" })
    }
  } catch (err) {
    console.error(err)
  }
}

const SHIFT_MS = 8 * 60 * 60 * 1000
const currentSessionMs = isCheckedIn && checkInTime ? Date.now() - checkInTime : 0
const totalWorked = (totalWorkedMs ?? 0) + currentSessionMs
const remainingTime = Math.max(0, SHIFT_MS - totalWorked)

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60
    const min = Math.floor(ms / 60000) % 60
    const hr = Math.floor(ms / 3600000)
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }



useEffect(() => {
  if (!empId) return

  const syncAttendanceStatus = async () => {
    try {
      const res = await api.get(`/attendance/status/${empId}`)
      if (!res.data?.success) return

      const { is_checked_in, check_in, attendance_id } = res.data.data
      const checkInDate = new Date(check_in).toDateString()
      const today = new Date().toDateString()
      const isTodayCheckIn = checkInDate === today

      if (is_checked_in && isTodayCheckIn) {
        dispatch(setCheckIn({
          time: new Date(check_in).getTime(),
          id: attendance_id,
        }))
      } else {
        dispatch(resetAttendance())
      }
    } catch (err) {
      console.error("Attendance sync failed:", err)
    }
  }

  syncAttendanceStatus()
}, [empId])

  useEffect(() => {
    const lastDate = localStorage.getItem("last_attendance_date")
    const today = new Date().toDateString()
    if (lastDate !== today) {
      dispatch(resetAttendance())
      localStorage.setItem("last_attendance_date", today)
    }
  }, [dispatch])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { date, time } = (() => {
    return {
      date: currentTime.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      time: currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }),
    }
  })()

  if (isLoggingOut) return <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"><CompanySpinner /></div>
  if (!isInitialized) return <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50"><div className="w-[95%] h-16 bg-white/20 animate-pulse rounded-2xl border border-white/10 shadow-lg" /></div>

  return (
    <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg flex items-center justify-between px-6">
        <div className="text-sm font-bold text-[#5A0F2E] cursor-pointer tracking-wide" onClick={() => router.push("/")}>
          Bheema InfoTech
        </div>

        <div className="flex items-center justify-center flex-1">
          {(role === "employee" || role === "hr") ? (
            <div className="flex flex-col items-center">
             <div className="text-gray-700 font-mono text-sm bg-white/40 backdrop-blur px-4 py-1 rounded-full border flex items-center gap-2 shadow-sm">
  <span className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCheckedIn ? "bg-green-400" : "bg-yellow-400"}`} />
    <span className={`relative inline-flex rounded-full h-2 w-2 ${isCheckedIn ? "bg-green-500" : "bg-yellow-500"}`} />
  </span>


  <span className="tracking-widest font-semibold">
    {isCheckedIn 
      ? `Remaining: ${formatTime(remainingTime)}` 
      : `Worked: ${formatTime(totalWorkedMs)}`
    }
  </span>

  <IconTooltip
    label={isCheckedIn ? "Check Out" : "Check In"}
    icon={isCheckedIn ? (
      <span onClick={handleCheckOut} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"><LogOut size={16} /></span>
    ) : (
      <span onClick={handleCheckIn} className="px-3 py-2 rounded-xl text-green-500 hover:bg-green-50 cursor-pointer"><LogIn size={16} /></span>
    )}
  />
</div>
            </div>
          ) : (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-xs font-semibold text-gray-700 bg-white/40 px-4 py-1 rounded-full backdrop-blur border">{date}</span>
              <span className="text-xs mt-1 font-mono tracking-wide">{time}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-[#5A0F2E] uppercase">{user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.name || "User"}</span>
            <span className="text-[10px] text-[#5A0F2E]">{user?.email}</span>
            <span className="text-[10px] text-[#5A0F2E] uppercase">{user?.role}</span>
          </div>
          <DropdownMenu>
            {(role === "employee" || role === "hr") ? (
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
    className="flex items-center justify-center rounded-xl border bg-white/50 backdrop-blur px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
    title="Logout"
  >
    <LogOut size={18} />
  </button>
</div>
            ) : (
              <>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border hover:scale-105 transition">
                    <AvatarImage src={user?.profile_image || user?.profile_url || user?.avatar} className="object-cover" />
                    <AvatarFallback>{(user?.first_name || user?.name || role).charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={performLogout} className="cursor-pointer text-red-500 focus:text-red-600">
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