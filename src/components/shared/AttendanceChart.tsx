"use client"

import dayjs from "dayjs"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts"
import BheemaLoader from "./loader/loader"
import { TrendPoint } from "@/hooks/Useattendancedashboard"
import { ChartNoAxesCombined } from "lucide-react"

export default function AttendanceCharts({
  trend,
  loading,
}: {
  trend: TrendPoint[]
  loading?: boolean
}) {

  // 🔥 FIX: derive absent from total
  const chartData = trend.map((t) => ({
    ...t,
    absent: t.total - t.present,
  }))

  // check if there's any real data
  const hasData = chartData.some((t) => t.present > 0 || t.absent > 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-[350px] border border-[#F1E9E4]/40">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black text-[#5A0F2E]">Attendance Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Present vs Absent — {dayjs().format("MMMM YYYY")}
          </p>
        </div>

        {!loading && hasData && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-1.5 rounded-full bg-[#5A0F2E] inline-block" />
              Present
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-1.5 rounded-full bg-[#549beb] inline-block" />
              Absent
            </div>
          </div>
        )}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="h-[260px] flex justify-center items-center">
          <div className="scale-90"><BheemaLoader /></div>
        </div>

      ) : !hasData ? (
        /* Empty State */
        <div className="h-[260px] flex flex-col justify-center items-center text-center gap-2">
          <span className="text-red-400"><ChartNoAxesCombined size={35}/></span>
          <p className="text-sm text-gray-600 font-medium">No attendance data this month</p>
          <span className="text-xs text-gray-500">
            Chart will populate as attendance is recorded.
          </span>
        </div>

      ) : (
        /* Chart */
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-present" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5A0F2E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5A0F2E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-absent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#549beb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#549beb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#f0f0f0" />

            <XAxis
              dataKey="date"
              tickFormatter={(d) => dayjs(d).format("DD")}
              tick={{ fontSize: 11, fill: "#bbb" }}
              axisLine={false}
              tickLine={false}
            />

            {/* ✅ Add YAxis with integer ticks and domain */}
            <YAxis
              allowDecimals={false}
              domain={[0, (dataMax: number) => Math.max(dataMax + 1, 5)]}
              tick={{ fontSize: 11, fill: "#bbb" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #F1E9E4",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              labelFormatter={(label) => dayjs(label).format("DD MMM YYYY")}
            />

            {/* ✅ Absent FIRST (renders below) */}
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#549beb"
              strokeWidth={2}
              fill="url(#grad-absent)"
              dot={false}
              activeDot={{ r: 4, fill: "#549beb" }}
              name="Absent"
            />

            {/* ✅ Present LAST (renders on top) */}
            <Area
              type="monotone"
              dataKey="present"
              stroke="#5A0F2E"
              strokeWidth={2}
              fill="url(#grad-present)"
              dot={false}
              activeDot={{ r: 4, fill: "#5A0F2E" }}
              name="Present"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}