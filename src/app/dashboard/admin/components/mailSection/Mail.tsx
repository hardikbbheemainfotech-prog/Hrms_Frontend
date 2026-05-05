'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  EmployeeSelect,
  Grid2,
  StaticBadge
} from '@/components/mail/shared'

interface Department {
  department_id: number
  name: string
}

interface Props {
  employees: Employee[]
  interviews: Interview[]
  departments: Department[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  loadingDepartments: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
  onFormChange: (data: Record<string, unknown>) => void
}

const CATEGORIES = [
  'Company update',
  'Meeting notice',
  'Policy change',
  'Deadline reminder',
  'Announcement'
] as const

export function Mail({
  employees = [],
  interviews = [],
  departments = [],
  loadingEmployees,
  loadingDepartments,
  onFormChange
}: Props) {

  const [recipientMode, setRecipientMode] = useState<'individual' | 'group'>('individual')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [form, setForm] = useState({
    employee_id_display: '',
    employee_email: '',
    subject: '',
    body: '',
    attachment_note: '',
    action_required: '',
    closing_remarks: ''
  })

  useEffect(() => {
    onFormChange({
      ...form,
      recipient_mode: recipientMode,
      recipient_group: recipientMode === 'group' ? selectedGroup : null,
      department_id: selectedGroup === 'Department-wise' ? selectedDepartmentId : null,
      categories: selectedCategories,
      to_email: recipientMode === 'individual' ? form.employee_email : null
    })
  }, [form, recipientMode, selectedGroup, selectedDepartmentId, selectedCategories])

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedEmployeeId(id)

    const emp = employees.find((x) => String(x.employee_id) === String(id))
    if (emp) {
      setForm((p) => ({
        ...p,
        employee_id_display: String(emp.employee_id),
        employee_email: emp.email
      }))
    }
  }

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    )

  const handleSend = () => {
    console.log('Sending mail data:', {
      ...form,
      recipientMode,
      selectedGroup,
      selectedDepartmentId,
      selectedCategories
    })
  }

  return (
    <div>

      {/* RECIPIENT */}
      <Card title="Recipient">
        <div className="flex gap-2 mb-3">
          {(['individual', 'group'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setRecipientMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${
                recipientMode === m
                  ? 'bg-[#5A0F2E] text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {recipientMode === 'individual' ? (
          <Grid2>
            <Field label="Select employee">
              <EmployeeSelect
                employees={employees}
                loading={loadingEmployees}
                value={selectedEmployeeId}
                onChange={handleEmployeeSelect}
              />
            </Field>

            <Field label="Employee ID">
              <Input value={form.employee_id_display} readOnly />
            </Field>

            <Field label="Employee email">
              <Input value={form.employee_email} readOnly />
            </Field>
          </Grid2>
        ) : (
          <div className="flex flex-col gap-3">

            <Field label="Recipient group">
              <Select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value)
                  setSelectedDepartmentId('')
                }}
              >
                <option value="">Select group</option>
                <option>All employees</option>
                <option>Department-wise</option>
                <option>Management</option>
                <option>New joiners</option>
              </Select>
            </Field>

            {selectedGroup === 'Department-wise' && (
              <Field label="Department">
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        )}
      </Card>

      {/* MAIL CONTENT */}
      <Card title="Mail content">

        <Field label="Subject">
          <Input value={form.subject} onChange={set('subject')} />
        </Field>

        <Field label="Body">
          <Textarea value={form.body} onChange={set('body')} rows={4} />
        </Field>

        <Field label="Attachment note">
          <Input value={form.attachment_note} onChange={set('attachment_note')} />
        </Field>

        <Field label="Action required">
          <Textarea value={form.action_required} onChange={set('action_required')} />
        </Field>

        <Field label="Closing remarks">
          <Textarea value={form.closing_remarks} onChange={set('closing_remarks')} />
        </Field>

        {/* SEND BUTTON */}
        <div className="flex justify-end mt-5">
          <button
            onClick={handleSend}
            className="px-5 py-2 bg-[#5A0F2E] text-white rounded-lg hover:opacity-90"
          >
            Send Mail
          </button>
        </div>

      </Card>

      {/* STATIC */}
      <Card title="Auto content">
        <div className="flex gap-2 flex-wrap">
          <StaticBadge label="Company letterhead" />
          <StaticBadge label="HR signature" />
          <StaticBadge label="Acknowledgement required" />
        </div>
      </Card>

    </div>
  )
}