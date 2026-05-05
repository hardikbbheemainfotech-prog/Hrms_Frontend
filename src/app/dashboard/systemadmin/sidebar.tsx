"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  FolderInput,
  ClipboardList,
  Clock,
  Briefcase,
  Wallet,
  FolderKanban,
  BarChart3,
} from "lucide-react"
import IconTooltip from "@/components/ui/IconTooltip"
const baseRoute = "/dashboard/systemadmin"

const navItems = [
  { href: `${baseRoute}`, icon: Home, label: "Home" },
  { href: `${baseRoute}/recruitment`, icon: Briefcase, label: "Recruitment" },
  { href: `${baseRoute}/payroll-finance`, icon: Wallet, label: "Payroll & Finance" },
  { href: `${baseRoute}/projects`, icon: FolderKanban, label: "Projects / Productivity" },
  { href: `${baseRoute}/reports`, icon: BarChart3, label: "Reports & Analytics" },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="h-screen flex bg-[#F1E9E4]/70 items-center px-4">
      <div className="w-20 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl flex flex-col items-center gap-6 border border-gray-200 py-8">

        {/* Top Spacer */}
        <div className="flex-1" />

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-5 overflow-y-auto no-scrollbar">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <IconTooltip
                key={index}
                label={item.label}
                icon={
                  <div
                    onClick={() => router.push(item.href)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(item.href)
                      }
                    }}
                    className="group relative w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  >
                    {/* Ripple Effect */}
                    <span className="absolute inset-0 rounded-2xl bg-[#5A0F2E]/10 scale-0 group-hover:scale-150 transition-transform duration-500" />

                    {/* Liquid Glow */}
                    <span className="absolute w-10 h-10 bg-white/90 rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />

                    {/* Main Button */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-[#5A0F2E] text-white shadow-lg scale-105"
                          : "bg-[#F1E9E4]/30 group-hover:bg-[#5A0F2E]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-900 group-hover:text-white"
                        }`}
                      />
                    </div>
                  </div>
                }
              />
            )
          })}
        </div>

        {/* Bottom Spacer */}
        <div className="flex-1" />
      </div>
    </div>
  )
}