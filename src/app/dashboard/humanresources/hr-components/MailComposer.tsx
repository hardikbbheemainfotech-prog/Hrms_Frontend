'use client'

import { useState } from 'react'
import { MailKey } from '@/types/mailTypes'
import { useHRData } from '@/hooks/useHRData'
import api from '@/lib/axios'
import { InterviewInvitationPanel } from '@/components/mail/InterviewInvitationPanel'
import { InterviewReschedulePanel } from '@/components/mail/InterviewReschedulePanel'
import { CandidateSelectedPanel } from '@/components/mail/CandidateSelectedPanel'
import { CandidateRejectionPanel } from '@/components/mail/CandidateRejectionPanel'
import { NextRoundInvitationPanel } from '@/components/mail/NextRoundInvitationPanel'
import { OfferLetterPanel } from '@/components/mail/OfferLetterPanel'
import { JoiningInstructionsPanel } from '@/components/mail/JoiningInstructionsPanel'
import { GeneralEmployeePanel } from '@/components/mail/GeneralEmployeePanel'
import { useToast } from '@/hooks/use-toast'

const TABS: { key: MailKey; label: string; description: string }[] = [
  { key: 'INTERVIEW_INVITATION',          label: 'Interview invitation',  description: 'Invite candidate for interview' },
  { key: 'INTERVIEW_RESCHEDULED',         label: 'Reschedule',            description: 'Update interview schedule' },
  { key: 'CANDIDATE_SELECTED',            label: 'Selected',              description: 'Candidate selection result' },
  { key: 'CANDIDATE_REJECTION',           label: 'Rejected',              description: 'Candidate rejection notice' },
  { key: 'NEXT_ROUND_INVITATION',         label: 'Next round',            description: 'Invite to next round' },
  { key: 'OFFER_LETTER',                  label: 'Offer letter',          description: 'Send formal offer' },
  { key: 'JOINING_INSTRUCTIONS',          label: 'Joining instructions',  description: 'Onboarding details' },
  { key: 'GENERAL_EMPLOYEE_NOTIFICATION', label: 'General employee',      description: 'Broadcast notification' },
]

const SEND_LABELS: Record<MailKey, string> = {
  INTERVIEW_INVITATION:           'Send invitation',
  INTERVIEW_RESCHEDULED:          'Send reschedule mail',
  CANDIDATE_SELECTED:             'Send selection mail',
  CANDIDATE_REJECTION:            'Send rejection mail',
  NEXT_ROUND_INVITATION:          'Send next round mail',
  OFFER_LETTER:                   'Send offer letter',
  JOINING_INSTRUCTIONS:           'Send joining instructions',
  GENERAL_EMPLOYEE_NOTIFICATION:  'Send notification',
}

export default function MailComposer() {
  const [activeTab, setActiveTab] = useState<MailKey>('INTERVIEW_INVITATION')
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const {toast} = useToast();

  const {
    employees, interviews,
    loadingEmployees, loadingInterviews,
    errorEmployees, errorInterviews,
    refetchEmployees, refetchInterviews,
    getEmployeeById, getInterviewById,
    departments, loadingDepartments
  } = useHRData()

  const onFormChange = (data: Record<string, unknown>) => {
    setFormData(data)
  }

  const panelProps = {
  employees, interviews, departments,
  loadingEmployees, loadingInterviews, loadingDepartments,
  getEmployeeById, getInterviewById,
  onFormChange,
}

 const handleSend = async () => {
  setSending(true)

  try {
    const payload = {
      mail_type: activeTab,
      to_email:
        formData.candidate_email ??
        formData.employee_email ??
        "",
      data: formData,
    }

    console.log("Sending payload:", payload)

    await api.post("/hr/mail/send", payload)

    toast({
      variant: "default",
      title: "Mail sent successfully",
      description:
        "Your email has been delivered successfully.",
    })
  } catch (e: any) {
    console.error(e)

    toast({
      variant: "destructive",
      title: "Failed to send mail",
      description:
        e?.response?.data?.message ||
        "Something went wrong. Please try again.",
    })
  } finally {
    setSending(false)
  }
}

  const activeTabConfig = TABS.find((t) => t.key === activeTab)!

  return (
    <div className="bg-background text-foreground rounded-3xl">
      <div className="mx-auto max-w-6xl px-6 py-8">

        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Mail composer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a template from the right to compose the appropriate HR notification
          </p>
        </div>

        {errorEmployees && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <span>Failed to load employees: {errorEmployees}</span>
            <button onClick={refetchEmployees} className="ml-4 text-xs underline underline-offset-2">Retry</button>
          </div>
        )}
        {errorInterviews && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <span>Failed to load interviews: {errorInterviews}</span>
            <button onClick={refetchInterviews} className="ml-4 text-xs underline underline-offset-2">Retry</button>
          </div>
        )}

        <div className="flex gap-6 items-start">

          <div className="flex-1 min-w-0">
            <div className="mb-4 rounded-xl border border-border/40 bg-card px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Composing</p>
              <h2 className="text-base font-semibold">{activeTabConfig.label}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{activeTabConfig.description}</p>
            </div>

            {activeTab === 'INTERVIEW_INVITATION'          && <InterviewInvitationPanel {...panelProps} />}
            {activeTab === 'INTERVIEW_RESCHEDULED'         && <InterviewReschedulePanel {...panelProps} />}
            {activeTab === 'CANDIDATE_SELECTED'            && <CandidateSelectedPanel {...panelProps} />}
            {activeTab === 'CANDIDATE_REJECTION'           && <CandidateRejectionPanel {...panelProps} />}
            {activeTab === 'NEXT_ROUND_INVITATION'         && <NextRoundInvitationPanel {...panelProps} />}
            {activeTab === 'OFFER_LETTER'                  && <OfferLetterPanel {...panelProps} />}
            {activeTab === 'JOINING_INSTRUCTIONS'          && <JoiningInstructionsPanel {...panelProps} />}
            {activeTab === 'GENERAL_EMPLOYEE_NOTIFICATION' && <GeneralEmployeePanel {...panelProps} />}

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-4">
              <button className="rounded-lg border border-border/50 bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors">
                Preview
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {sending ? 'Sending…' : `${SEND_LABELS[activeTab]} ↗`}
              </button>
            </div>
          </div>

          <div className="w-56 shrink-0 sticky top-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3 px-1">Templates</p>
            <div className="flex flex-col gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setFormData({}) }}
                  className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors border ${
                    activeTab === tab.key
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-background text-muted-foreground border-transparent hover:bg-muted/30 hover:border-border/40'
                  }`}
                >
                  <p className={`text-xs font-medium ${activeTab === tab.key ? 'text-primary' : ''}`}>{tab.label}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-tight">{tab.description}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}