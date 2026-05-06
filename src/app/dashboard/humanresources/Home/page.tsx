"use client"

import React from "react"
import RoleGuard from "@/components/shared/RoleGuard"
import AnnouncementsPanel from "@/app/dashboard/humanresources/hr-components/AnnouncementsPanel"
import AttendanceCharts from "@/components/shared/AttendanceChart"

import { useAttendanceDashboard } from "@/hooks/Useattendancedashboard"
import {  BirthdayStrip, GreetingHeader } from "../hr-components/Attendancesections"
import { AttendanceTable } from "../hr-components/Attendancetable"
import { AttendanceFilters } from "../hr-components/AttendanceFilters("

export default function AttendancePage() {
  const {
    employees, attendance, birthdays, summary,
    trend, dashboard, loading, filters,
    totalCount, attendancePercent, employeeMap,
    handleFilterChange,
  } = useAttendanceDashboard()

  return (
    <RoleGuard allowedRoles={["hr"]}>
      <div className="min-h-screen p-4 md:p-6 m-3 md:m-5 rounded-2xl space-y-5 bg-[#fdfdfd] border border-[#F1E9E4]/30">

        <AttendanceFilters
          filters={filters}
          employees={employees}
          onFilterChange={handleFilterChange}
        />

        <GreetingHeader
          dashboard={dashboard}
          summary={summary}
          totalCount={totalCount}
          attendancePercent={attendancePercent}
          birthdays={birthdays}
        />

        <BirthdayStrip birthdays={birthdays} />

        <AnnouncementsPanel />

        {/* trend is built locally from attendance rows — no backend trend field needed */}
        <AttendanceCharts trend={trend} loading={loading} />

        <AttendanceTable
          attendance={attendance}
          employeeMap={employeeMap}
          loading={loading}
        />

      </div>
    </RoleGuard>
  )
}