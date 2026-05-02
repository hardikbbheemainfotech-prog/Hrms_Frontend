'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, InterviewSelect, Grid2, StaticBadge } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

export function CandidateSelectedPanel({ interviews, loadingInterviews, getInterviewById }: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', position: '', department: '',
    next_steps: '', documents_required: '', poc: '', response_deadline: '',
  })

  useEffect(() => {
    if (!selectedInterviewId) return
    const iv = getInterviewById(Number(selectedInterviewId))
    if (!iv) return
    setForm((p) => ({ ...p, candidate_name: iv.candidate_name }))
  }, [selectedInterviewId, getInterviewById])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <Card title="Pre-fill from interview record">
        <Field label="Select interview" hint="Auto-fills candidate name">
          <InterviewSelect interviews={interviews} loading={loadingInterviews}
            placeholder="Pick an interview to pre-fill" value={selectedInterviewId}
            onChange={(e) => setSelectedInterviewId(e.target.value)} />
        </Field>
      </Card>

      <Card title="Candidate details">
        <Grid2>
          <Field label="Candidate name"><Input value={form.candidate_name} onChange={set('candidate_name')} placeholder="e.g. Ankit Verma" /></Field>
          <Field label="Candidate email"><Input type="email" value={form.candidate_email} onChange={set('candidate_email')} placeholder="candidate@email.com" /></Field>
          <Field label="Position applied for"><Input value={form.position} onChange={set('position')} placeholder="e.g. Data Analyst" /></Field>
          <Field label="Department"><Input value={form.department} onChange={set('department')} placeholder="e.g. Analytics" /></Field>
        </Grid2>
      </Card>

      <Card title="Next steps (detailed)">
        <Field label="Next process / steps"><Textarea value={form.next_steps} onChange={set('next_steps')} placeholder="e.g. HR will share offer letter within 2 working days. Background verification will be initiated…" rows={3} /></Field>
        <Field label="Documents required"><Textarea value={form.documents_required} onChange={set('documents_required')} placeholder="e.g. Educational certificates, last 3 months payslips, ID proof…" rows={2} /></Field>
        <Grid2>
          <Field label="Point of contact"><Input value={form.poc} onChange={set('poc')} placeholder="HR name, email, phone" /></Field>
          <Field label="Response deadline"><Input value={form.response_deadline} onChange={set('response_deadline')} placeholder="e.g. Kindly respond by 30 May 2026" /></Field>
        </Grid2>
      </Card>

      <Card title="Static content — auto-included">
        <div className="flex flex-wrap gap-2">
          <StaticBadge label="Congratulations message" />
          <StaticBadge label="Company welcome note" />
          <StaticBadge label="Closing & HR signature" />
        </div>
      </Card>
    </div>
  )
}
