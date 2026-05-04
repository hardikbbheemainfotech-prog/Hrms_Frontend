"use client"

import React, { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import api from "@/lib/axios"
import BheemaLoader from "@/components/shared/loader/loader"

export default function FullCalendar() {

  const ROW_HEIGHT = 56

  const [employees, setEmployees] = useState<any[]>([])
  const [absences, setAbsences] = useState<any[]>([])
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [loading, setloading] = useState(false);

useEffect(() => {
  const fetchLeaves = async () => {
    try {
      setloading(true)

      const res = await api.get("/core/leaves")

      const employeesData = res.data?.data?.employees || []
      const leavesData = res.data?.data?.leaves || []

      const formattedLeaves = leavesData.map((l: any) => ({
        id: String(l.id),
        employeeId: String(l.employeeId),
        startDate: dayjs(l.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(l.endDate).format("YYYY-MM-DD"),
        type: (l.type || "").toLowerCase(),
      }))

      setEmployees(Array.isArray(employeesData) ? employeesData : [])
      setAbsences(formattedLeaves)

    } catch (err) {
      console.error(err)
      setEmployees([])
      setAbsences([])
    } finally {
      setloading(false)
    }
  }

  fetchLeaves()
}, [])

  const days = useMemo(() => {
    const total = currentMonth.daysInMonth()
    return Array.from({ length: total }, (_, i) =>
      currentMonth.date(i + 1)
    )
  }, [currentMonth])

  const colorMap: any = {
    vacation: "bg-green-400",
    sick: "bg-blue-400",
    paid: "bg-purple-400",
    "casual leave": "bg-green-400",
  }

return (
  <div className="px-6 py-10 bg-[#F1E9E4]/20 min-h-screen">
    <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Planned Absences</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentMonth(currentMonth.subtract(1, "month"))
            }
            className="px-3 py-1 bg-gray-100 rounded"
          >
            ←
          </button>

          <span className="text-sm font-medium">
            {currentMonth.format("MMMM YYYY")}
          </span>

          <button
            onClick={() =>
              setCurrentMonth(currentMonth.add(1, "month"))
            }
            className="px-3 py-1 bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      {/* Loading / Calendar */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <BheemaLoader />
        </div>
      ) : (
        <div className="overflow-auto">
          
          {/* Calendar Header */}
          <div className="flex">
            <div className="w-56 shrink-0" />

            <div
              className="grid border-b"
              style={{
                gridTemplateColumns: `repeat(${days.length}, 70px)`,
              }}
            >
              {days.map((d, i) => (
                <div
                  key={i}
                  className="h-[56px] flex flex-col items-center justify-center border-r text-xs"
                >
                  <span>{d.format("dd")}</span>
                  <span>{d.format("D")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Rows */}
          {employees.map((emp) => (
            <div key={emp.id} className="flex">
              
              {/* Employee Info */}
              <div
                className="w-56 flex items-center gap-3 px-3 border-b shrink-0"
                style={{ height: ROW_HEIGHT }}
              >
                <img
                  src={emp.profile_img}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div
                className="grid relative"
                style={{
                  gridTemplateColumns: `repeat(${days.length}, 70px)`,
                }}
              >
                {/* Empty Day Cells */}
                {days.map((_, i) => (
                  <div
                    key={i}
                    className="border-r border-b"
                    style={{ height: ROW_HEIGHT }}
                  />
                ))}
{absences
  .filter((a) => a.employeeId === String(emp.id))
  .map((abs) => {
    const monthStart = currentMonth.startOf("month")
    const monthEnd = currentMonth.endOf("month")

    const startDate = dayjs(abs.startDate)
    const endDate = dayjs(abs.endDate)

    if (
      endDate.isBefore(monthStart) ||
      startDate.isAfter(monthEnd)
    ) {
      return null
    }

    const start = Math.max(
      0,
      startDate.diff(monthStart, "day")
    )

    const end = Math.min(
      days.length - 1,
      endDate.diff(monthStart, "day")
    )

    const width = (end - start + 1) * 70

    return (
      <div
        key={abs.id}
        className={`absolute z-10 rounded-full text-white text-xs flex items-center px-3 shadow ${
          colorMap[abs.type] || "bg-gray-400"
        }`}
        style={{
          left: `${start * 70}px`,
          width: `${width}px`,
          height: 36,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {abs.type}
      </div>
    )
  })}              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
