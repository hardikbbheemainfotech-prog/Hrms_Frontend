"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import DateRangePicker from "@/app/dashboard/employee/attendance/_components/DateRangePicker"
import LeaveForm from "@/app/dashboard/employee/attendance/_components/LeaveForm"
import AttendanceTable from "@/app/dashboard/employee/attendance/_components/AttendanceTable"
import LeaveSummarySection from "./_components/LeaveSummarySection"
import LeaveHistoryTable from "./_components/LeaveHistoryTable"
import RoleGuard from "@/components/shared/RoleGuard"

type LeavePayload = {
  leave_type_id: number
  start_date: string
  end_date: string
  total_days: number
  reason: string
}

export default function Page() {
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date()
  })

  const [attendance, setAttendance] = useState([])
  const [leaveSummary, setLeaveSummary] = useState([])
  const [leaveStatus, setLeaveStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const res = await api.get("/employee/attendance", {
      params: {
        from: range.from.toISOString().split("T")[0],
        to: range.to.toISOString().split("T")[0],
      }
    })
    setAttendance(res.data.data || [])
  }

  const fetchLeaveSummary = async () => {
    const res = await api.get("/employee/leave_summary")
    setLeaveSummary(res.data?.data?.data || [])
  }

  const fetchLeaveStatus = async () => {
    try {
      const res = await api.get("/employee/leave_status")
      console.log("leave status:", res.data)

      setLeaveStatus(res.data?.data?.data || [])
    } catch (e) {
      console.error("leave status error", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [range])

  useEffect(() => {
    fetchLeaveSummary()
  }, [])

  useEffect(() => {
    fetchLeaveStatus()
  }, [])

  const formatTime = (t?: string | null) =>
    t
      ? new Date(t).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "--"

  return (
    <>
    <RoleGuard allowedRoles={["employee"]}>
    <div className="p-8 space-y-6">

      <LeaveSummarySection data={leaveSummary} />

      <DateRangePicker range={range} setRange={setRange} />

      <AttendanceTable data={attendance} formatTime={formatTime} />

      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-1/3">
          <LeaveForm
            leaveSummary={leaveSummary}
            loading={loading}
            onSubmit={async (data: LeavePayload) => {
              setLoading(true)
              await api.post("/employee/apply_leave", data)
              setLoading(false)
              fetchLeaveSummary()
            }}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <LeaveHistoryTable data={leaveStatus} />
        </div>

      </div>

    </div>
    </RoleGuard>
    </>
  )
}