"use client"

import React from "react"
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
import { navigate } from "next/dist/client/components/segment-cache/navigation"

type Props = {
  role: "hr" | "founder" | "admin" | "employee"
}

export default function Navbar({ role }: Props) {
  const router = useRouter()
  const { user, isInitialized } = useSelector((state: any) => state.auth)
  const logoutAction = useLogout()

  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const loginTime = user?.loginTime
  const elapsed = loginTime ? Date.now() - loginTime : 0
  const TOTAL_SHIFT_MS = 8 * 60 * 60 * 1000
  const remainingTime = Math.max(0, TOTAL_SHIFT_MS - elapsed)

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

  if (!isInitialized) {
    return (
      <div className="w-full flex justify-center bg-[#ACC8A2]/70 p-3 sticky top-0 z-50">
        <div className="w-[95%] h-16 bg-white/20 animate-pulse rounded-2xl border border-white/10 shadow-lg" />
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center bg-[#ACC8A2]/70 p-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg flex items-center justify-between px-6">
        
        {/* LEFT */}
        <div
          className="text-sm font-bold text-gray-700 cursor-pointer tracking-wide"
          onClick={() => router.push("/")}
        >
          Bheema InfoTech
        </div>

        {/* CENTER */}
        <div className="flex items-center justify-center flex-1">
          
          {/* Employee + HR Timer */}
          {(role === "employee" || role === "hr") ? (
            <div className="flex flex-col items-center">
              <div className="text-gray-700 font-mono text-sm bg-white/40 backdrop-blur px-4 py-1 rounded-full border flex items-center gap-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      remainingTime > 0 ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      remainingTime > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                </span>

                <span className="tracking-widest font-semibold">
                  {formatTime(remainingTime)}
                </span>
                  <IconTooltip
  label="Logout"
  icon={
    <span
      onClick={logoutAction}
      className="ripple cursor-pointer px-3 py-2 rounded-xl text-sm text-red-500 border border-transparent hover:bg-red-50 hover:border-red-500 transition-all duration-300 flex items-center justify-center"
    >
      <LogOut size={16} />
    </span>
  }
/>
              </div>
            </div>
          ) : (
            /* Founder + Admin DateTime */
            <div className="flex flex-col items-center leading-tight">
              <span className="text-xs font-semibold text-gray-700 bg-white/40 px-4 py-1 rounded-full backdrop-blur border">
                {date}
              </span>
              <span className="text-xs text-gray-500 mt-1 font-mono tracking-wide">
                {time}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
       <div className="flex items-center gap-3">

  <div className="hidden sm:flex flex-col items-end text-right">
    <span className="text-xs font-semibold text-gray-700 uppercase">
      {user?.first_name
        ? `${user.first_name} ${user.last_name || ""}`
        : user?.name || "User"}
    </span>

    <span className="text-[10px] text-gray-400 uppercase">
      {role}
    </span>
  </div>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar
      className="cursor-pointer border hover:scale-105 transition"
      onClick={() => router.push("/dashboard/employee/profile")}
    >
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

  {(role === "founder" || role === "admin") && (
    <DropdownMenuContent align="end" className="w-40">
      <DropdownMenuItem
        onClick={logoutAction}
        className="cursor-pointer text-red-500 focus:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  )}
</DropdownMenu>
</div>
      </nav>
    </div>
  )
}