'use client'

import { useState } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, Select, EmployeeSelect, Grid2, StaticBadge } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

const CATEGORIES = ['Company update', 'Meeting notice', 'Policy change', 'Deadline reminder', 'Announcement'] as const

export function GeneralEmployeePanel({ employees, loadingEmployees }: Props) {
  const [recipientMode, setRecipientMode] = useState<'individual' | 'group'>('individual')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [form, setForm] = useState({
    employee_id_display: '', employee_email: '',
    subject: '', body: '', attachment_note: '',
    action_required: '', closing_remarks: '',
  })

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <Card title="Recipient">
        <div className="flex gap-2 mb-3">
          {(['individual', 'group'] as const).map((m) => (
            <button key={m} onClick={() => setRecipientMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                recipientMode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border/50 hover:bg-muted/30'
              }`}>
              {m === 'individual' ? 'Individual employee' : 'Group / broadcast'}
            </button>
          ))}
        </div>

        {recipientMode === 'individual' ? (
          <Grid2>
            <Field label="Select employee" hint="Fetched from /core/employees">
              <EmployeeSelect employees={employees} loading={loadingEmployees}
                placeholder="Select employee" value={selectedEmployeeId}
                onChange={(e) => {
                  setSelectedEmployeeId(e.target.value)
                  const emp = employees.find((x) => x.employee_id === Number(e.target.value))
                  if (emp) setForm((p) => ({ ...p, employee_id_display: String(emp.employee_id), employee_email: emp.email }))
                }} />
            </Field>
            <Field label="Employee ID"><Input value={form.employee_id_display} readOnly placeholder="Auto-filled" className="opacity-60" /></Field>
            <Field label="Employee email" hint="Auto-filled from selection"><Input value={form.employee_email} readOnly placeholder="Auto-filled" /></Field>
          </Grid2>
        ) : (
          <Field label="Recipient group">
            <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="">Select a group</option>
              <option>All employees</option>
              <option>Department-wise</option>
              <option>Management</option>
              <option>New joiners</option>
            </Select>
          </Field>
        )}
      </Card>

      <Card title="Mail content">
        <Field label="Subject / purpose"><Input value={form.subject} onChange={set('subject')} placeholder="e.g. Q2 Company All-hands — Save the Date" /></Field>

        <Field label="Mail category">
          <div className="flex flex-wrap gap-1.5 mt-1">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => toggleCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                  selectedCategories.includes(cat)
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-background text-muted-foreground border-border/40 hover:bg-muted/30'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Main body / message">
          <Textarea value={form.body} onChange={set('body')} rows={5}
            placeholder="Write the core message here — company updates, meeting agendas, policy changes, or deadline details…" />
        </Field>

        <Field label="Attachments note"><Input value={form.attachment_note} onChange={set('attachment_note')} placeholder="e.g. Please find the updated policy document attached" /></Field>
        <Field label="Action required by employee"><Textarea value={form.action_required} onChange={set('action_required')} rows={2} placeholder="e.g. Please acknowledge this email by EOD 30 May 2026. Raise any concerns with your manager." /></Field>
        <Field label="Closing remarks"><Textarea value={form.closing_remarks} onChange={set('closing_remarks')} rows={2} placeholder="e.g. Thank you for your continued dedication. Feel free to reach out to HR for any queries." /></Field>
      </Card>

      <Card title="Static content — auto-included">
        <div className="flex flex-wrap gap-2">
          <StaticBadge label="Company letterhead" />
          <StaticBadge label="HR / sender signature" />
          <StaticBadge label="Acknowledgement request" />
        </div>
      </Card>
    </div>
  )
}
