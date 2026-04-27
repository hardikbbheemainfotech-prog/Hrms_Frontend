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
  const { user } = useSelector((state: any) => state.auth)
  const { duration } = useSelector((state: any) => state.employeeSession)
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
    <div className="w-full flex justify-center mt-3 sticky top-0 z-50">
      <nav className="w-[95%] h-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg flex items-center justify-between px-6">

        {/* LEFT */}
        <div
          className="text-sm font-bold text-gray-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Bheema InfoTech
        </div>

        {/* CENTER */}
        <div className="flex items-center justify-center flex-1">

          {role === "employee" ? (
            <div className="flex flex-col items-center">
              <div className="text-gray-700 font-mono text-sm bg-white/40 backdrop-blur px-4 py-1 rounded-full border flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${remainingTime > 0 ? "bg-green-400" : "bg-red-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${remainingTime > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                </span>
                <span className="tracking-widest font-semibold">
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              {currentNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ripple px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300
                  ${
                    pathname === item.href
                      ? "bg-white/40 backdrop-blur text-[#1A2517] shadow-sm"
                      : "text-gray-500 hover:text-[#1A2517] hover:bg-white/30"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-gray-700 uppercase">
              {user?.name || "User"}
            </span>
            <span className="text-[10px] text-gray-400 uppercase">
              {role}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border hover:scale-105 transition">
                <AvatarImage src={user?.profile_url} />
                <AvatarFallback>
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : role.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            {/* GLASS DROPDOWN */}
            <DropdownMenuContent
              align="end"
              className="w-52 mt-2 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/30 shadow-xl p-1"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase border-b mb-1">
                Account
              </div>

              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="ripple px-3 py-2 rounded-xl text-sm transition-all hover:bg-white/40"
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logoutAction}
                className="ripple px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </nav>
    </div>
  )
}