"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function InterviewPage() {

  const [employees, setEmployees] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [activeId, setActiveId] = useState<number | null>(null)

  const [finalForm, setFinalForm] = useState({
    result: "",
    feedback: "",
    rating: ""
  })

  const [form, setForm] = useState({
    candidate_name: "",
    job_id: "",
    interview_type: "",
    interview_mode: "",
    interviewer_id: "",
    scheduled_at: "",
    location: "",
    status: "scheduled"
  })

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // ================= FETCH =================
  const fetchAll = async () => {
    try {
      const [empRes, jobRes, intRes] = await Promise.all([
        api.get("/core/employees"),
        api.get("/hr/get_posts"),
        api.get("/hr/interviews")
      ])

      setEmployees(empRes.data?.data || [])
      setJobs(jobRes.data?.data?.jobs || [])
      setInterviews(intRes.data?.data?.interviews || [])
    } catch {
      setEmployees([])
      setJobs([])
      setInterviews([])
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // ================= CREATE =================
  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post("/hr/schedule_interviews", {
        ...form,
        job_id: Number(form.job_id),
        interviewer_id: Number(form.interviewer_id),
        scheduled_at: dayjs(form.scheduled_at).toISOString()
      })

      fetchAll()

      setForm({
        candidate_name: "",
        job_id: "",
        interview_type: "",
        interview_mode: "",
        interviewer_id: "",
        scheduled_at: "",
        location: "",
        status: "scheduled"
      })

    } catch (err: any) {
      console.log(err?.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  // ================= FINALIZE =================
  const submitFinalize = async (i: any) => {
    try {
      await api.patch(`/hr/interviews/${i.interview_id}/finalize`, {
        status: "completed",
        result: finalForm.result,
        feedback: finalForm.feedback,
        rating: Number(finalForm.rating),
        started_at: i.scheduled_at,
        ended_at: new Date(),
        interview_mode: i.interview_mode,
        location: i.location
      })

      setActiveId(null)
      setFinalForm({ result: "", feedback: "", rating: "" })
      fetchAll()
    } catch {
      console.log("Finalize failed")
    }
  }

  // ================= CANCEL =================
  const cancelInterview = async (id: number) => {
    try {
      await api.patch(`/hr/interviews/${id}`, {
        status: "cancelled"
      })
      fetchAll()
    } catch {
      console.log("Cancel failed")
    }
  }

  const STATUS_STYLE: any = {
    scheduled: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
  }

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-6">

      {/* ================= CREATE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Interview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <Label>Candidate Name</Label>
              <Input
                value={form.candidate_name}
                onChange={(e) => handleChange("candidate_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Job</Label>
              <Select value={form.job_id} onValueChange={(v) => handleChange("job_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select job" /></SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.job_id} value={String(job.job_id)}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interview Type</Label>
              <Select value={form.interview_type} onValueChange={(v) => handleChange("interview_type", v)}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Mode</Label>
              <Select value={form.interview_mode} onValueChange={(v) => handleChange("interview_mode", v)}>
                <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interviewer</Label>
              <Select value={form.interviewer_id} onValueChange={(v) => handleChange("interviewer_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select interviewer" /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={String(emp.employee_id)}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => handleChange("scheduled_at", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* ================= LIST ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {interviews.length === 0 ? (
            <p className="text-gray-400 text-center">No interviews</p>
          ) : (
            interviews.map((i) => (
              <div key={i.interview_id} className="border rounded-lg p-4">

                <div className="flex justify-between items-center">

                  <div>
                    <p className="font-semibold">{i.candidate_name}</p>
                    <p className="text-sm text-gray-500">
                      {i.interview_type} • {i.interview_mode}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayjs(i.scheduled_at).format("DD MMM YYYY hh:mm A")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_STYLE[i.status]}>
                      {i.status}
                    </Badge>

                    {i.status === "scheduled" && (
                      <>
                        <Button size="sm" onClick={() => setActiveId(i.interview_id)}>
                          Finalize
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelInterview(i.interview_id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* ================= FINALIZE FORM ================= */}
                {activeId === i.interview_id && (
                  <div className="mt-4 border-t pt-4 space-y-4">

                    <div>
                      <Label>Result</Label>
                      <Select
                        value={finalForm.result}
                        onValueChange={(v) =>
                          setFinalForm(prev => ({ ...prev, result: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Selected">Selected</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Feedback</Label>
                      <Textarea
                        placeholder="Enter feedback..."
                        value={finalForm.feedback}
                        onChange={(e) =>
                          setFinalForm(prev => ({ ...prev, feedback: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={finalForm.rating}
                        onChange={(e) =>
                          setFinalForm(prev => ({ ...prev, rating: e.target.value }))
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => submitFinalize(i)}>
                        Submit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveId(null)}
                      >
                        Cancel
                      </Button>
                    </div>

                  </div>
                )}

              </div>
            ))
          )}

        </CardContent>
      </Card>

    </div>
  )
}