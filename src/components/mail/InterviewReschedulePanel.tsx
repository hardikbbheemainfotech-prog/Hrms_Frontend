// InterviewReschedulePanel.tsx
'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  InterviewSelect,
  Grid2,
  Grid3,
  Divider,
} from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
  onFormChange: (data: Record<string, unknown>) => void
}

export function InterviewReschedulePanel({
  interviews,
  loadingInterviews,
  onFormChange,
}: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')

  const [form, setForm] = useState({
    candidate_name: '',
    candidate_email: '',
    job_title: '',
    new_date: '',
    new_time: '',
    duration: '60',
    interview_mode: 'Online (Video call)',
    meeting_link: '',
    reason: '',
    instructions: '',
    confirmation_deadline: '',
  })

  // AUTO FILL WHEN INTERVIEW SELECTED
  useEffect(() => {
    if (!selectedInterviewId) return

    const iv = interviews.find(
      (i) => String(i.interview_id) === String(selectedInterviewId)
    )

    if (!iv) return

    setForm((prev) => ({
      ...prev,
      candidate_name: iv.candidate_name || '',
      candidate_email: iv.candidate_email || '',
      job_title: iv.job_title || '',
      interview_mode: iv.interview_mode || 'Online (Video call)',
      meeting_link: iv.location || '',
    }))
  }, [selectedInterviewId, interviews])

  // SEND LIVE DATA TO MAIL COMPOSER
  useEffect(() => {
    onFormChange({
      ...form,
      interview_id: selectedInterviewId,
      to_email: form.candidate_email,
    })
  }, [form, selectedInterviewId, onFormChange])

  const set =
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

  return (
    <div>
      <Card title="Pre-fill from interview record">
        <Field
          label="Select interview"
          hint="Auto-fills candidate name and interview mode"
        >
          <InterviewSelect
            interviews={interviews}
            loading={loadingInterviews}
            placeholder="Pick an interview to pre-fill"
            value={selectedInterviewId}
            onChange={(e) => setSelectedInterviewId(e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Candidate details">
        <Grid2>
          <Field label="Candidate name">
            <Input
              value={form.candidate_name}
              onChange={set('candidate_name')}
              placeholder="e.g. Priya Mehta"
            />
          </Field>

          <Field label="Candidate email">
            <Input
              type="email"
              value={form.candidate_email}
              onChange={set('candidate_email')}
              placeholder="candidate@email.com"
            />
          </Field>

          <Field label="Job title / position">
            <Input
              value={form.job_title}
              onChange={set('job_title')}
              placeholder="e.g. Product Manager"
            />
          </Field>
        </Grid2>
      </Card>

      <Card title="Rescheduled schedule">
        <Grid3>
          <Field label="New date">
            <Input
              type="date"
              value={form.new_date}
              onChange={set('new_date')}
            />
          </Field>

          <Field label="New time">
            <Input
              type="time"
              value={form.new_time}
              onChange={set('new_time')}
            />
          </Field>

          <Field label="Duration (min)">
            <Input
              type="number"
              value={form.duration}
              onChange={set('duration')}
            />
          </Field>
        </Grid3>

        <Divider />

        <Grid2>
          <Field label="Interview mode">
            <Select
              value={form.interview_mode}
              onChange={set('interview_mode')}
            >
              <option>Online (Video call)</option>
              <option>In-person</option>
              <option>Phone</option>
            </Select>
          </Field>

          <Field label="Meeting link / venue">
            <Input
              value={form.meeting_link}
              onChange={set('meeting_link')}
              placeholder="Zoom URL or office address"
            />
          </Field>
        </Grid2>
      </Card>

      <Card title="Communication">
        <Field label="Reason for rescheduling (optional)">
          <Input
            value={form.reason}
            onChange={set('reason')}
            placeholder="e.g. Interviewer unavailability"
          />
        </Field>

        <Field label="Instructions / notes">
          <Textarea
            value={form.instructions}
            onChange={set('instructions')}
            placeholder="Join 5 minutes early, updated link will be shared…"
            rows={2}
          />
        </Field>

        <Field label="Confirmation deadline">
          <Input
            value={form.confirmation_deadline}
            onChange={set('confirmation_deadline')}
            placeholder="e.g. Please confirm by 20 May 2026"
          />
        </Field>
      </Card>
    </div>
  )
}