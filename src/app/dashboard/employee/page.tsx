<<<<<<< HEAD
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
=======
// src/app/dashboard/employee/page.tsx
"use client"
import Navbar from "@/components/shared/navbar"
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
>>>>>>> 0958281 (hr)
}