
"use client"

import React from "react"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import {
  BarChart3,
  Users,
  Wallet,
  ClipboardCheck,
  TrendingUp,
  Download,
  CalendarDays,
  FileText,
} from "lucide-react"

const reportStats = [
  {
    title: "Total Employees",
    value: "248",
    icon: Users,
  },
  {
    title: "Monthly Payroll",
    value: "₹13.5L",
    icon: Wallet,
  },
  {
    title: "Attendance Rate",
    value: "94%",
    icon: ClipboardCheck,
  },
  {
    title: "Growth Rate",
    value: "+18%",
    icon: TrendingUp,
  },
]

const reportsList = [
  {
    title: "Employee Performance Report",
    category: "Performance",
    generated: "05 May 2026",
    status: "Ready",
  },
  {
    title: "Payroll Summary - April 2026",
    category: "Finance",
    generated: "01 May 2026",
    status: "Ready",
  },
  {
    title: "Attendance & Leave Analysis",
    category: "HR Analytics",
    generated: "03 May 2026",
    status: "Processing",
  },
  {
    title: "Recruitment Funnel Report",
    category: "Recruitment",
    generated: "04 May 2026",
    status: "Ready",
  },
]

export default function ReportsPage() {
  return (
      <div className="h-screen flex flex-col bg-[#ACC8A2]/20 overflow-hidden">
       

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#5A0F2E]">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Centralized insights into workforce, payroll, productivity, and organizational performance
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#5A0F2E] text-white px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all">
              <Download className="w-5 h-5" />
              Export Reports
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {reportStats.map((item, index) => {
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

          {/* Reports Table */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-[#5A0F2E]">
                Generated Reports
              </h2>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4" />
                Latest Analytics
              </div>
            </div>

            <div className="space-y-4">
              {reportsList.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-3xl bg-[#F9F6F3]/80 hover:bg-[#F1E9E4] transition-all"
                >
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#5A0F2E]/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#5A0F2E]" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{report.category}</span>
                        <span>Generated: {report.generated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        report.status === "Ready"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#5A0F2E] text-white hover:scale-105 transition-all">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="mt-8 bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-7 h-7 text-[#5A0F2E]" />
              <h2 className="text-2xl font-semibold text-[#5A0F2E]">
                Analytics Overview
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Reports & Analytics gives founders and system administrators a strategic view of organizational health by combining HR, payroll, recruitment, and productivity metrics. This section helps identify workforce trends, optimize resource allocation, monitor operational efficiency, and support data-driven decisions for future growth.
            </p>
          </div>
        </div>
      </div>
  )
}