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
import { Cake, CloudSun, Moon, PartyPopper, SunDim, Users, CalendarCheck, ClipboardList,CalendarDays, UsersRound } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"
import AnnouncementsPanel from "@/app/dashboard/humanresources/hr-components/AnnouncementsPanel"
import { BirthdayCard } from "../hr-components/BirthdayCard"
import { AttendanceRow, Employee, SummaryRow } from "@/types/hrTypes"
import CompanySpinner from "@/components/shared/loader/spinner"

// ─── Utils ─────────────────────────────────
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

const STATUS_BG: Record<string, string> = {
  present: "#e8f5e9",
  absent: "#fff0ee",
  leave: "#e8f1fd",
  half_day: "#f5eeff",
}

const fillMonthData = (data: any[]) => {
  const start = dayjs().startOf("month")
  const end = dayjs().endOf("month")
  const map = new Map(data.map((d) => [dayjs(d.date).format("YYYY-MM-DD"), d]))
  const result = []
  let current = start
  while (current.isBefore(end) || current.isSame(end)) {
    const key = current.format("YYYY-MM-DD")
    const item = map.get(key)
    result.push({ date: key, present: Number(item?.present || 0), total: Number(item?.total || 0) })
    current = current.add(1, "day")
  }
  return result
}

function getGreeting() {
  const h = dayjs().hour()
  if (h < 12) return { text: "Good Morning", icon: <CloudSun className="w-6 h-6" /> }
  if (h < 17) return { text: "Good Afternoon", icon: <SunDim className="w-6 h-6" /> }
  return { text: "Good Evening", icon: <Moon strokeWidth={3} className="w-6 h-6" /> }
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  accent: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderColor: accent + "33" }}
    >
      {/* bg circle */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10"
        style={{ background: accent }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: accent + "18", color: accent }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black mt-0.5" style={{ color: accent }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])
  const [birthdays, setBirthdays] = useState<any[]>([])
  const [summary, setSummary] = useState<SummaryRow[]>([])
  const [trend, setTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState<any>(null)

  const [filters, setFilters] = useState({
    employee_id: "",
    filter: "month",
  })

  const debouncedFilters = useDebounce(filters, 400)
  const greeting = getGreeting()

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch { setEmployees([]) }
  }

  const employeeMap = useMemo(() => {
  return employees.reduce((acc: Record<string, any>, emp: any) => {
    acc[String(emp.employee_id)] = emp
    return acc
  }, {})
}, [employees])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params: any = { filter: debouncedFilters.filter }
      if (debouncedFilters.employee_id) params.employee_id = debouncedFilters.employee_id
      const res = await api.get("/core/attendance", { params })
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

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/hr/dashboard-summary")
      setDashboard(res.data?.data || null)
    } catch { setDashboard(null) }
  }

  useEffect(() => {
    fetchEmployees()
    fetchBirthdays()
    fetchAttendance()
    fetchDashboard()
  }, [debouncedFilters])

  const totalCount = useMemo(
    () => summary.reduce((acc, s) => acc + Number(s.count || 0), 0),
    [summary]
  )

  const attendancePercent = dashboard?.attendance?.total
    ? Math.round((dashboard.attendance.present / dashboard.attendance.total) * 100)
    : 0

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  return (
    <RoleGuard allowedRoles={["hr"]}>
      <div className="min-h-screen p-4 md:p-6 m-3 md:m-5 rounded-2xl space-y-5 bg-[#fdfdfd] border border-[#F1E9E4]/30">

        {/* ── FILTERS ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#F1E9E4]/30">
          <Select
            value={filters.employee_id || "all"}
            onValueChange={(v) => handleFilterChange("employee_id", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-[220px] rounded-xl border-[#F1E9E4]/50 bg-[#f9fbf8]">
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
            <SelectTrigger className="w-[160px] rounded-xl border-[#F1E9E4]/50 bg-[#f9fbf8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          {/* date badge */}
          <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-[#5A0F2E] bg-[#F1E9E4] px-4 py-2 rounded-xl border border-[#c27d9a]">
            <CalendarDays/> {dayjs().format("dddd, DD MMMM YYYY")}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#F1E9E4]/30 shadow-sm p-6">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #5A0F2E 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-10 left-0 w-48 h-48 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #5A0F2E 0%, transparent 70%)" }} />

          {/* greeting row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold flex items-center gap-2 text-[#cd5654]">
                {greeting.icon}
                {greeting.text}
                {birthdays.length > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 font-semibold animate-pulse ml-2">
                    <Cake className="inline w-3 h-3 mr-1" />
                    {birthdays.length} Birthday{birthdays.length > 1 ? "s" : ""} 🎉
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Attendance overview for{" "}
                <span className="font-semibold text-[#5A0F2E]">{dayjs().format("MMMM YYYY")}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5A0F2E] bg-[#F1E9E4] px-4 py-2 rounded-xl border border-[#c27d9a]">
              <span><UsersRound size={18}/></span> Total Records
              <span className="bg-[#5A0F2E] text-white text-xs px-2 py-0.5 rounded-lg">{totalCount}</span>
            </div>
          </div>

          {/* dashboard stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Users className="w-4 h-4" />} label="Employees" value={dashboard?.employees || 0} accent="#5A0F2E" />
            <StatCard icon={<CalendarCheck className="w-4 h-4" />} label="Interviews" value={dashboard?.interviews?.scheduled || 0} accent="#549beb" />
            <StatCard
              icon={<CalendarCheck className="w-4 h-4" />}
              label="Attendance"
              value={`${attendancePercent}%`}
              accent="#38543d"
            />            <StatCard icon={<ClipboardList className="w-4 h-4" />} label="Requests" value={dashboard?.requests || 0} accent="#af54eb" />
          </div>

        </div>

        {/* ── BIRTHDAYS ────────────────────────────────────────────────────── */}
        {birthdays.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm p-5">
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-[0.08]"
              style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }} />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-pink-500" />
                <h3 className="text-sm font-black text-gray-800">Today's Birthdays</h3>
                <span className="text-[10px] bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded-full">
                  {birthdays.length}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium hidden sm:flex items-center gap-1">
                Celebrate your team <PartyPopper className="w-3 h-3" />
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {birthdays.map((emp) => (
                <BirthdayCard key={emp.employee_id} emp={emp} />
              ))}
            </div>
          </div>
        )}

        <AnnouncementsPanel />

        <AttendanceCharts trend={trend} />
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1E9E4]/30 overflow-hidden">
          {/* table header */}
          <div className="px-5 py-4 border-b border-[#F1E9E4]/20 flex items-center justify-between bg-[#f4f8f2]">
            <h3 className="text-sm font-black text-[#5A0F2E]">Attendance Records</h3>
            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-[#F1E9E4]/30">
              {attendance.length} entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f9fbf8]">
                  {["Employee", "Date", "Check In", "Check Out", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#5A0F2E] tracking-wider uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex justify-center gap-1.5">
                        
                        <CompanySpinner/>
                        
                      </div>
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendance.map((a, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-[#f9fbf8] transition-colors group">
                    
                 <td className="px-5 py-3.5">
                 <div className="flex items-center gap-3">
    
                   {employeeMap[String(a.employee_id)]?.profile_image ? (
                     <img
                src={employeeMap[String(a.employee_id)].profile_image}
                  alt={`${a.first_name} ${a.last_name}`}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
                 />
               ) : (
                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A0F2E] to-[#2d6a4f] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                     {a.first_name?.[0]}
                     {a.last_name?.[0]}
                   </div>
                         )}

    <span className="font-semibold text-gray-800">
      {a.first_name} {a.last_name}
    </span>

  </div>
</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">
                        {a.check_in ? dayjs(a.check_in).format("DD MMM YYYY") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">
                        {a.check_in ? dayjs(a.check_in).format("hh:mm A") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">
                        {a.check_out ? dayjs(a.check_out).format("hh:mm A") : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                          style={{
                            color: STATUS_COLORS[a.status] || "#555",
                            background: STATUS_BG[a.status] || "#f5f5f5",
                          }}
                        >
                          {a.status.replace("_", " ")}
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
    </RoleGuard>
  )
}