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

export default function AttendanceCharts({ trend }: { trend: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[350px]">
      <h2 className="text-lg font-semibold mb-4">
        Attendance Overview
      </h2>
    

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend}>
          <defs>
            <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} opacity={0.2} />

          <XAxis
            dataKey="date"
            tickFormatter={(d) => dayjs(d).format("DD MMM")}
          />

          <Tooltip
            labelFormatter={(label) =>
              dayjs(label).format("DD MMM YYYY")
            }
          />

          <Legend />

          <Area
            type="monotone"
            dataKey="present"
            stroke="#4f46e5"
            fill="url(#present)"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#f97316"
            fill="url(#total)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}