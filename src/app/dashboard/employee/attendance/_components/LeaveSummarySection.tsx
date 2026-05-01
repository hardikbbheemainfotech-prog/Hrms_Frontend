"use client"

import { Card, CardContent, CardHeader, CardTitle, Gauge } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as PieIcon } from "lucide-react"
import { LeaveSummaryItem } from "@/types/employeeTypes"



type Props = {
  data: LeaveSummaryItem[]
}

const COLORS = ['#5A0F2E', '#AE275F', '#4B6344', '#5A0F2E']

export default function LeaveSummarySection({ data }: Props) {

  const chartData = data.map(item => ({
    ...item,
    remaining_days: Number(item.remaining_days) || 0
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* CARDS */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.map((leave, i) => {
          const total = (leave.total_days || 0) + (leave.remaining_days || 0)
          const percent = total > 0
            ? Math.round(((leave.remaining_days || 0) / total) * 100)
            : 0

          return (
            <Card key={i} className="rounded-2xl bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  {leave.leave_type}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center">
                <Gauge value={percent} />
                <p className="text-xs text-gray-400 mt-2">
                  Remaining: {leave.remaining_days}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* PIE CHART */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xs flex items-center gap-2">
            <PieIcon size={14} /> Balance
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[220px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="remaining_days"
                nameKey="leave_type"
                innerRadius={60}
                outerRadius={80}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}