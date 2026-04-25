"use client"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/useLogout"
// AvatarImage import kiya
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
  
  // Auth state se user data nikala
  const { user } = useSelector((state: any) => state.auth)
  const { duration } = useSelector((state: any) => state.employeeSession)
  const logoutAction = useLogout()

  // --- REVERSE TIMER LOGIC ---
  const TOTAL_SHIFT_MS = 8 * 60 * 60 * 1000; 
  const remainingTime = Math.max(0, TOTAL_SHIFT_MS - (duration || 0));

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60
    const min = Math.floor(ms / 60000) % 60
    const hr = Math.floor(ms / 3600000)
    return `${hr.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
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
    <nav className="w-full bg-[#1A2517] border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
      
      {/* LEFT: Logo & Links */}
      <div className="flex items-center gap-8">
        <div className="text-lg font-bold text-[#ACC8A2] cursor-pointer" onClick={() => router.push("/")}>
          Bheema InfoTech
        </div>

        {role !== "employee" && (
          <div className="hidden md:flex items-center gap-6">
            {currentNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#ACC8A2] ${
                  pathname === item.href ? "text-[#ACC8A2] border-b-2 border-[#ACC8A2]" : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CENTER: Countdown Timer */}
      {role === "employee" && (
        <div className="flex flex-col items-center">
          <div className="text-[#ACC8A2] font-mono text-base bg-[#ACC8A2]/10 px-5 py-1.5 rounded-full border border-[#ACC8A2]/30 flex items-center gap-3 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${remainingTime > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${remainingTime > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="tracking-widest font-bold">{formatTime(remainingTime)}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Time Remaining</p>
        </div>
      )}

      {/* RIGHT: User Info & Avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2 text-right">
          <span className="text-sm font-bold text-white tracking-wide uppercase">
            {user?.name || "User"}
          </span>
          <span className="text-[10px] font-medium text-[#ACC8A2] uppercase tracking-tighter">
            {role}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-[#ACC8A2]/20 hover:border-[#ACC8A2]/50 transition-all">
             
              <AvatarImage 
                src={ user?.profile_url} 
                alt={user?.name || "User Avatar"} 
                className="object-cover"
              />
              <AvatarFallback className="bg-[#ACC8A2] text-[#1A2517] font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 mt-2 bg-white">
            <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase border-b mb-1">
              Account Management
            </div>
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logoutAction} className="text-red-600 cursor-pointer font-medium focus:bg-red-50">
              Logout System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </nav>
  )
}