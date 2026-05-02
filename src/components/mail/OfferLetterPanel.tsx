'use client'

import { useState, useEffect } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, Select, InterviewSelect, Grid2 } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
}

export function OfferLetterPanel({ interviews, loadingInterviews, getInterviewById }: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', job_title: '', department: '',
    salary_package: '', joining_date: '', work_location: '',
    employment_type: 'Full-time', work_mode: 'On-site',
    acceptance_deadline: '', terms_conditions: '', documents_to_submit: '',
    offer_letter_note: '', hr_contact: '',
  })

  useEffect(() => {
    if (!selectedInterviewId) return
    const iv = getInterviewById(Number(selectedInterviewId))
    if (!iv) return
    setForm((p) => ({ ...p, candidate_name: iv.candidate_name }))
  }, [selectedInterviewId, getInterviewById])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
          <Field label="Candidate name"><Input value={form.candidate_name} onChange={set('candidate_name')} placeholder="e.g. Meera Joshi" /></Field>
          <Field label="Candidate email"><Input type="email" value={form.candidate_email} onChange={set('candidate_email')} placeholder="candidate@email.com" /></Field>
          <Field label="Job title / designation"><Input value={form.job_title} onChange={set('job_title')} placeholder="e.g. Senior Software Engineer" /></Field>
          <Field label="Department"><Input value={form.department} onChange={set('department')} placeholder="e.g. Engineering" /></Field>
        </Grid2>
      </Card>

      <Card title="Offer details">
        <Grid2>
          <Field label="Annual salary package (CTC)"><Input value={form.salary_package} onChange={set('salary_package')} placeholder="e.g. ₹18,00,000 per annum" /></Field>
          <Field label="Joining date"><Input type="date" value={form.joining_date} onChange={set('joining_date')} /></Field>
          <Field label="Work location"><Input value={form.work_location} onChange={set('work_location')} placeholder="e.g. Bengaluru, Karnataka / Remote" /></Field>
          <Field label="Employment type">
            <Select value={form.employment_type} onChange={set('employment_type')}>
              <option>Full-time</option><option>Contract</option><option>Internship</option>
            </Select>
          </Field>
          <Field label="Work mode">
            <Select value={form.work_mode} onChange={set('work_mode')}>
              <option>On-site</option><option>Hybrid</option><option>Remote</option>
            </Select>
          </Field>
          <Field label="Offer acceptance deadline"><Input type="date" value={form.acceptance_deadline} onChange={set('acceptance_deadline')} /></Field>
        </Grid2>
      </Card>

      <Card title="Terms, documents & attachments">
        <Field label="Key terms & conditions"><Textarea value={form.terms_conditions} onChange={set('terms_conditions')} placeholder="e.g. 6-month probation period, 2 months notice period, background verification required…" rows={2} /></Field>
        <Field label="Documents to submit on joining"><Textarea value={form.documents_to_submit} onChange={set('documents_to_submit')} placeholder="e.g. Educational certificates, last 3 payslips, PAN card, Aadhaar, relieving letter…" rows={2} /></Field>
        <Grid2>
          <Field label="Offer letter attachment note"><Input value={form.offer_letter_note} onChange={set('offer_letter_note')} placeholder="e.g. Please find the official offer letter attached" /></Field>
          <Field label="HR / recruiter contact"><Input value={form.hr_contact} onChange={set('hr_contact')} placeholder="Name, email, phone" /></Field>
        </Grid2>
      </Card>
    </div>
  )
}
