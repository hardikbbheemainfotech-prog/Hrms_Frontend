"use client"

import RoleGuard from "@/components/shared/RoleGuard"

export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={["employee"]}>
<div className=" no-scrollbar overflow-hidden bg-[#ACC8A2]/70 p-6">
  <div className="h-full overflow-y-auto no-scrollbar">
   
  </div>
</div>
    </RoleGuard>
  )
}