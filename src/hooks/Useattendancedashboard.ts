import { useEffect, useMemo, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"

// ─── Types ────────────────────────────────────────────────────────────────────
export type Employee = {
  employee_id: number
  first_name: string
  last_name: string
  profile_image?: string
}

export type AttendanceRow = {
  employee_id: number
  first_name: string
  last_name: string
  check_in: string | null
  check_out: string | null
  status: string
}

export type SummaryRow = {
  status: string
  count: number
}

export type TrendPoint = {
  date: string
  present: number
  total: number
}

export type Filters = {
  employee_id: string
  filter:      string   // "today" | "week" | "month" | "" (empty when using custom range)
  start_date:  string   // "YYYY-MM-DD" or ""
  end_date:    string   // "YYYY-MM-DD" or ""
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function buildTrendFromAttendance(
  attendance: AttendanceRow[],
  filters: Filters
): TrendPoint[] {

  // ── 1. Determine date range from filters ──────────────────────────────────
  let start: dayjs.Dayjs
  let end: dayjs.Dayjs = dayjs().endOf("day")

  if (filters.filter === "today") {
    start = dayjs().startOf("day")
    end   = dayjs().endOf("day")
  } else if (filters.filter === "week") {
    start = dayjs().startOf("week")
    end   = dayjs().endOf("week")
  } else if (filters.filter === "month" || !filters.filter) {
    start = dayjs().startOf("month")
    end   = dayjs().endOf("month")
  } else if (filters.start_date && filters.end_date) {
    // custom range
    start = dayjs(filters.start_date).startOf("day")
    end   = dayjs(filters.end_date).endOf("day")
  } else {
    start = dayjs().startOf("month")
    end   = dayjs().endOf("month")
  }

  // ── 2. Group ALL rows (present + absent) by date ──────────────────────────
  // For present rows  → use check_in date
  // For absent rows   → we don't have a date on the row itself,
 
  const grouped: Record<string, { present: number; absent: number; total: number }> = {}

  attendance.forEach((a) => {
    // Use check_in for present, skip absent rows (no date available)
    const rawDate = a.check_in
    if (!rawDate) return

    const date = dayjs(rawDate).format("YYYY-MM-DD")
    if (!grouped[date]) grouped[date] = { present: 0, absent: 0, total: 0 }

    grouped[date].total += 1
    if (a.status === "present" || a.status === "half_day") {
      grouped[date].present += 1
    } else {
      grouped[date].absent += 1
    }
  })

  // ── 3. Fill every calendar day in range ───────────────────────────────────
  const result: TrendPoint[] = []
  let current = start.startOf("day")

  while (current.isBefore(end) || current.isSame(end, "day")) {
    const key = current.format("YYYY-MM-DD")
    const g   = grouped[key]

    result.push({
      date:    key,
      present: g?.present ?? 0,
      total:   g?.total   ?? 0,   // absent = total - present in the chart
    })
    current = current.add(1, "day")
  }

  return result
}
// ─── Main hook ────────────────────────────────────────────────────────────────
export function useAttendanceDashboard() {
 const [filters, setFilters] = useState<Filters>({
  employee_id: "",
  filter:      "month",
  start_date:  "",
  end_date:    "",
})

  const [employees,  setEmployees]  = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])
  const [birthdays,  setBirthdays]  = useState<any[]>([])
  const [summary,    setSummary]    = useState<SummaryRow[]>([])
  const [trend,      setTrend]      = useState<TrendPoint[]>([])
  const [dashboard,  setDashboard]  = useState<any>(null)
  const [loading,    setLoading]    = useState(false)

  const debouncedFilters = useDebounce(filters, 400)

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch { setEmployees([]) }
  }

  // In your hook, update fetchAttendance:
const fetchAttendance = async () => {
  setLoading(true)
  try {
    const params: Record<string, any> = { filter: debouncedFilters.filter }
    if (debouncedFilters.employee_id) params.employee_id = debouncedFilters.employee_id
    if (debouncedFilters.start_date)  params.start_date  = debouncedFilters.start_date
    if (debouncedFilters.end_date)    params.end_date    = debouncedFilters.end_date

    const res  = await api.get("/core/attendance", { params })
    const data = res.data?.data || {}
    const rows: AttendanceRow[] = data.attendance || []

    setAttendance(rows)

    // summary
    const raw = data.summary
    if (Array.isArray(raw)) {
      setSummary(raw.map((s: any) => ({ status: s.status, count: Number(s.count) })))
    } else if (raw && typeof raw === "object") {
      setSummary(Object.entries(raw).map(([status, count]) => ({ status, count: Number(count) })))
    } else {
      setSummary([])
    }

    // ✅ prefer API trend, fall back to local build
    if (data.trend?.length) {
      setTrend(data.trend)
    } else {
      setTrend(buildTrendFromAttendance(rows, debouncedFilters))
    }
  } catch {
    setAttendance([]); setSummary([]); setTrend([])
  } finally {
    setLoading(false)
  }
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

  // static data — fetch once on mount
  useEffect(() => {
    fetchEmployees()
    fetchBirthdays()
    fetchDashboard()
  }, [])

  // attendance — refetch when filters change
  useEffect(() => {
    fetchAttendance()
  }, [debouncedFilters])

  // ── derived ──────────────────────────────────────────────────────────────────
  const totalCount = useMemo(
    () => summary.reduce((acc, s) => acc + s.count, 0),
    [summary]
  )

  const attendancePercent = useMemo(() => {
    // prefer dashboard value, fallback to calculating from summary
    if (dashboard?.attendance?.total) {
      return Math.round((dashboard.attendance.present / dashboard.attendance.total) * 100)
    }
    const present = summary.find((s) => s.status === "present")?.count ?? 0
    return totalCount > 0 ? Math.round((present / totalCount) * 100) : 0
  }, [dashboard, summary, totalCount])

  const employeeMap = useMemo(
    () => employees.reduce((acc: Record<string, Employee>, emp) => {
      acc[String(emp.employee_id)] = emp
      return acc
    }, {}),
    [employees]
  )

  const handleFilterChange = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value as any }))

  return {
    employees, attendance, birthdays, summary, trend,
    dashboard, loading, filters,
    totalCount, attendancePercent, employeeMap,
    handleFilterChange,
  }
}