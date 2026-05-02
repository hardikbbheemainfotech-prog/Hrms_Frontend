'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, Select, InterviewSelect, Grid2, Grid3, Divider } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

export function InterviewInvitationPanel({ interviews, loadingInterviews, getInterviewById, getEmployeeById }: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', job_title: '', department: '',
    interview_date: '', start_time: '', duration: '60',
    interview_mode: 'Online (Video call)', interview_type: 'Technical round',
    meeting_link: '', location: '', interviewer_name: '',
    documents: '', instructions: '', confirmation_deadline: '', hr_contact: '',
  })

  useEffect(() => {
    if (!selectedInterviewId) return
    const iv = getInterviewById(Number(selectedInterviewId))
    if (!iv) return
    const interviewer = getEmployeeById(iv.interviewer_id)
    const d = new Date(iv.scheduled_at)
    setForm((p) => ({
      ...p,
      candidate_name: iv.candidate_name,
      interview_type: iv.interview_type,
      interview_mode: iv.interview_mode,
      interview_date: d.toISOString().split('T')[0],
      start_time: d.toTimeString().slice(0, 5),
      location: iv.location ?? '',
      interviewer_name: interviewer ? `${interviewer.first_name} ${interviewer.last_name}` : '',
    }))
  }, [selectedInterviewId, getInterviewById, getEmployeeById])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <Card title="Pre-fill from interview record">
        <Field label="Select interview" hint="Auto-fills candidate name, schedule, mode, location & interviewer">
          <InterviewSelect interviews={interviews} loading={loadingInterviews}
            placeholder="Pick an interview to pre-fill" value={selectedInterviewId}
            onChange={(e) => setSelectedInterviewId(e.target.value)} />
        </Field>
      </Card>

      <Card title="Candidate & role">
        <Grid2>
          <Field label="Candidate name"><Input value={form.candidate_name} onChange={set('candidate_name')} placeholder="e.g. Rahul Sharma" /></Field>
          <Field label="Candidate email"><Input type="email" value={form.candidate_email} onChange={set('candidate_email')} placeholder="candidate@email.com" /></Field>
          <Field label="Job title"><Input value={form.job_title} onChange={set('job_title')} placeholder="e.g. Senior Backend Engineer" /></Field>
          <Field label="Department"><Input value={form.department} onChange={set('department')} placeholder="e.g. Engineering" /></Field>
        </Grid2>
      </Card>

      <Card title="Interview schedule">
        <Grid3>
          <Field label="Date"><Input type="date" value={form.interview_date} onChange={set('interview_date')} /></Field>
          <Field label="Start time"><Input type="time" value={form.start_time} onChange={set('start_time')} /></Field>
          <Field label="Duration (min)"><Input type="number" value={form.duration} onChange={set('duration')} /></Field>
        </Grid3>
        <Divider />
        <Grid2>
          <Field label="Interview mode">
            <Select value={form.interview_mode} onChange={set('interview_mode')}>
              <option>Online (Video call)</option><option>In-person</option><option>Phone</option>
            </Select>
          </Field>
          <Field label="Interview type">
            <Select value={form.interview_type} onChange={set('interview_type')}>
              <option>Technical round</option><option>HR round</option><option>Managerial round</option><option>Panel interview</option>
            </Select>
          </Field>
          <Field label="Meeting link / venue"><Input value={form.meeting_link} onChange={set('meeting_link')} placeholder="Zoom URL or office address" /></Field>
          <Field label="Location / room"><Input value={form.location} onChange={set('location')} placeholder="e.g. HQ, Floor 3, Room 301" /></Field>
          <Field label="Interviewer name"><Input value={form.interviewer_name} onChange={set('interviewer_name')} placeholder="Auto-filled from interview" /></Field>
        </Grid2>
      </Card>

      <Card title="Requirements & instructions">
        <Field label="Documents to bring"><Textarea value={form.documents} onChange={set('documents')} placeholder="Resume, portfolio, ID proof…" rows={2} /></Field>
        <Field label="Additional instructions"><Textarea value={form.instructions} onChange={set('instructions')} placeholder="Join 5 minutes early, keep mic ready…" rows={2} /></Field>
        <Grid2>
          <Field label="Confirmation deadline"><Input value={form.confirmation_deadline} onChange={set('confirmation_deadline')} placeholder="e.g. Please confirm by 25 May 2026" /></Field>
          <Field label="HR contact"><Input value={form.hr_contact} onChange={set('hr_contact')} placeholder="Name, phone, email" /></Field>
        </Grid2>
      </Card>
    </div>
  )
}
