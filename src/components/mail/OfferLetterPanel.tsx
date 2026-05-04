'use client'

import { useState, useEffect, useRef } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import { Card, Field, Input, Textarea, Select, InterviewSelect, Grid2 } from './shared'

interface Props {
  employees: Employee[]
  interviews: Interview[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  getInterviewById: (id: number) => Interview | undefined
  getEmployeeById: (id: number) => Employee | undefined
  onFormChange: (data: Record<string, unknown>) => void
}

export function OfferLetterPanel({ interviews, loadingInterviews, onFormChange }: Props) {
  const [selectedInterviewId, setSelectedInterviewId] = useState('')
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', job_title: '', department: '',
    salary_package: '', joining_date: '', work_location: '',
    employment_type: 'Full-time', work_mode: 'On-site',
    acceptance_deadline: '', terms_conditions: '', documents_to_submit: '',
    offer_letter_note: '', hr_contact: '',
  })

  useEffect(() => {
    onFormChange({ ...form, offer_letter_file: attachedFile })
  }, [form, attachedFile])

  useEffect(() => {
    if (!selectedInterviewId || interviews.length === 0) return
    const iv = interviews.find((i) => String(i.interview_id) === String(selectedInterviewId))
    if (!iv) return
    setForm((p) => ({
      ...p,
      candidate_name: iv.candidate_name,
      candidate_email: iv.candidate_email ?? '',
      job_title: iv.job_title ?? '',
    }))
  }, [selectedInterviewId, interviews])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <Card title="Pre-fill from interview record">
        <Field label="Select interview" hint="Auto-fills candidate name and job title">
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
        <Field label="Key terms & conditions">
          <Textarea value={form.terms_conditions} onChange={set('terms_conditions')} placeholder="e.g. 6-month probation period, 2 months notice period…" rows={2} />
        </Field>
        <Field label="Documents to submit on joining">
          <Textarea value={form.documents_to_submit} onChange={set('documents_to_submit')} placeholder="e.g. Educational certificates, last 3 payslips, PAN card, Aadhaar, relieving letter…" rows={2} />
        </Field>
        <Grid2>
          <Field label="HR / recruiter contact">
            <Input value={form.hr_contact} onChange={set('hr_contact')} placeholder="Name, email, phone" />
          </Field>
          <Field label="Offer letter attachment note">
            <Input value={form.offer_letter_note} onChange={set('offer_letter_note')} placeholder="e.g. Please find the official offer letter attached" />
          </Field>
        </Grid2>

        {/* File attachment */}
        <Field label="Attach offer letter (PDF)" hint="Attach the signed offer letter to be sent with the email">
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background text-sm">
              📎
            </div>
            <div className="flex-1 min-w-0">
              {attachedFile ? (
                <>
                  <p className="text-xs font-medium text-foreground truncate">{attachedFile.name}</p>
                  <p className="text-[11px] text-muted-foreground/60">
                    {(attachedFile.size / 1024).toFixed(1)} KB — click to replace
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-muted-foreground">Click to attach offer letter</p>
                  <p className="text-[11px] text-muted-foreground/60">PDF, DOC, DOCX up to 10MB</p>
                </>
              )}
            </div>
            {attachedFile && (
              <button
                onClick={(e) => { e.stopPropagation(); setAttachedFile(null) }}
                className="text-xs text-destructive hover:underline shrink-0"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)}
          />
        </Field>
      </Card>
    </div>
  )
}