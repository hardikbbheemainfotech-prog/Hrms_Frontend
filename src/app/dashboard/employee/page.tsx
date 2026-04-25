"use client"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, Calendar, User } from "lucide-react"

export default function EmployeeDashboard() {
  const stats = [
    { title: "Tasks Completed", value: "24", icon: CheckCircle },
    { title: "Pending Tasks", value: "6", icon: Clock },
    { title: "Attendance", value: "96%", icon: Calendar },
    { title: "Profile Status", value: "Complete", icon: User },
  ]

  return (
    <>
    <RoleGuard allowedRoles={["employee"]} >
      <div className="p-8 bg-[#ACC8A2]/70 min-h-screen space-y-8">

      </div>
      </RoleGuard>
    </>
  )
}