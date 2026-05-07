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

export function NextRoundInvitationPanel({
  interviews,
  loadingInterviews,
  getEmployeeById,
  onFormChange,
}: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')

  const [form, setForm] = useState({
    candidate_name: '',
    candidate_email: '',
    position: '',
    round_number: '',
    last_interview_date: '',
    last_round_type: '',
    last_interviewer_name: '',
    new_date: '',
    new_time: '',
    duration: '90',
    venue: '',
    interview_mode: 'Online (Video call)',
    documents: '',
    confirmation_deadline: '',
  })

  useEffect(() => {
    if (!selectedInterviewId) return

    const iv = interviews.find(
      (i) => String(i.interview_id) === String(selectedInterviewId)
    )

    if (!iv) return

    const d = iv.scheduled_at ? new Date(iv.scheduled_at) : null

    let interviewerName = ''

    if (iv.first_name || iv.last_name) {
      interviewerName = `${iv.first_name ?? ''} ${iv.last_name ?? ''}`.trim()
    }
    else if (iv.interviewer_id) {
      const interviewer = getEmployeeById(iv.interviewer_id)
      if (interviewer) {
        interviewerName =
          `${interviewer.first_name} ${interviewer.last_name}`.trim()
      }
    }

    setForm((prev) => ({
      ...prev,
      candidate_name: iv.candidate_name || '',
      candidate_email: iv.candidate_email || '',
      position: iv.job_title || '',
      last_round_type: iv.interview_type || '',
      last_interview_date: d ? d.toISOString().split('T')[0] : '',
      last_interviewer_name: interviewerName,
      venue: iv.location || '',
      interview_mode: iv.interview_mode || 'Online (Video call)',
    }))
  }, [selectedInterviewId, interviews, getEmployeeById])

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
      <Card title="Pre-fill from previous interview">
        <Field
          label="Select previous interview"
          hint="Auto-fills candidate name, last round details, and interviewer"
        >
          <InterviewSelect
            interviews={interviews}
            loading={loadingInterviews}
            placeholder="Pick previous interview"
            value={selectedInterviewId}
            onChange={(e) => setSelectedInterviewId(e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Candidate & position">
        <Grid2>
          <Field label="Candidate name">
            <Input
              value={form.candidate_name}
              onChange={set('candidate_name')}
              placeholder="e.g. Rohan Das"
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

          <Field label="Position">
            <Input
              value={form.position}
              onChange={set('position')}
              placeholder="e.g. DevOps Engineer"
            />
          </Field>

          <Field label="Round number">
            <Input
              value={form.round_number}
              onChange={set('round_number')}
              placeholder="e.g. Round 2 — Technical"
            />
          </Field>
        </Grid2>
      </Card>

      <Card title="Previous round summary">
        <Grid3>
          <Field label="Last interview date">
            <Input
              type="date"
              value={form.last_interview_date}
              onChange={set('last_interview_date')}
            />
          </Field>

          <Field label="Last round type">
            <Input
              value={form.last_round_type}
              onChange={set('last_round_type')}
              placeholder="e.g. HR Screening"
            />
          </Field>

          <Field label="Interviewer name">
            <Input
              value={form.last_interviewer_name}
              onChange={set('last_interviewer_name')}
              placeholder="Auto-filled"
            />
          </Field>
        </Grid3>
      </Card>

      <Card title="Next round schedule">
        <Grid3>
          <Field label="Date">
            <Input
              type="date"
              value={form.new_date}
              onChange={set('new_date')}
            />
          </Field>

          <Field label="Time">
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

          <Field label="Venue / meeting link">
            <Input
              value={form.venue}
              onChange={set('venue')}
              placeholder="Conference room or Zoom URL"
            />
          </Field>
        </Grid2>
      </Card>

      <Card title="Requirements">
        <Field label="Documents to bring / prepare">
          <Textarea
            value={form.documents}
            onChange={set('documents')}
            placeholder="e.g. Updated resume, coding assignment, portfolio link…"
            rows={2}
          />
        </Field>

        <Field label="Confirmation request">
          <Input
            value={form.confirmation_deadline}
            onChange={set('confirmation_deadline')}
            placeholder="e.g. Please confirm attendance by 22 May 2026"
          />
        </Field>
      </Card>
    </div>
  )
}