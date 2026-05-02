'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mail'
import { Card, Field, Input, Textarea, InterviewSelect, Grid2, StaticBadge } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

export function CandidateRejectionPanel({ interviews, loadingInterviews, getInterviewById }: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', position: '', optional_feedback: '',
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
          <Field label="Candidate name"><Input value={form.candidate_name} onChange={set('candidate_name')} placeholder="e.g. Sneha Patel" /></Field>
          <Field label="Candidate email"><Input type="email" value={form.candidate_email} onChange={set('candidate_email')} placeholder="candidate@email.com" /></Field>
          <Field label="Position applied for"><Input value={form.position} onChange={set('position')} placeholder="e.g. UI/UX Designer" /></Field>
        </Grid2>
      </Card>

      <Card title="Optional personalisation">
        <Field label="Specific feedback / reason (optional)" hint="Leave blank to use the standard rejection message">
          <Textarea value={form.optional_feedback} onChange={set('optional_feedback')}
            placeholder="e.g. We will keep your profile on file for future openings that may be a better fit…" rows={3} />
        </Field>
      </Card>

      <Card title="Static content — auto-included">
        <div className="flex flex-wrap gap-2">
          <StaticBadge label="Thank you note" />
          <StaticBadge label="Appreciation message" />
          <StaticBadge label="Best wishes for future" />
          <StaticBadge label="HR signature" />
        </div>
      </Card>
    </div>
  )
}
