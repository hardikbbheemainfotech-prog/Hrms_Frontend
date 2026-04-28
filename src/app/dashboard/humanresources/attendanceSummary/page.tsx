"use client"

import React, { useEffect, useMemo, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AttendanceCharts from "@/components/shared/AttendanceChart"

// ---------- Types ----------
type Employee = {
  employee_id: number
  first_name: string
  last_name: string
}

type AttendanceRow = {
  employee_id: number
  first_name: string
  last_name: string
  check_in: string | null
  check_out: string | null
  status: string
}

type SummaryRow = {
  status: string
  count: number
}

// ---------- Utils ----------
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}

const STATUS_COLORS: Record<string, string> = {
  present: "#38543d",
  absent: "#f58476",
  leave: "#549beb",
  half_day: "#af54eb",
}

// 🔥 Fill missing days
const fillMonthData = (data: any[]) => {
  const start = dayjs().startOf("month")
  const end = dayjs().endOf("month")

  const map = new Map(
    data.map((d) => [dayjs(d.date).format("YYYY-MM-DD"), d])
  )

  const result = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    const key = current.format("YYYY-MM-DD")

    const item = map.get(key)

    result.push({
      date: key,
      present: Number(item?.present || 0),
      total: Number(item?.total || 0),
    })

    current = current.add(1, "day")
  }

  return result
}

// ---------- Page ----------
export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])
  const [summary, setSummary] = useState<SummaryRow[]>([])
  const [trend, setTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({
    employee_id: "",
    filter: "month",
    from: "",
    to: "",
  })

  const debouncedFilters = useDebounce(filters, 400)

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch {
      setEmployees([])
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params: any = {
        filter: debouncedFilters.filter,
      }

      if (debouncedFilters.employee_id)
        params.employee_id = debouncedFilters.employee_id

      const res = await api.get("/core/attendance", { params })
      const data = res.data?.data || {}

      setAttendance(data.attendance || [])
      setSummary(data.summary || [])
      setTrend(fillMonthData(data.trend || []))
    } catch {
      setAttendance([])
      setSummary([])
      setTrend([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [debouncedFilters])

  const totalCount = useMemo(
    () => summary.reduce((acc, s) => acc + Number(s.count || 0), 0),
    [summary]
  )

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // 🎨 dynamic bar color
  const getBarColor = (value: number) => {
    if (value > 20) return "#22c55e"
    if (value > 10) return "#eab308"
    return "#ef4444"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 m-5 rounded-2xl">

      {/* FILTER */}
      <div className="flex gap-3 bg-white p-4 rounded-xl shadow">
        <Select
          value={filters.employee_id || "all"}
          onValueChange={(value) =>
            handleFilterChange("employee_id", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((e) => (
              <SelectItem key={e.employee_id} value={String(e.employee_id)}>
                {e.first_name} {e.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.filter}
          onValueChange={(value) =>
            handleFilterChange("filter", value)
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
          <p>Total Records</p>
          <h2 className="text-2xl font-bold">{totalCount}</h2>
        </div>

        {summary.map((s) => (
          <div
            key={s.status}
            className="p-4 rounded-xl text-white"
            style={{ background: STATUS_COLORS[s.status] }}
          >
            <p className="capitalize">{s.status}</p>
            <h2 className="text-xl font-bold">{s.count}</h2>
          </div>
        ))}
      </div>

      {/* CHART */}
     <AttendanceCharts trend={trend} />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">
                  No records
                </td>
              </tr>
            ) : (
              attendance.map((a, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {a.first_name} {a.last_name}
                  </td>

                  <td className="p-3">
                    {a.check_in
                      ? dayjs(a.check_in).format("DD MMM YYYY")
                      : "-"}
                  </td>

                  <td className="p-3">
                    {a.check_in
                      ? dayjs(a.check_in).format("hh:mm A")
                      : "-"}
                  </td>

                  <td className="p-3">
                    {a.check_out
                      ? dayjs(a.check_out).format("hh:mm A")
                      : "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs"
                      style={{ background: STATUS_COLORS[a.status] }}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}