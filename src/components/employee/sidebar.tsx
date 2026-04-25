"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, Clock, User, ChevronLeft, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const items = [
    { label: "My Work", href: "/dashboard/employee", icon: Home },
    { label: "Tasks", href: "/dashboard/employee/tasks", icon: ClipboardList },
    { label: "Attendance", href: "/dashboard/employee/attendance", icon: Clock },
    { label: "Profile", href: "/dashboard/employee/profile", icon: User }
  ]

  return (
    <aside 
      className={`relative h-full bg-[#1A2517] text-[#ACC8A2] transition-all duration-300 ease-in-out border-r border-white/5 
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#ACC8A2] text-[#1A2517] rounded-full p-1 border-2 border-[#1A2517] z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="space-y-2 p-4 mt-4">
        {items.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={i}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                ${isActive 
                    ? "bg-[#ACC8A2] text-[#1A2517] font-bold shadow-lg shadow-[#ACC8A2]/20" 
                    : "hover:bg-[#ACC8A2]/10 text-gray-400 hover:text-[#ACC8A2]"
                }`}
            >
              <div className="min-w-[20px]">
                <Icon size={20} className={`${isActive ? "animate-pulse" : ""}`} />
              </div>
              
              <span className={`whitespace-nowrap transition-opacity duration-300 
                ${isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"}`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}