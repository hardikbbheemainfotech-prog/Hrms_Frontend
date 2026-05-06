"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Clock, BarChart } from "lucide-react"
import ManagerTasks from "./components/ManagerTasks"
import AnnouncementsPanel from "../humanresources/hr-components/AnnouncementsPanel"
import { useHRData } from "@/hooks/useHRData"
import { Mail } from "./components/mailSection/Mail"

export default function AdminDashboard() {
  const [open, setOpen] = useState(false)

  const {
    employees,
    interviews,
    departments,
    loadingEmployees,
    loadingInterviews,
    loadingDepartments,
    getEmployeeById,
    getInterviewById,
  } = useHRData()

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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="bg-white/70 backdrop-blur">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-sm text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-[#5A0F2E]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#5A0F2E]">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <AnnouncementsPanel />

        {/* TEAM ACTIVITY */}
        <Card className="bg-white/70">
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-gray-500">
              Track team productivity and performance.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-[#5A0F2E] text-white rounded-lg hover:opacity-90 transition"
            >
              Send Mail
            </button>
          </CardContent>
        </Card>

        <ManagerTasks />

      </div>

      {/* 🔥 MAIL OVERLAY */}
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
                interviews={interviews}
                departments={departments}
                loadingEmployees={loadingEmployees}
                loadingInterviews={loadingInterviews}
                loadingDepartments={loadingDepartments}
                getEmployeeById={getEmployeeById}
                getInterviewById={getInterviewById}
                onFormChange={() => {}}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  )
}