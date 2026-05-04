"use client"

import dayjs from "dayjs"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import BheemaLoader from "./loader/loader"

export default function AttendanceCharts({
  trend,
  loading,
}: {
  trend: any[]
  loading?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[350px] border border-[#F1E9E4]/30">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#5A0F2E]">
          Attendance Overview
        </h2>

        {!loading && trend?.length > 0 && (
          <span className="text-xs text-gray-400 bg-[#f9fbf8] px-3 py-1 rounded-full border">
            Monthly Trend
          </span>
        )}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="h-[280px] flex flex-col justify-center items-center gap-4">
          <div className="scale-90">
            <BheemaLoader />
          </div>
        </div>
      ) : trend?.length === 0 ? (
        
        /* Empty State */
        <div className="h-[280px] flex flex-col justify-center items-center text-center">
          <p className="text-gray-400 font-medium">
            No attendance trend data available
          </p>
          <span className="text-xs text-gray-300 mt-1">
            Data will appear once attendance records are available.
          </span>
        </div>
      ) : (
        
        /* Chart */
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#F1E9E4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F1E9E4" stopOpacity={0.1} />
                
              </linearGradient>

              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5A0F2E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#5A0F2E" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} opacity={0.2} />

            <XAxis
              dataKey="date"
              tickFormatter={(d) => dayjs(d).format("DD MMM")}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
              labelFormatter={(label) =>
                dayjs(label).format("DD MMM YYYY")
              }
            />

            <Legend />

            <Area
              type="monotone"
              dataKey="present"
              stroke="#5A0F2E"
              fill="url(#present)"
              strokeWidth={0.5}
              name="Present"
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#5A0F2E"
              fill="url(#total)"
              strokeWidth={0.5}
              name="Total"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}