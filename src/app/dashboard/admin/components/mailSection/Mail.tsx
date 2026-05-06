'use client'

import { useState, useEffect, useRef } from 'react'
import { Employee } from '@/types/mailTypes'
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  EmployeeSelect,
  Grid2,
} from '@/components/mail/shared'
import { Paperclip } from 'lucide-react'
import api from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'

interface Department {
  department_id: number
  name: string
}

interface Props {
  employees: Employee[]
  departments: Department[]
  loadingEmployees: boolean
  loadingDepartments: boolean
  getEmployeeById: (id: number) => Employee | undefined
  onFormChange: (data: Record<string, unknown>) => void
}

export function Mail({
  employees = [],
  departments = [],
  loadingEmployees,
  onFormChange,
}: Props) {
  const { toast } = useToast()

  const [recipientMode, setRecipientMode] = useState<'individual' | 'group'>(
    'individual'
  )

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    employee_id_display: '',
    employee_email: '',
    subject: '',
    body: '',
    attachment_note: '',
    action_required: '',
    closing_remarks: '',
  })

  useEffect(() => {
    onFormChange({
      ...form,
      template_key: 'GENERAL_EMPLOYEE_NOTIFICATION',
      recipient_mode: recipientMode,
      recipient_group: recipientMode === 'group' ? selectedGroup : null,
      department_id:
        recipientMode === 'group' && selectedGroup === 'Department-wise'
          ? selectedDepartmentId
          : null,
      employee_id:
        recipientMode === 'individual' ? selectedEmployeeId : null,
      to_email:
        recipientMode === 'individual' ? form.employee_email : null,
      attachments: attachedFiles,
    })
  }, [
    form,
    recipientMode,
    selectedGroup,
    selectedDepartmentId,
    selectedEmployeeId,
    attachedFiles,
    onFormChange,
  ])

  const setField =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }))
    }

  const handleEmployeeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value
    setSelectedEmployeeId(id)

    const emp = employees.find(
      (employee) => String(employee.employee_id) === id
    )

    if (emp) {
      setForm((prev) => ({
        ...prev,
        employee_id_display: String(emp.employee_id),
        employee_email: emp.email,
      }))
    }
  }

  const resetForm = () => {
    setForm({
      employee_id_display: '',
      employee_email: '',
      subject: '',
      body: '',
      attachment_note: '',
      action_required: '',
      closing_remarks: '',
    })

    setSelectedEmployeeId('')
    setSelectedGroup('')
    setSelectedDepartmentId('')
    setAttachedFiles([])
    if (fileRef.current) fileRef.current.value = ''
  }

  const validateForm = () => {
    if (!form.subject.trim()) {
      toast({
        variant: 'destructive',
        title: 'Subject is required',
      })
      return false
    }

    if (!form.body.trim()) {
      toast({
        variant: 'destructive',
        title: 'Mail body is required',
      })
      return false
    }

    if (recipientMode === 'individual' && !selectedEmployeeId) {
      toast({
        variant: 'destructive',
        title: 'Please select an employee',
      })
      return false
    }

    if (recipientMode === 'group' && !selectedGroup) {
      toast({
        variant: 'destructive',
        title: 'Please select a group',
      })
      return false
    }

    if (
      recipientMode === 'group' &&
      selectedGroup === 'Department-wise' &&
      !selectedDepartmentId
    ) {
      toast({
        variant: 'destructive',
        title: 'Please select a department',
      })
      return false
    }

    return true
  }

const handleSend = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault()

  if (!validateForm()) return

  try {
    setLoading(true)

    let attachment_base64_files: any[] = []

    for (const file of attachedFiles) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }

        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      attachment_base64_files.push({
        filename: file.name,
        mimetype: file.type,
        content: base64,
      })
    }

    await api.post('/admin/mail/send', {
      mail_type: 'GENERAL_EMPLOYEE_NOTIFICATION',

      to_email:
        recipientMode === 'individual'
          ? form.employee_email
          : null,

      data: {
        recipient_type: 'EMPLOYEE',
        recipient_mode: recipientMode,

        employee_id:
          recipientMode === 'individual'
            ? selectedEmployeeId
            : null,

        recipient_group:
          recipientMode === 'group'
            ? selectedGroup
            : null,

        department_id:
          recipientMode === 'group' &&
          selectedGroup === 'Department-wise'
            ? selectedDepartmentId
            : null,

        subject: form.subject,
        body: form.body,
        attachment_note: form.attachment_note,
        action_required: form.action_required,
        closing_remarks: form.closing_remarks,

        attachments: attachment_base64_files,
      },
    })

    toast({
      variant: 'default',
      title: 'Mail sent successfully',
    })

    resetForm()
  } catch (error: any) {
    console.error(error)

    toast({
      variant: 'destructive',
      title: 'Failed to send mail',
      description:
        error?.response?.data?.message ||
        'Something went wrong while sending the mail.',
    })
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="w-full overflow-auto no-scrollbar">
      <Card title="Recipient">
        <div className="flex gap-2 mb-3">
          {(['individual', 'group'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setRecipientMode(mode)
                setSelectedEmployeeId('')
                setSelectedGroup('')
                setSelectedDepartmentId('')
              }}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize border ${
                recipientMode === mode
                  ? 'bg-[#5A0F2E] text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              {mode}
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
                <option value="All employees">All employees</option>
                <option value="Department-wise">Department-wise</option>
                <option value="Management">Management</option>
                <option value="New joiners">New joiners</option>
              </Select>
            </Field>

            {selectedGroup === 'Department-wise' && (
              <Field label="Department">
                <select
                  value={selectedDepartmentId}
                  onChange={(e) =>
                    setSelectedDepartmentId(e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select department</option>

                  {departments.map((dept) => (
                    <option
                      key={dept.department_id}
                      value={dept.department_id}
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        )}
      </Card>

      <Card title="Mail content">
        <Field label="Subject">
          <Input
            value={form.subject}
            onChange={setField('subject')}
            placeholder="e.g. Important company update"
          />
        </Field>

        <Field label="Body">
          <Textarea
            value={form.body}
            onChange={setField('body')}
            rows={5}
            placeholder="Write your official message..."
          />
        </Field>

        <Field label="Attachment note">
          <Input
            value={form.attachment_note}
            onChange={setField('attachment_note')}
            placeholder="Please find attached..."
          />
        </Field>

        <Field label="Action required">
          <Textarea
            value={form.action_required}
            onChange={setField('action_required')}
            placeholder="Please acknowledge..."
          />
        </Field>

        <Field label="Closing remarks">
          <Textarea
            value={form.closing_remarks}
            onChange={setField('closing_remarks')}
            placeholder="Thank you..."
          />
        </Field>

        <Field label="Attach Documents" hint="PDF, DOC, DOCX up to 10MB">
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border">
              <Paperclip size={16} />
            </div>

            <div className="flex-1 min-w-0">
              {attachedFiles.length > 0 ? (
                <>
                  <p className="text-xs font-medium truncate">
                    {attachedFiles.length} file(s) attached
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {attachedFiles.map((file) => file.name).join(', ')}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-gray-500">
                    Click to attach files
                  </p>
                  <p className="text-[11px] text-gray-400">
                    PDF, DOC, DOCX
                  </p>
                </>
              )}
            </div>

            {attachedFiles.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setAttachedFiles([])
                }}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setAttachedFiles(Array.from(e.target.files))
              }
            }}
          />
        </Field>

        <div className="flex justify-end mt-5">
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2 bg-[#5A0F2E] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Mail'}
          </button>
        </div>
      </Card>
    </div>
  )
}