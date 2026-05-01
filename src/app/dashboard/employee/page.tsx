"use client"

import RoleGuard from "@/components/shared/RoleGuard"
import AnnouncementsPanel from "./components/Announcement"

export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={["employee"]}>
<div className=" no-scrollbar overflow-hidden bg-[#F1E9E4]/70 p-6">
  <div className="h-full overflow-y-auto no-scrollbar">
    <div className="bg-[#F1E9E4]/90 h-screen rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 flex flex-col">
    <AnnouncementsPanel/>
   
  </div>
  </div>
</div>
    </RoleGuard>
  )
}