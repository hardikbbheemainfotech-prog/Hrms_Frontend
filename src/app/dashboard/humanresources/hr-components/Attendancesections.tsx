"use client"

import React from "react"
import dayjs from "dayjs"
import {
  Users, CalendarCheck, ClipboardList,
  UsersRound, TrendingUp, Cake, PartyPopper, CloudSun, SunDim, Moon,
} from "lucide-react"
import {  SummaryRow } from "@/hooks/Useattendancedashboard"

// ─── Greeting util ─────────────────────────────────────────────────────────────
export function getGreeting() {
  const h = dayjs().hour()
  if (h < 12) return { text: "Good Morning",   icon: <CloudSun className="w-5 h-5" /> }
  if (h < 17) return { text: "Good Afternoon", icon: <SunDim   className="w-5 h-5" /> }
  return        { text: "Good Evening",   icon: <Moon strokeWidth={3} className="w-5 h-5" /> }
}

// ─── Status colors ─────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  present:  "#38543d",
  absent:   "#f58476",
  leave:    "#549beb",
  half_day: "#af54eb",
}

export const STATUS_BG: Record<string, string> = {
  present:  "#e8f5e9",
  absent:   "#fff0ee",
  leave:    "#e8f1fd",
  half_day: "#f5eeff",
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, accent, sub,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  accent: string
  sub?: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: accent + "33" }}
    >
      <div className="pointer-events-none absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-[0.08]"
           style={{ background: accent }} />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
           style={{ background: accent + "15", color: accent }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black mt-0.5 tabular-nums" style={{ color: accent }}>{value}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── SummaryBadge ──────────────────────────────────────────────────────────────
function SummaryBadge({ status, count }: { status: string; count: number }) {
  const color = STATUS_COLORS[status] || "#888"
  const bg    = STATUS_BG[status]     || "#f5f5f5"
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold capitalize"
      style={{ color, background: bg, borderColor: color + "33" }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {status.replace("_", " ")}
      <span className="text-xs px-2 py-0.5 rounded-lg font-black text-white" style={{ background: color }}>
        {count}
      </span>
    </div>
  )
}


// ─── GreetingHeader ───────────────────────────────────────────────────────────
export function GreetingHeader({
  dashboard, summary, totalCount, attendancePercent, birthdays,
}: {
  dashboard: any
  summary: SummaryRow[]
  totalCount: number
  attendancePercent: number
  birthdays: any[]
}) {
  const greeting = getGreeting()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#F1E9E4]/40 shadow-sm p-6">
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.05]"
           style={{ background: "radial-gradient(circle, #5A0F2E 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-12 -left-8 w-52 h-52 rounded-full opacity-[0.04]"
           style={{ background: "radial-gradient(circle, #5A0F2E 0%, transparent 70%)" }} />

      {/* greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2 text-[#cd5654]">
            {greeting.icon}
            {greeting.text}
            {birthdays.length > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 font-bold animate-pulse ml-1 flex items-center gap-1">
                <Cake className="w-3 h-3" />
                {birthdays.length} Birthday{birthdays.length > 1 ? "s" : ""} <PartyPopper/>
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Attendance overview for{" "}
            <span className="font-bold text-[#5A0F2E]">{dayjs().format("MMMM YYYY")}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-[#5A0F2E] bg-[#F1E9E4] px-4 py-2.5 rounded-xl border border-[#c27d9a]/40 self-start">
          <UsersRound className="w-4 h-4" />
          Total Records
          <span className="bg-[#5A0F2E] text-white text-xs px-2.5 py-0.5 rounded-lg ml-1">
            {totalCount}
          </span>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard icon={<Users className="w-4 h-4" />}        label="Employees"  value={dashboard?.employees || 0}              accent="#5A0F2E" />
        <StatCard icon={<CalendarCheck className="w-4 h-4" />} label="Interviews" value={dashboard?.interviews?.scheduled || 0}   accent="#549beb" sub="Scheduled" />
        <StatCard icon={<TrendingUp className="w-4 h-4" />}    label="Attendance" value={`${attendancePercent}%`}                 accent="#38543d" sub="Present" />
        <StatCard icon={<ClipboardList className="w-4 h-4" />} label="Requests"   value={dashboard?.requests || 0}                accent="#af54eb" sub="Pending" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#F1E9E4] to-transparent mb-5" />

      {/* summary pills — built from new object summary shape */}
      <div className="flex gap-3 flex-wrap">
        {summary.length > 0
          ? summary.map((s) => <SummaryBadge key={s.status} status={s.status} count={s.count} />)
          : <p className="text-sm text-gray-400">No summary data.</p>
        }
      </div>
    </div>
  )
}

// ─── BirthdayStrip ────────────────────────────────────────────────────────────
export function BirthdayStrip({ birthdays }: { birthdays: any[] }) {
  if (!birthdays.length) return null

  const getInitials = (first: string, last: string) =>
    `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase()

  return (
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
        <span className="text-[11px] text-gray-400 hidden sm:flex items-center gap-1">
          Celebrate your team <PartyPopper className="w-3 h-3" />
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {birthdays.map((emp) => (
          <div key={emp.employee_id}
               className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all min-w-[200px]">
            <div className="relative flex-shrink-0">
              {emp.profile_image ? (
                <img src={emp.profile_image} alt={emp.first_name}
                     className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white text-sm font-bold ring-2 ring-pink-200">
                  {getInitials(emp.first_name, emp.last_name)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 text-xs">🎂</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{emp.first_name} {emp.last_name}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{emp.job_title || "Employee"}</p>
            </div>
            <button className="flex-shrink-0  flex gap-2 text-[10px] px-3 py-1.5 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
              Wish <PartyPopper/>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}