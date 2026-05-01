"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import DateRangePicker from "@/app/dashboard/employee/attendance/_components/DateRangePicker"
import LeaveForm from "@/app/dashboard/employee/attendance/_components/LeaveForm"
import AttendanceTable from "@/app/dashboard/employee/attendance/_components/AttendanceTable"
import LeaveSummarySection from "./_components/LeaveSummarySection"
import LeaveHistoryTable from "./_components/LeaveHistoryTable"
import RoleGuard from "@/components/shared/RoleGuard"
import BheemaLoader from "@/components/shared/loader/loader"

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
  const [dataloading, setdataLoading] = useState(true)

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
useEffect(() => {
    setTimeout(() => {
      setdataLoading(false)
    }, 1500)
  }, []) 

  const formatTime = (t?: string | null) =>
    t
      ? new Date(t).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "--"


 if (dataloading) {
    return (
       <div className="bg-[#f0e5df] rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex items-center justify-center">
        <BheemaLoader />
      </div>
    )
  }


  return (
    <>
    <RoleGuard allowedRoles={["employee"]}>
  <div className="bg-[#f0e5df] rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex flex-col">
     <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#5A0F2E] tracking-tight">Attendance logs</h1>
          <p className="text-sm text-gray-500">Your attendance records and leave history</p>
        </div>

    
    <LeaveSummarySection data={leaveSummary} />

    <DateRangePicker range={range} setRange={setRange} />

      <div className="flex-1 no-scrollbar">
    <AttendanceTable data={attendance} formatTime={formatTime} />
  </div>

      <div className="flex flex-col no-scrollbar lg:flex-row gap-6">

        <div className="w-full no-scrollbar lg:w-1/3">
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

        <div className="w-full no-scrollbar lg:w-2/3">
          <LeaveHistoryTable data={leaveStatus} />
        </div>

      </div>

    </div>
    {/* </div> */}
    </RoleGuard>
    </>
  )
}