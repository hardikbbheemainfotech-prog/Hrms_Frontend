"use client"

import React, { useEffect, useMemo, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AttendanceCharts from "@/components/shared/AttendanceChart"
import CircleStat from "@/components/ui/Circle_Progress"

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Utils ────────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const STATUS_COLORS: Record<string, string> = {
  present:  "#38543d",
  absent:   "#f58476",
  leave:    "#549beb",
  half_day: "#af54eb",
}

const STATUS_BG: Record<string, string> = {
  present:  "#e8f5e9",
  absent:   "#fff0ee",
  leave:    "#e8f1fd",
  half_day: "#f5eeff",
}

const fillMonthData = (data: any[]) => {
  const start = dayjs().startOf("month")
  const end   = dayjs().endOf("month")
  const map   = new Map(data.map((d) => [dayjs(d.date).format("YYYY-MM-DD"), d]))
  const result = []
  let current = start
  while (current.isBefore(end) || current.isSame(end)) {
    const key  = current.format("YYYY-MM-DD")
    const item = map.get(key)
    result.push({ date: key, present: Number(item?.present || 0), total: Number(item?.total || 0) })
    current = current.add(1, "day")
  }
  return result
}

function getGreeting() {
  const h = dayjs().hour()
  if (h < 12) return { text: "Good Morning", icon: "🌤️" }
  if (h < 17) return { text: "Good Afternoon", icon: "☀️" }
  return { text: "Good Evening", icon: "🌙" }
}

function getInitials(first: string, last: string) {
  return `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase()
}

// ─── Birthday Card ────────────────────────────────────────────────────────────
function BirthdayCard({ emp }: { emp: any }) {
  const initials = getInitials(emp.first_name, emp.last_name)
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[200px]">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {emp.profile_image ? (
          <img src={emp.profile_image} alt={emp.first_name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white text-sm font-bold ring-2 ring-pink-200">
            {initials}
          </div>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 text-xs">🎂</span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 truncate">{emp.first_name} {emp.last_name}</p>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{emp.job_title || "Employee"}</p>
      </div>
      {/* Wish */}
      <button className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
        Wish 🎉
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [employees, setEmployees]   = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])
  const [birthdays, setBirthdays]   = useState<any[]>([])
  const [summary, setSummary]       = useState<SummaryRow[]>([])
  const [trend, setTrend]           = useState<any[]>([])
  const [loading, setLoading]       = useState(false)

  const [filters, setFilters] = useState({
    employee_id: "",
    filter: "month",
  })

  const debouncedFilters = useDebounce(filters, 400)
  const greeting         = getGreeting()

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch { setEmployees([]) }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params: any = { filter: debouncedFilters.filter }
      if (debouncedFilters.employee_id) params.employee_id = debouncedFilters.employee_id
      const res  = await api.get("/core/attendance", { params })
      const data = res.data?.data || {}
      setAttendance(data.attendance || [])
      setSummary(data.summary || [])
      setTrend(fillMonthData(data.trend || []))
    } catch {
      setAttendance([]); setSummary([]); setTrend([])
    } finally { setLoading(false) }
  }

  const fetchBirthdays = async () => {
    try {
      const res = await api.get("/hr/birthdays")
      setBirthdays(res.data?.data?.birthdays || [])
    } catch { setBirthdays([]) }
  }

  useEffect(() => { fetchEmployees(); fetchBirthdays() }, [])
  useEffect(() => { fetchAttendance() }, [debouncedFilters])

  const totalCount = useMemo(
    () => summary.reduce((acc, s) => acc + Number(s.count || 0), 0),
    [summary]
  )

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 min-h-screen space-y-5 m-3 md:m-5 rounded-2xl bg-white/60 backdrop-blur-md border border-[#ACC8A2]/30">

      {/* ── 1. FILTER BAR ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-[#ACC8A2]/30">
        <Select
          value={filters.employee_id || "all"}
          onValueChange={(v) => handleFilterChange("employee_id", v === "all" ? "" : v)}
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
          onValueChange={(v) => handleFilterChange("filter", v)}
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

      {/* ── 2. HERO HEADER ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#d4e8cc]/60 shadow-sm p-5 md:p-7">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-[0.06]"
             style={{ background: "radial-gradient(circle, #4e7740 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-8 left-0 w-36 h-36 rounded-full opacity-[0.04]"
             style={{ background: "radial-gradient(circle, #1a3112 0%, transparent 70%)" }} />

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black tracking-tight text-[#1a3112]">
                {greeting.icon} {greeting.text}
              </h2>
              {birthdays.length > 0 && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 font-semibold animate-pulse">
                  🎂 {birthdays.length} Birthday{birthdays.length > 1 ? "s" : ""} Today
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2 flex-wrap">
              Attendance overview for{" "}
              <span className="font-semibold text-[#2d6a4f]">{dayjs().format("MMMM YYYY")}</span>
              {birthdays.length > 0 && (
                <span className="text-pink-500 font-medium">
                  · Wish {birthdays[0].first_name} today 🎉
                </span>
              )}
            </p>
          </div>

          {/* Right chips */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1a3112] bg-[#e8f0e4] px-4 py-2 rounded-xl border border-[#c5ddbf]">
              <span className="text-base">👥</span>
              Total Records
              <span className="bg-[#1a3112] text-white text-xs px-2 py-0.5 rounded-lg">
                {totalCount}
              </span>
            </div>
            {birthdays.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 px-4 py-2 rounded-xl border border-pink-200">
                🎂 {birthdays.length} Today
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#acc8a2]/50 to-transparent mb-6" />

        {/* Circle stats */}
        <div className="flex gap-6 flex-wrap">
          {summary.map((s) => (
            <CircleStat
              key={s.status}
              value={s.count}
              total={totalCount}
              color={STATUS_COLORS[s.status] || "#888"}
              label={s.status}
            />
          ))}
          {summary.length === 0 && (
            <p className="text-sm text-gray-400">No summary data available.</p>
          )}
        </div>
      </div>

      {/* ── 3. BIRTHDAY SECTION (only when birthdays exist) ───────────────── */}
      {birthdays.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm p-5">
          <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-[0.08]"
               style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }} />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎂</span>
              <h3 className="text-sm font-black text-gray-800">Today's Birthdays</h3>
              <span className="text-[10px] bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded-full">
                {birthdays.length}
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium hidden sm:block">
              Celebrate your team 🎉
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {birthdays.map((emp) => (
              <BirthdayCard key={emp.employee_id} emp={emp} />
            ))}
          </div>
        </div>
      )}

      {/* ── 4. CHART ──────────────────────────────────────────────────────── */}
      <AttendanceCharts trend={trend} />

      {/* ── 5. TABLE ──────────────────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-[#ACC8A2]/30 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#ACC8A2]/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1a3112]">Attendance Records</h3>
          <span className="text-xs text-gray-400">{attendance.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f4f8f2]">
                <th className="p-3 text-left text-xs font-semibold text-[#1a3112] tracking-wide">Employee</th>
                <th className="p-3 text-left text-xs font-semibold text-[#1a3112] tracking-wide">Date</th>
                <th className="p-3 text-left text-xs font-semibold text-[#1a3112] tracking-wide">Check In</th>
                <th className="p-3 text-left text-xs font-semibold text-[#1a3112] tracking-wide">Check Out</th>
                <th className="p-3 text-left text-xs font-semibold text-[#1a3112] tracking-wide">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8">
                    <div className="flex justify-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#4e7740] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-400 text-sm">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((a, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-[#f9fbf8] transition-colors">
                    <td className="p-3 font-medium text-gray-800">
                      {a.first_name} {a.last_name}
                    </td>
                    <td className="p-3 text-gray-500">
                      {a.check_in ? dayjs(a.check_in).format("DD MMM YYYY") : "—"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {a.check_in ? dayjs(a.check_in).format("hh:mm A") : "—"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {a.check_out ? dayjs(a.check_out).format("hh:mm A") : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          color:      STATUS_COLORS[a.status] || "#555",
                          background: STATUS_BG[a.status]    || "#f5f5f5",
                        }}
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
    </div>
  )
}
