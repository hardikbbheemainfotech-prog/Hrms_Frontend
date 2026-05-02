'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, EmployeeSelect, InterviewSelect, Grid2, StaticBadge } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

export function JoiningInstructionsPanel({ employees, interviews, loadingEmployees, loadingInterviews, getInterviewById, getEmployeeById }: Props) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [form, setForm] = useState({
    employee_name: '', employee_email: '', job_designation: '', department: '',
    joining_date: '', reporting_time: '',
    office_location: '', reporting_manager: '', manager_contact: '', hr_contact: '',
    documents_to_bring: '', day1_instructions: '',
  })

  // Auto-fill from selected employee
  useEffect(() => {
    if (!selectedEmployeeId) return
    const emp = getEmployeeById(Number(selectedEmployeeId))
    if (!emp) return
    setForm((p) => ({
      ...p,
      employee_name: `${emp.first_name} ${emp.last_name}`,
      employee_email: emp.email,
      job_designation: emp.job_title,
    }))
  }, [selectedEmployeeId, getEmployeeById])

  // Auto-fill reporting manager from interview (interviewer)
  useEffect(() => {
    if (!selectedInterviewId) return
    const iv = getInterviewById(Number(selectedInterviewId))
    if (!iv) return
    const interviewer = getEmployeeById(iv.interviewer_id)
    if (interviewer) {
      setForm((p) => ({
        ...p,
        reporting_manager: `${interviewer.first_name} ${interviewer.last_name}`,
        manager_contact: interviewer.email,
      }))
    }
  }, [selectedInterviewId, getInterviewById, getEmployeeById])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <Card title="Pre-fill from records">
        <Grid2>
          <Field label="Select employee" hint="Auto-fills name, email, designation">
            <EmployeeSelect employees={employees} loading={loadingEmployees}
              placeholder="Pick employee" value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)} />
          </Field>
          <Field label="Select interview" hint="Auto-fills reporting manager (interviewer)">
            <InterviewSelect interviews={interviews} loading={loadingInterviews}
              placeholder="Pick interview for manager" value={selectedInterviewId}
              onChange={(e) => setSelectedInterviewId(e.target.value)} />
          </Field>
        </Grid2>
      </Card>

      <Card title="New employee details">
        <Grid2>
          <Field label="Employee name"><Input value={form.employee_name} onChange={set('employee_name')} placeholder="e.g. Arjun Kapoor" /></Field>
          <Field label="Employee email"><Input type="email" value={form.employee_email} onChange={set('employee_email')} placeholder="new.employee@company.com" /></Field>
          <Field label="Job designation"><Input value={form.job_designation} onChange={set('job_designation')} placeholder="e.g. Associate Product Manager" /></Field>
          <Field label="Department"><Input value={form.department} onChange={set('department')} placeholder="e.g. Product" /></Field>
          <Field label="Joining date"><Input type="date" value={form.joining_date} onChange={set('joining_date')} /></Field>
          <Field label="Reporting time"><Input type="time" value={form.reporting_time} onChange={set('reporting_time')} /></Field>
        </Grid2>
      </Card>

      <Card title="Office & reporting details">
        <Grid2>
          <Field label="Office / work location"><Input value={form.office_location} onChange={set('office_location')} placeholder="e.g. HQ, 4th Floor, Sector 21, Gurugram" /></Field>
          <Field label="Reporting manager"><Input value={form.reporting_manager} onChange={set('reporting_manager')} placeholder="Auto-filled from interview" /></Field>
          <Field label="Manager email / phone"><Input value={form.manager_contact} onChange={set('manager_contact')} placeholder="Auto-filled from interview" /></Field>
          <Field label="HR / onboarding contact"><Input value={form.hr_contact} onChange={set('hr_contact')} placeholder="HR name, email, phone" /></Field>
        </Grid2>
      </Card>

      <Card title="Documents & instructions">
        <Field label="Documents to bring on day 1"><Textarea value={form.documents_to_bring} onChange={set('documents_to_bring')} placeholder="e.g. Original educational certificates, 2 passport photos, PAN card, Aadhaar, relieving letter…" rows={2} /></Field>
        <Field label="Day 1 instructions"><Textarea value={form.day1_instructions} onChange={set('day1_instructions')} placeholder="e.g. Report to reception, meet HR, laptop will be provisioned, orientation at 10 AM…" rows={2} /></Field>
      </Card>

      <Card title="Static content — auto-included">
        <div className="flex flex-wrap gap-2">
          <StaticBadge label="Welcome to the team message" />
          <StaticBadge label="Company culture note" />
          <StaticBadge label="HR signature" />
        </div>
      </Card>
    </div>
  )
}
