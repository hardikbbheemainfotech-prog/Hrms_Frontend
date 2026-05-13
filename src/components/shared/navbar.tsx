"use client"

import React from "react"
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
import { useSelector } from "react-redux"
import { LogOut } from "lucide-react"
import IconTooltip from "../ui/IconTooltip"
import EmployeeIDCard from "../shared/EmployeeIDCard"
import GlobalSupportModal from "@/app/dashboard/employee/components/GlobalSupportModal"
import { useToast } from "@/hooks/use-toast"
import CompanySpinner from "./loader/spinner"

type Props = {
  role: "hr" | "system-admin" | "admin" | "employee"
}

export default function Navbar({ role }: Props) {
  const [canLogout, setCanLogout] = React.useState(role !== "employee")
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const router = useRouter()
  const { user, isInitialized } = useSelector((state: any) => state.auth)
  const logoutAction = useLogout()
  const [, setTick] = React.useState(0)
  const { toast } = useToast()

  const hasSubmittedTodayTask = () => {
    const submitted = localStorage.getItem("dailyTaskSubmitted")
    const submittedDate = localStorage.getItem("dailyTaskDate")
    const today = new Date().toDateString()

    return submitted === "true" && submittedDate === today
  }

  const performLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutAction()
    } catch (error) {
      setIsLoggingOut(false)
    }
  }

  const handleProtectedLogout = async () => {
    if (role === "employee" && !hasSubmittedTodayTask()) {
      toast({
        variant: "destructive",
        title: "Task Required",
        description: "Please submit your daily task before logout.",
      })
      return
    }

    await performLogout()
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (role !== "employee") {
      setCanLogout(true)
      return
    }

    setCanLogout(hasSubmittedTodayTask())
  }, [role])

  React.useEffect(() => {
    const storedDate = localStorage.getItem("dailyTaskDate")
    const today = new Date().toDateString()

    if (storedDate !== today) {
      localStorage.removeItem("dailyTaskSubmitted")
      localStorage.removeItem("dailyTaskDate")
    }
  }, [])

  React.useEffect(() => {
    const today = new Date().toDateString()

    if (user?.loginDate && user.loginDate !== today) {
      performLogout()
      return
    }

    const now = new Date()
    const nextMidnight = new Date()

    nextMidnight.setHours(24, 0, 0, 0)

    const msUntilMidnight = nextMidnight.getTime() - now.getTime()

    const midnightTimer = setTimeout(() => {
      performLogout()
    }, msUntilMidnight)

    return () => clearTimeout(midnightTimer)
  }, [user?.loginDate])

  // FULL DEBUG VERSION — paste this exact block

const TOTAL_SHIFT_MS = 8 * 60 * 60 * 1000

let sessionLoginTime: number = Date.now()

if (typeof window !== "undefined") {
  try {
    // RAW localStorage check
    const rawPersist = localStorage.getItem("persist:root")
    console.log("RAW persist:root =>", rawPersist)

    if (rawPersist) {
      const persistRoot = JSON.parse(rawPersist)
      console.log("Parsed persistRoot =>", persistRoot)

      // employee session
      if (persistRoot.employeeSession) {
        const employeeSession = JSON.parse(persistRoot.employeeSession)

        console.log("Employee Session =>", employeeSession)

        if (
          employeeSession?.loginTime &&
          !isNaN(Number(employeeSession.loginTime))
        ) {
          sessionLoginTime = Number(employeeSession.loginTime)
          console.log("Using employeeSession.loginTime =>", sessionLoginTime)
        }
      }

      // fallback auth loginTime
      else if (user?.loginTime) {
        sessionLoginTime = Number(user.loginTime)
        console.log("Using user.loginTime =>", sessionLoginTime)
      }

      else {
        console.log("No valid loginTime found, fallback Date.now()")
      }
    }
  } catch (err) {
    console.error("Login time parse failed:", err)
  }
}

// Safety
if (sessionLoginTime > Date.now()) {
  console.log("Future loginTime detected, resetting")
  sessionLoginTime = Date.now()
}

const elapsed = Date.now() - sessionLoginTime
const remainingTime = Math.max(0, TOTAL_SHIFT_MS - elapsed)

console.log("Final sessionLoginTime =>", sessionLoginTime)
console.log("Elapsed Hours =>", elapsed / 3600000)
console.log("Remaining =>", remainingTime / 3600000)

  const now = new Date()

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60
    const min = Math.floor(ms / 60000) % 60
    const hr = Math.floor(ms / 3600000)

    return `${hr.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const formatCurrentDateTime = () => {
    return {
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }
  }

  const { date, time } = formatCurrentDateTime()

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <CompanySpinner/>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50">
        <div className="w-[95%] h-16 bg-white/20 animate-pulse rounded-2xl border border-white/10 shadow-lg" />
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center bg-[#F1E9E4]/70 p-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg flex items-center justify-between px-6">

        <div
          className="text-sm font-bold text-[#5A0F2E] cursor-pointer tracking-wide"
          onClick={() => router.push("/")}
        >
          Bheema InfoTech 
        </div>

        <div className="flex items-center justify-center flex-1">
          {(role === "employee" || role === "hr") ? (
            <div className="flex flex-col items-center">
              <div className="text-gray-700 font-mono text-sm bg-white/40 backdrop-blur px-4 py-1 rounded-full border flex items-center gap-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      remainingTime > 0 ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      remainingTime > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </span>

                <span className="tracking-widest font-semibold">
                  {formatTime(remainingTime)}
                </span>

                <IconTooltip
                  label={canLogout ? "Check Out" : "Submit daily task first"}
                  icon={
                    <span
                      onClick={handleProtectedLogout}
                      className={`ripple px-3 py-2 rounded-xl text-sm border transition-all duration-300 flex items-center justify-center ${
                        canLogout
                          ? "cursor-pointer text-red-500 hover:bg-red-50 hover:border-red-500"
                          : "cursor-not-allowed text-gray-400 bg-gray-100"
                      }`}
                    >
                      <LogOut size={16} />
                    </span>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-xs font-semibold text-gray-700 bg-white/40 px-4 py-1 rounded-full backdrop-blur border">
                {date}
              </span>
              <span className="text-xs mt-1 font-mono tracking-wide">
                {time}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-[#5A0F2E] uppercase">
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user?.name || "User"}
            </span>
            <span className="text-[10px] text-[#5A0F2E]">
              {user?.email}
            </span>
            <span className="text-[10px] text-[#5A0F2E] uppercase">
              {user?.role}
            </span>
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
                        {(user?.first_name || user?.name || role)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>

                  <HoverCardContent
                    align="end"
                    sideOffset={10}
                    className="w-auto border-none bg-transparent shadow-none -translate-x-6"
                  >
                    <EmployeeIDCard user={user} compact />
                  </HoverCardContent>
                </HoverCard>

                <GlobalSupportModal />
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
                      {(user?.first_name || user?.name || role)
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={performLogout}
                    className="cursor-pointer text-red-500 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
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