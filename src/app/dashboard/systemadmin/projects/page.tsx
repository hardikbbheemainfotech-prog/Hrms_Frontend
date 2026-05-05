// src/app/dashboard/systemadmin/projects/page.tsx

"use client"

import React from "react"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
  Users,
} from "lucide-react"

const projectStats = [
  {
    title: "Total Projects",
    value: "18",
    icon: FolderKanban,
  },
  {
    title: "Completed",
    value: "9",
    icon: CheckCircle2,
  },
  {
    title: "In Progress",
    value: "6",
    icon: Clock3,
  },
  {
    title: "Delayed",
    value: "3",
    icon: AlertTriangle,
  },
]

const projectList = [
  {
    name: "HRMS Web Portal",
    team: "Development Team",
    deadline: "20 May 2026",
    progress: 78,
    status: "In Progress",
  },
  {
    name: "Recruitment Automation",
    team: "HR Team",
    deadline: "10 June 2026",
    progress: 45,
    status: "In Progress",
  },
  {
    name: "Payroll Optimization",
    team: "Finance Team",
    deadline: "28 April 2026",
    progress: 100,
    status: "Completed",
  },
  {
    name: "Employee Wellness App",
    team: "UI/UX Team",
    deadline: "15 May 2026",
    progress: 22,
    status: "Delayed",
  },
]

export default function ProjectsPage() {
  return (
    
      <div className="h-screen flex flex-col bg-[#ACC8A2]/20 overflow-hidden">
     

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#5A0F2E]">
                Projects & Productivity
              </h1>
              <p className="text-gray-600 mt-1">
                Track organizational projects, progress, deadlines, and team productivity
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#5A0F2E] text-white px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {projectStats.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <h2 className="text-3xl font-bold text-[#5A0F2E] mt-2">
                        {item.value}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-[#5A0F2E]/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#5A0F2E]" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Project Table */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#5A0F2E]">
                Active Projects
              </h2>

              <button className="text-sm text-[#5A0F2E] font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-5">
              {projectList.map((project, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-[#F9F6F3]/80 hover:bg-[#F1E9E4] transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {project.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.team}
                        </span>

                        <span>
                          Deadline: {project.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-start lg:items-end gap-2 min-w-[220px]">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : project.status === "Delayed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>

                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5A0F2E] rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {project.progress}% Completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}