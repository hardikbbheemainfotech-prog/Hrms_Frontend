import { useState, useEffect } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import { Applicant } from "@/types/hrTypes"

export interface InterviewForm {
  candidate_name: string
  job_id: string
  interview_type: string
  interview_mode: string
  interviewer_id: string
  scheduled_at: string
  location: string
  status: string
}

export interface FinalForm {
  result: string
  feedback: string
  rating: string
}

const INITIAL_FORM: InterviewForm = {
  candidate_name: "",
  job_id: "",
  interview_type: "",
  interview_mode: "",
  interviewer_id: "",
  scheduled_at: "",
  location: "",
  status: "scheduled"
}

const INITIAL_FINAL_FORM: FinalForm = {
  result: "",
  feedback: "",
  rating: ""
}

export function useInterviews() {
  const [employees, setEmployees] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [interviews, setInterviews] = useState<any[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)

  const [form, setForm] = useState<InterviewForm>(INITIAL_FORM)
  const [finalForm, setFinalForm] = useState<FinalForm>(INITIAL_FINAL_FORM)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFinalChange = (key: string, value: any) => {
    setFinalForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplicantSelect = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setForm((prev) => ({ ...prev, candidate_name: applicant.full_name }))
  }

  const clearApplicant = () => {
    setSelectedApplicant(null)
    setForm((prev) => ({ ...prev, candidate_name: "" }))
  }

  const fetchAll = async () => {
    setFetchLoading(true)
    try {
      const [empRes, jobRes, intRes, appRes] = await Promise.all([
        api.get("/core/employees"),
        api.get("/job/get_posts"),
        api.get("/hr/interviews"),
        api.get("/hr/applicants")
      ])

      setEmployees(empRes.data?.data || [])
      setJobs(jobRes.data?.data?.jobs || [])
      setInterviews(intRes.data?.data?.interviews || [])
      setApplicants(appRes.data?.message || [])
    } catch {
      setEmployees([])
      setJobs([])
      setInterviews([])
      setApplicants([])
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const scheduleInterview = async () => {
    setLoading(true)
    try {
      await api.post("/hr/schedule_interviews", {
        ...form,
        job_id: Number(form.job_id),
        interviewer_id: Number(form.interviewer_id),
        scheduled_at: dayjs(form.scheduled_at).toISOString(),
        ...(selectedApplicant && { application_id: selectedApplicant.application_id })
      })

      setForm(INITIAL_FORM)
      setSelectedApplicant(null)
      await fetchAll()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || "Schedule failed" }
    } finally {
      setLoading(false)
    }
  }

  const finalizeInterview = async (interview: any) => {
    try {
      await api.patch(`/hr/interviews/${interview.interview_id}/finalize`, {
        status: "completed",
        result: finalForm.result,
        feedback: finalForm.feedback,
        rating: Number(finalForm.rating),
        started_at: interview.scheduled_at,
        ended_at: new Date(),
        interview_mode: interview.interview_mode,
        location: interview.location
      })

      setActiveId(null)
      setFinalForm(INITIAL_FINAL_FORM)
      await fetchAll()
      return { success: true }
    } catch {
      return { success: false, message: "Finalize failed" }
    }
  }

  const cancelInterview = async (id: number) => {
    try {
      await api.patch(`/hr/interviews/${id}`, { status: "cancelled" })
      await fetchAll()
      return { success: true }
    } catch {
      return { success: false, message: "Cancel failed" }
    }
  }

  return {
    // Data
    employees, jobs, interviews, applicants,

    // Form state
    form, finalForm, selectedApplicant, activeId,

    // Loading
    loading, fetchLoading,

    // Setters
    setActiveId, setFinalForm,

    // Handlers
    handleChange, handleFinalChange, handleApplicantSelect, clearApplicant,

    // API actions
    scheduleInterview, finalizeInterview, cancelInterview, fetchAll
  }
}