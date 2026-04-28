"use client"

import React, { useMemo, useState } from "react"
import dayjs from "dayjs"

export default function FullCalendar() {

  const employees = [
    { id: "1", name: "Ethan", role: "Engineer" },
    { id: "2", name: "Liam", role: "Designer" },
    { id: "3", name: "Noah", role: "Backend" },
    { id: "4", name: "Ava", role: "Manager" },
    { id: "5", name: "Mia", role: "QA" },
  ]

  const absences = [
    { id: "1", employeeId: "1", startDate: "2025-01-10", endDate: "2025-01-12", type: "vacation" },
    { id: "2", employeeId: "2", startDate: "2025-02-02", endDate: "2025-02-04", type: "paid" },
    { id: "3", employeeId: "3", startDate: "2025-03-06", endDate: "2025-03-09", type: "sick" },
    { id: "4", employeeId: "4", startDate: "2025-12-01", endDate: "2025-12-03", type: "vacation" },
  ]

  const [currentMonth, setCurrentMonth] = useState(dayjs())

  const days = useMemo(() => {
    const total = currentMonth.daysInMonth()
    return Array.from({ length: total }, (_, i) =>
      currentMonth.date(i + 1)
    )
  }, [currentMonth])

  const today = dayjs()

  const colorMap: any = {
    vacation: "bg-green-400",
    sick: "bg-blue-400",
    paid: "bg-purple-400",
  }

  return (
    <div className="px-6 py-10 bg-[#ACC8A2]/20 min-h-screen">

      <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-xl">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-lg font-semibold">Planned Absences</h2>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              ←
            </button>

            <span className="text-sm font-medium">
              {currentMonth.format("MMMM YYYY")}
            </span>

            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex">

          <div className="w-56 flex flex-col">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="h-14 flex items-center gap-3 px-3 border-b hover:bg-white/40"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
                <div>
                  <p className="text-sm">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">

            <div
              className="grid border-b"
              style={{ gridTemplateColumns: `repeat(${days.length}, 70px)` }}
            >
              {days.map((d, i) => {
                const isWeekend = d.day() === 0 || d.day() === 6
                const isToday = d.isSame(today, "day")

                return (
                  <div
                    key={i}
                    className={`h-14 flex flex-col items-center justify-center text-xs border-r
                    ${isWeekend ? "bg-red-50 text-red-500" : ""}
                    ${isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""}
                    `}
                  >
                    <span>{d.format("dd")}</span>
                    <span>{d.format("D")}</span>
                  </div>
                )
              })}
            </div>


            {employees.map((emp) => (
              <div
                key={emp.id}
                className="grid relative"
                style={{ gridTemplateColumns: `repeat(${days.length}, 70px)` }}
              >

                {days.map((d, i) => {
                  const isWeekend = d.day() === 0 || d.day() === 6

                  return (
                    <div
                      key={i}
                      className={`h-14 border-r border-b
                      ${isWeekend ? "bg-red-50/60" : "bg-white"}
                      `}
                    />
                  )
                })}

       
                {absences
                  .filter((a) =>
                    dayjs(a.startDate).month() === currentMonth.month()
                  )
                  .filter((a) => a.employeeId === emp.id)
                  .map((abs) => {
                    const start = days.findIndex((d) =>
                      d.isSame(dayjs(abs.startDate), "day")
                    )
                    const end = days.findIndex((d) =>
                      d.isSame(dayjs(abs.endDate), "day")
                    )

                    if (start === -1 || end === -1) return null

                    return (
                      <div
                        key={abs.id}
                        className={`absolute h-10 rounded-full text-white text-xs flex items-center px-3 shadow ${colorMap[abs.type]}`}
                        style={{
                          left: `${start * 70}px`,
                          width: `${(end - start + 1) * 70}px`,
                          top: "8px",
                        }}
                      >
                        {abs.type}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}