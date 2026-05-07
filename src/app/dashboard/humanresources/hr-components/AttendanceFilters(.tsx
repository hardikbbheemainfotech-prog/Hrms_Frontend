"use client"

import  { useState } from "react"
import dayjs from "dayjs"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { CalendarDays, X } from "lucide-react"
import { Employee, Filters } from "@/hooks/Useattendancedashboard"

export function AttendanceFilters({
  filters, employees, onFilterChange,
}: {
  filters: Filters
  employees: Employee[]
  onFilterChange: (key: keyof Filters, value: string) => void
}) {
  const [showRange, setShowRange] = useState(
    !!(filters.start_date || filters.end_date)
  )

  const handleFilterSelect = (v: string) => {
    if (v === "range") {
      setShowRange(true)
      onFilterChange("filter", "")
    } else {
      setShowRange(false)
      onFilterChange("start_date", "")
      onFilterChange("end_date", "")
      onFilterChange("filter", v)
    }
  }

  const clearRange = () => {
    setShowRange(false)
    onFilterChange("start_date", "")
    onFilterChange("end_date", "")
    onFilterChange("filter", "month")
  }

  const selectValue = showRange ? "range" : (filters.filter || "month")

  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#F1E9E4]/40 items-center">

      {/* Employee select */}
      <Select
        value={filters.employee_id || "all"}
        onValueChange={(v) => onFilterChange("employee_id", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-[220px] rounded-xl border-[#F1E9E4]/60 bg-[#fdfaf9]">
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

      {/* Period select */}
      <Select value={selectValue} onValueChange={handleFilterSelect}>
        <SelectTrigger className="w-[160px] rounded-xl border-[#F1E9E4]/60 bg-[#fdfaf9]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="range">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range inputs — shown when "Custom Range" selected */}
      {showRange && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-medium">From</span>
            <input
              type="date"
              value={filters.start_date || ""}
              max={filters.end_date || dayjs().format("YYYY-MM-DD")}
              onChange={(e) => onFilterChange("start_date", e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#F1E9E4]/60 bg-[#fdfaf9] text-[#5A0F2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A0F2E]/20 focus:border-[#c27d9a] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-medium">To</span>
            <input
              type="date"
              value={filters.end_date || ""}
              min={filters.start_date || undefined}
              max={dayjs().format("YYYY-MM-DD")}
              onChange={(e) => onFilterChange("end_date", e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#F1E9E4]/60 bg-[#fdfaf9] text-[#5A0F2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A0F2E]/20 focus:border-[#c27d9a] transition-all"
            />
          </div>

          {/* clear */}
          <button
            onClick={clearRange}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#5A0F2E] px-2 py-1.5 rounded-lg hover:bg-[#F1E9E4] transition-all"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        </div>
      )}

      {/* Active range label */}
      {showRange && filters.start_date && filters.end_date && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A0F2E] bg-[#F1E9E4] px-3 py-1.5 rounded-lg border border-[#c27d9a]/30">
          <CalendarDays className="w-3 h-3" />
          {dayjs(filters.start_date).format("DD MMM")} – {dayjs(filters.end_date).format("DD MMM YYYY")}
        </div>
      )}

      {/* Today's date badge */}
      <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-[#5A0F2E] bg-[#F1E9E4] px-4 py-2 rounded-xl border border-[#c27d9a]/40">
        <CalendarDays className="w-3.5 h-3.5" />
        {dayjs().format("dddd, DD MMMM YYYY")}
      </div>

    </div>
  )
}