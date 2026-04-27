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
import { useRouter, usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import Link from "next/link"

type Props = {
  role: "hr" | "founder" | "admin" | "employee"
}

export default function Navbar({ role }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isInitialized } = useSelector((state: any) => state.auth)
  const logoutAction = useLogout()

  const [remainingTime, setRemainingTime] = React.useState(0)
  const [, setTick] = React.useState(0)
  const getSafeLoginTime = React.useCallback(() => {
  if (typeof window === 'undefined') return null;
  const rawTime = user?.login_time || user?.loginTime || localStorage.getItem("shift_start_time");
  
  if (!rawTime) return null;
  const parsedTime = isNaN(Number(rawTime)) 
    ? new Date(rawTime).getTime() 
    : Number(rawTime);

  localStorage.setItem("shift_start_time", parsedTime.toString());

  return parsedTime;
}, [user]);

  React.useEffect(() => {
    if (role !== "employee") return;

    const updateTimer = () => {
      const safeTime = getSafeLoginTime();
      if (safeTime) {
        const TOTAL_SHIFT_MS = 8 * 60 * 60 * 1000;
        const elapsed = Date.now() - safeTime;
        setRemainingTime(Math.max(0, TOTAL_SHIFT_MS - elapsed));
      }
      setTick(t => t + 1);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [role, getSafeLoginTime]);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60
    const min = Math.floor(ms / 60000) % 60
    const hr = Math.floor(ms / 3600000)
    return `${hr.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }
  if (!isInitialized) {
    return (
      <div className="w-full flex justify-center mt-3 sticky top-0 z-50">
        <div className="w-[95%] h-16 bg-gray-50 animate-pulse rounded-2xl border border-gray-200" />
      </div>
    );
  }

  const navItems = {
    hr: [
      { label: "Dashboard", href: "/dashboard/hr" },
      { label: "Employees", href: "/dashboard/hr/employees" },
      { label: "Reports", href: "/dashboard/hr/reports" },
    ],
    founder: [
      { label: "Overview", href: "/dashboard/founder" },
      { label: "Analytics", href: "/dashboard/founder/analytics" },
      { label: "Finance", href: "/dashboard/founder/finance" },
    ],
    admin: [
      { label: "Add Staff", href: "/dashboard/admin/add-staff" },
      { label: "Team", href: "/dashboard/admin/team" },
      { label: "Tasks", href: "/dashboard/admin/tasks" },
      { label: "All Employees", href: "/dashboard/admin/allemployees" }
    ],
    employee: [],
  }

  const currentNav = navItems[role] || []

  return (
    <div className="w-full flex justify-center bg-[#ACC8A2]/70 p-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md flex items-center justify-between px-6">

        {/* LEFT: Logo */}
        <div className="text-sm font-bold text-gray-700 cursor-pointer" onClick={() => router.push("/")}>
          Bheema InfoTech
        </div>

        {/* CENTER: Timer OR Nav */}
        <div className="flex items-center justify-center flex-1">
          {role === "employee" ? (
            <div className="flex flex-col items-center">
              <div className="text-gray-700 font-mono text-sm bg-gray-100 px-4 py-1 rounded-full border flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${remainingTime > 0 ? "bg-green-400" : "bg-red-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${remainingTime > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                </span>
                <span className="tracking-widest font-semibold">{formatTime(remainingTime)}</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              {currentNav.map((item) => (
                <Link key={item.href} href={item.href} className={`text-xs font-medium transition-all ${pathname === item.href ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-gray-700 uppercase">
              {/* Handles both Redux 'name' and API 'first_name' */}
              {user?.name || user?.first_name || "User"}
            </span>
            <span className="text-[10px] text-gray-400 uppercase">{role}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border hover:scale-105 transition overflow-hidden">
                <AvatarImage 
                  src={user?.profile_image || user?.avatar} 
                  alt={user?.first_name || "User"} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  {(user?.first_name || user?.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 mt-2 bg-white">
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase border-b mb-1">Account</div>
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={logoutAction} className="text-red-600 cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </nav>
    </div>
  )
}