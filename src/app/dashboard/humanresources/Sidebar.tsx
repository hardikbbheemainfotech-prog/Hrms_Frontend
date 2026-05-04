"use client"
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Settings,
  CalendarCheck,
  ClipboardList,
  UserPlus,
  Book ,
  BriefcaseBusiness 
} from "lucide-react";
import IconTooltip from "@/components/ui/IconTooltip";

const navItems = [
  { href: "/dashboard/humanresources/Home", icon: Home, label: "Home" },
  { href: "/dashboard/humanresources/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/dashboard/humanresources/requests", icon: ClipboardList, label: "Employee Requests" },
  { href: "/dashboard/humanresources/employees", icon: UserPlus, label: "Employees" },
 { href: "/dashboard/humanresources/desk", icon: Book, label: "Desk" },
  { href: "/dashboard/humanresources/Jobs", icon: BriefcaseBusiness, label: "Jobs" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
  
     <div className="h-screen flex bg-[#F1E9E4]/70 items-center px-4">
      <div className="w-20 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl flex flex-col items-center gap-1 border border-gray-200  py-8">

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-4">
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
                                     ? "bg-[#5A0F2E] text-white shadow-md"
                                     : "bg-[#F1E9E4]/30 group-hover:bg-[#5A0F2E]"
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
                       )

          })}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}