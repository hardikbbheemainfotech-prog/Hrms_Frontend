'use client'

import React from 'react'
import { Employee, Interview } from '@/types/mailTypes'

// ── Field ──────────────────────────────────────────────────────────────────────
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/50">{hint}</p>}
    </div>
  )
}

// ── Input ──────────────────────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
    />
  )
}

// ── Textarea ───────────────────────────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[72px] resize-y rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
    />
  )
}

// ── Select ─────────────────────────────────────────────────────────────────────
export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
    >
      {children}
    </select>
  )
}

// ── EmployeeSelect ─────────────────────────────────────────────────────────────
export function EmployeeSelect({
  employees,
  loading,
  placeholder = 'Select employee',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  employees: Employee[]
  loading: boolean
  placeholder?: string
}) {
  return (
    <select
      {...props}
      disabled={loading || props.disabled}
      className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
    >
      <option value="">{loading ? 'Loading employees…' : placeholder}</option>
      {employees.map((emp) => (
        <option key={emp.employee_id} value={emp.employee_id}>
          {emp.first_name} {emp.last_name} — {emp.job_title}
        </option>
      ))}
    </select>
  )
}

// ── InterviewSelect ────────────────────────────────────────────────────────────
export function InterviewSelect({
  interviews,
  loading,
  placeholder = 'Select interview',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  interviews: Interview[]
  loading: boolean
  placeholder?: string
}) {
  return (
    <select
      {...props}
      disabled={loading || props.disabled}
      className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
    >
      <option value="">{loading ? 'Loading interviews…' : placeholder}</option>
      {interviews.map((iv) => (
        <option key={iv.interview_id} value={iv.interview_id}>
          #{iv.interview_id} — {iv.candidate_name} ({iv.interview_type})
        </option>
      ))}
    </select>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────
export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-5 mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

// ── StaticBadge ────────────────────────────────────────────────────────────────
export function StaticBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  )
}

export function Divider() {
  return <hr className="border-border/30" />
}

// ── Grid helpers ───────────────────────────────────────────────────────────────
export function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

export function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>
}
