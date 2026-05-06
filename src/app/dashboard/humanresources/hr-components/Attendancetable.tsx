"use client"

import React from "react"
import dayjs from "dayjs"
import CompanySpinner from "@/components/shared/loader/spinner"
import { AttendanceRow, Employee } from "@/hooks/Useattendancedashboard"
import { STATUS_BG, STATUS_COLORS } from "../hr-components/Attendancesections"
import { FileSliders } from "lucide-react"

type Props = {
  attendance: AttendanceRow[]
  employeeMap: Record<string, Employee>
  loading: boolean
}

export function AttendanceTable({ attendance, employeeMap, loading }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F1E9E4]/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F1E9E4]/30 flex items-center justify-between bg-[#fdfaf9]">
        <h3 className="text-sm font-black text-[#5A0F2E]">Attendance Records</h3>
        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-[#F1E9E4]/50">
          {attendance.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fdfaf9]">
              {["Employee", "Date", "Check In", "Check Out", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#5A0F2E] tracking-widest uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-14">
                  <div className="flex justify-center"><CompanySpinner /></div>
                </td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-14">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-red-400"><FileSliders size={32} /></span>
                    <p className="text-sm text-gray-600">No attendance records found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              attendance.map((a, i) => {
                const emp = employeeMap[String(a.employee_id)]
                return (
                  <tr key={i} className="border-t border-gray-50 hover:bg-[#fdfaf9] transition-colors">
                    {/* Employee */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {emp?.profile_image ? (
                          <img
                            src={emp.profile_image}
                            alt={`${a.first_name} ${a.last_name}`}
                            className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0F2E] to-[#8B2252] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {a.first_name?.[0]}{a.last_name?.[0]}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800 text-sm">
                          {a.first_name} {a.last_name}
                        </span>
                      </div>
                    </td>

                    {/* Date — use check_in if available, else show dash */}
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {a.check_in ? dayjs(a.check_in).format("DD MMM YYYY") : "—"}
                    </td>

                    {/* Check In */}
                    <td className="px-5 py-3.5 text-xs font-mono">
                      {a.check_in ? (
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-lg">
                          {dayjs(a.check_in).format("hh:mm A")}
                        </span>
                      ) : "—"}
                    </td>

                    {/* Check Out */}
                    <td className="px-5 py-3.5 text-xs font-mono">
                      {a.check_out ? (
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg">
                          {dayjs(a.check_out).format("hh:mm A")}
                        </span>
                      ) : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                        style={{
                          color:      STATUS_COLORS[a.status] || "#555",
                          background: STATUS_BG[a.status]     || "#f5f5f5",
                        }}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}