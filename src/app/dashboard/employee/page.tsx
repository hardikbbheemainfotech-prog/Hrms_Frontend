// src/app/dashboard/employee/page.tsx
"use client"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import PostActivity from "./components/shouldbe"

export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={["employee"]}>
<div className=" no-scrollbar overflow-hidden  p-6">
  <PostActivity/>
  <div className="h-full overflow-y-auto no-scrollbar">
   
  </div>
</div>
    </RoleGuard>
  )
}