"use client"

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  Settings,
  BarChart2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/humanresources/attendance", icon: Home },
  { href: "/dashboard/humanresources/employees", icon: Users },
  { href: "/dashboard/humanresources/leave_request", icon: Calendar  },
  { href: "/dashboard/employee/profile", icon: BarChart2 },
  { href: "/dashboard/employee/profile", icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-screen flex items-center px-4">
      <div className="w-20 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl flex flex-col items-center gap-6 border border-gray-200">

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-6">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={index}
                onClick={() => router.push(item.href)}
                className="group relative w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden"
              >
                {/* Ripple */}
                <span className="absolute inset-0 rounded-2xl bg-blue-500/10 scale-0 group-hover:scale-150 transition-transform duration-500"></span>

                {/* Liquid glow */}
                <span className="absolute w-10 h-10 bg-white/90 rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></span>

                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-full h-full rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#465e3e] text-white shadow-md"
                      : "bg-[#ACC8A2]/30 group-hover:bg-[#1A2517]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-900"} group-hover:text-white`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}