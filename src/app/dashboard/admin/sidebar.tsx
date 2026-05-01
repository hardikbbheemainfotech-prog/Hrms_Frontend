"use client"

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdOutlineManageAccounts, MdOutlinePersonAdd, MdOutlinePolicy  } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import {
  Home,
  Calendar,
  Users,
  UsersRound,
} from "lucide-react";
import IconTooltip from "@/components/ui/IconTooltip";


const navItems = [
  { href: "/dashboard/admin", icon: Home, label: "Home" },
  { href: "/dashboard/admin/team", icon: RiTeamLine, label: "Create Team" },
  { href: "/dashboard/admin/add-staff", icon: MdOutlinePersonAdd, label: "Add Staff" },
  { href: "/dashboard/admin/allemployees", icon: UsersRound, label: "All Employees" },
  { href: "/dashboard/admin/manage-team", icon: MdOutlineManageAccounts, label: "Manage Team" },
  { href: "/dashboard/admin/manage-policies", icon: MdOutlinePolicy, label: "Manage Policies" },
];
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-screen bg-[#ACC8A2]/70 rounded flex items-center -mt-12 px-4">
      <div className="w-20 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl flex flex-col items-center gap-6 border border-gray-200">

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-6">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

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
                                  className="group relative w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer"
                                >
                                  {/* Ripple effect */}
                                  <span className="absolute inset-0 rounded-2xl bg-blue-500/10 scale-0 group-hover:scale-150 transition-transform duration-500"></span>
              
                                  {/* Liquid glow effect */}
                                  <span className="absolute w-10 h-10 bg-white/90 rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></span>
              
                                  {/* Main Icon Container */}
                                  <div
                                    className={`relative z-10 flex items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
                                      isActive
                                        ? "bg-[#465e3e] text-white shadow-md"
                                        : "bg-[#ACC8A2]/30 group-hover:bg-[#1A2517]"
                                    }`}
                                  >
                                    <Icon
                                      className={`w-5 h-5 ${
                                        isActive
                                          ? "text-white"
                                          : "text-gray-900 group-hover:text-white"
                                      }`}
                                    />
                                  </div>
                                </div>
                              }
                            />
            );
          })}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}