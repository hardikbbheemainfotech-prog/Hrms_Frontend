"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"
import { Ban } from "lucide-react"

type Leave = {
  leave_id: number
  employee_id: number
  first_name: string
  last_name: string
  start_date: string
  end_date: string
  total_days: number
  reason: string
  status: string
  applied_at: string
}

export default function PendingLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([])

  const fetchLeaves = async () => {
    const res = await axios.get("/api/hr/get_leave_request")
    setLeaves(res.data.data.data)
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const updateStatus = async (leave_id: number, status: "approved" | "rejected") => {
    await axios.patch(`/api/hr/update_leave_status/${leave_id}`, { status })
    fetchLeaves()
  }

  return (
    <div className="p-6 bg-[#ACC8A2]/20 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Pending Leave Requests</h1>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow border overflow-hidden">

        <div className="grid grid-cols-7 px-4 py-3 text-xs font-semibold text-gray-500 border-b">
          <span>Employee</span>
          <span>Dates</span>
          <span>Days</span>
          <span>Reason</span>
          <span>Applied</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {leaves.map((leave) => (
          <div
            key={leave.leave_id}
            className="grid grid-cols-7 px-4 py-3 items-center border-b hover:bg-white/40 transition"
          >
            {/* EMPLOYEE */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
              <span className="text-sm">
                {leave.first_name} {leave.last_name}
              </span>
            </div>

            {/* DATES */}
            <span className="text-sm">
              {dayjs(leave.start_date).format("DD MMM")} →{" "}
              {dayjs(leave.end_date).format("DD MMM")}
            </span>

            {/* DAYS */}
            <span>{leave.total_days}</span>

            {/* REASON */}
            <span className="text-sm truncate max-w-[150px]">
              {leave.reason}
            </span>

            {/* APPLIED */}
            <span className="text-xs text-gray-500">
              {dayjs(leave.applied_at).format("DD MMM")}
            </span>

            {/* STATUS */}
            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-600 w-fit">
              Pending
            </span>

            {/* ACTION */}
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(leave.leave_id, "approved")}
                className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:opacity-90"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(leave.leave_id, "rejected")}
                className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:opacity-90"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {leaves.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Ban size={28} className="mb-2 opacity-70" />
            <p className="text-sm">No pending requests</p>
          </div>
        )}
      </div>
    </div>
  )
}