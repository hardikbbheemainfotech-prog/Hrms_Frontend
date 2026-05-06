"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Clock, BarChart, MailIcon } from "lucide-react"
import ManagerTasks from "./components/ManagerTasks"
import AnnouncementsPanel from "../humanresources/hr-components/AnnouncementsPanel"
import { Mail } from "./components/mailSection/Mail"
import { Button } from "@/components/ui/button"
import { useAdminData } from "@/hooks/adminData"
import AuditLogsAdmin from "./components/AuditLogsAdmin"

export default function AdminDashboard() {
  const [open, setOpen] = useState(false)

  const {
    employees,
    departments,
    loadingEmployees,
    loadingDepartments,
    getEmployeeById,
  } = useAdminData()

  const stats = [
    { title: "Team Members", value: "12", icon: Users },
    { title: "Tasks Completed", value: "86", icon: CheckCircle },
    { title: "Pending Tasks", value: "14", icon: Clock },
    { title: "Performance", value: "92%", icon: BarChart },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F1E9E4]/60">

      <div className="p-6 space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#5A0F2E]">
            Admin Dashboard
          </h1>
        </div>


         <AuditLogsAdmin/>
        <AnnouncementsPanel />

        <Card >
             <div className="flex items-center justify-between p-2 ">
          <div className="flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-[#5A0F2E]" />
            <h3 className="text-sm font-black text-gray-800">Compose Mail to Employee</h3>
          </div>

          <Button
              onClick={() => setOpen(true)}
             
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#5A0F2E] hover:bg-[#5A0F2E]/90 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Send Mail
            </Button>
        </div>
        </Card>

        <ManagerTasks />

      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* MAIL PANEL */}
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <Mail
                employees={employees}
                departments={departments}
                loadingEmployees={loadingEmployees}
                loadingDepartments={loadingDepartments}
                getEmployeeById={getEmployeeById}
                onFormChange={() => {}}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  )
}