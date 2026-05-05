"use client"

import React, { useState } from "react"
import dayjs from "dayjs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  BriefcaseBusiness, CalendarDays, Check,
  ChevronsUpDown, Coins, FileUser, Mail,
  Phone, User, Eye, Building2, Clock, FileText,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Applicant } from "@/types/hrTypes"
import { useInterviews } from "@/hooks/Useinterviews"

const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
}

function parseResumeUrl(raw: string | { url: string } | null | undefined): string | null {
  if (!raw) return null
  if (typeof raw === "object") return (raw as any).url || null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.url || null
  } catch {
    return raw.startsWith("http") ? raw : null
  }
}

const APP_TYPE_STYLE: Record<string, string> = {
  job: "bg-blue-100 text-blue-700",
  internship: "bg-purple-100 text-purple-700",
  referral: "bg-orange-100 text-orange-700"
}

export default function InterviewPage() {
  const {
    employees, jobs, interviews, applicants,
    form, finalForm, selectedApplicant, activeId,
    loading, fetchLoading,
    setActiveId,
    handleChange, handleFinalChange,
    handleApplicantSelect, clearApplicant,
    scheduleInterview, finalizeInterview, cancelInterview
  } = useInterviews()

  const [applicantOpen, setApplicantOpen] = useState(false)
  const [viewApplicant, setViewApplicant] = useState<Applicant | null>(null)

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-6">

      <Tabs defaultValue="schedule">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Schedule Interview</TabsTrigger>
          <TabsTrigger value="interviews">
            Interviews
            {interviews.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-1.5 py-0.5">
                {interviews.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="applicants">
            Applicants
            {applicants.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-1.5 py-0.5">
                {applicants.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ================= SCHEDULE TAB ================= */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Auto-fill section */}
              <div className="rounded-lg border border-dashed border-[#5A0F2E] bg-[#fcf3f7] p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#5A0F2E]">
                  <User className="w-4 h-4" />
                  Auto-fill from Applicant
                </div>

                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Popover open={applicantOpen} onOpenChange={setApplicantOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={applicantOpen}
                          className="w-full justify-between font-normal"
                        >
                          {selectedApplicant ? selectedApplicant.full_name : "Search applicant..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search by name, email, or company..." />
                          <CommandList>
                            <CommandEmpty>No applicants found.</CommandEmpty>
                            <CommandGroup>
                              {applicants.map((applicant) => (
                                <CommandItem
                                  key={applicant.application_id}
                                  value={`${applicant.full_name} ${applicant.email} ${applicant.current_company}`}
                                  onSelect={() => {
                                    handleApplicantSelect(applicant)
                                    setApplicantOpen(false)
                                  }}
                                  className="flex flex-col items-start gap-0.5 py-2"
                                >
                                  <div className="flex w-full items-center gap-2">
                                    <Check
                                      className={cn(
                                        "h-4 w-4 shrink-0",
                                        selectedApplicant?.application_id === applicant.application_id
                                          ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{applicant.full_name}</p>
                                      <p className="text-xs text-gray-500 truncate">
                                        {applicant.email}
                                        {applicant.current_company && ` • ${applicant.current_company}`}
                                      </p>
                                    </div>
                                    {applicant.application_type && (
                                      <Badge variant="secondary" className="text-xs shrink-0">
                                        {applicant.application_type}
                                      </Badge>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedApplicant && (
                    <Button variant="ghost" size="sm" onClick={clearApplicant} className="text-gray-400 hover:text-red-500">
                      Clear
                    </Button>
                  )}
                </div>

                {selectedApplicant && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedApplicant.email && (
                      <span className="bg-white border rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E]">
                        <Mail size={13} /> {selectedApplicant.email}
                      </span>
                    )}
                    {selectedApplicant.phone && (
                      <span className="bg-white border rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E]">
                        <Phone size={13} /> {selectedApplicant.phone}
                      </span>
                    )}
                    {selectedApplicant.experience != null && (
                      <span className="bg-white border rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E]">
                        <BriefcaseBusiness size={13} /> {selectedApplicant.experience} yrs exp
                      </span>
                    )}
                    {selectedApplicant.notice_period != null && (
                      <span className="bg-white border rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E]">
                        <CalendarDays size={13} /> {selectedApplicant.notice_period}d notice
                      </span>
                    )}
                    {selectedApplicant.expected_salary != null && (
                      <span className="bg-white border rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E]">
                        <Coins size={13} /> ₹{Number(selectedApplicant.expected_salary).toLocaleString()}
                      </span>
                    )}
                    {parseResumeUrl(selectedApplicant.resume_url) && (
                      <a
                        href={parseResumeUrl(selectedApplicant.resume_url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-100 border border-red-200 rounded-full px-2 py-0.5 flex gap-1.5 items-center text-[#5A0F2E] hover:underline"
                      >
                        <FileUser size={13} /> Resume
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Candidate Name</Label>
                  <Input
                    value={form.candidate_name}
                    onChange={(e) => handleChange("candidate_name", e.target.value)}
                    placeholder="Enter candidate name"
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
                <Button onClick={scheduleInterview} disabled={loading}>
                  {loading ? "Scheduling..." : "Schedule"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= INTERVIEWS TAB ================= */}
        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No interviews scheduled</p>
              ) : (
                interviews.map((i) => (
                  <div key={i.interview_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{i.candidate_name}</p>
                        <p className="text-sm text-gray-500">{i.interview_type} • {i.interview_mode}</p>
                        <p className="text-xs text-gray-400">
                          {dayjs(i.scheduled_at).format("DD MMM YYYY hh:mm A")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_STYLE[i.status]}>{i.status}</Badge>
                        {i.status === "scheduled" && (
                          <>
                            <Button size="sm" onClick={() => setActiveId(i.interview_id)}>Finalize</Button>
                            <Button size="sm" variant="destructive" onClick={() => cancelInterview(i.interview_id)}>Cancel</Button>
                          </>
                        )}
                      </div>
                    </div>

                    {activeId === i.interview_id && (
                      <div className="mt-4 border-t pt-4 space-y-4">
                        <div>
                          <Label>Result</Label>
                          <Select value={finalForm.result} onValueChange={(v) => handleFinalChange("result", v)}>
                            <SelectTrigger><SelectValue placeholder="Select result" /></SelectTrigger>
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
                            onChange={(e) => handleFinalChange("feedback", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Rating (1-5)</Label>
                          <Input
                            type="number" min="1" max="5"
                            value={finalForm.rating}
                            onChange={(e) => handleFinalChange("rating", e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => finalizeInterview(i)}>Submit</Button>
                          <Button size="sm" variant="outline" onClick={() => setActiveId(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= APPLICANTS TAB ================= */}
        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>All Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              {fetchLoading ? (
                <p className="text-gray-400 text-center py-8">Loading...</p>
              ) : applicants.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No applicants found</p>
              ) : (
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant.application_id}
                      className="border rounded-lg p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#fcf3f7] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-[#5A0F2E]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">{applicant.full_name}</p>
                            <Badge className={cn("text-xs", APP_TYPE_STYLE[applicant.application_type] || "bg-gray-100 text-gray-600")}>
                              {applicant.application_type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={11} /> {applicant.email}
                            </span>
                            {applicant.current_company && applicant.current_company !== "NA" && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Building2 size={11} /> {applicant.current_company}
                              </span>
                            )}
                            {applicant.experience && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <BriefcaseBusiness size={11} /> {applicant.experience} yrs
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={11} /> {dayjs(applicant.applied_at).format("DD MMM YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 shrink-0"
                        onClick={() => setViewApplicant(applicant)}
                      >
                        <Eye size={14} /> View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ================= APPLICANT DETAIL DIALOG ================= */}
      <Dialog open={!!viewApplicant} onOpenChange={(open) => !open && setViewApplicant(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>

          {viewApplicant && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#fcf3f7] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#5A0F2E]" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{viewApplicant.full_name}</p>
                  <Badge className={cn("text-xs", APP_TYPE_STYLE[viewApplicant.application_type] || "bg-gray-100 text-gray-600")}>
                    {viewApplicant.application_type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow icon={<Mail size={14} />} label="Email" value={viewApplicant.email} />
                <InfoRow icon={<Phone size={14} />} label="Phone" value={viewApplicant.phone} />
                <InfoRow
                  icon={<Building2 size={14} />}
                  label="Current Company"
                  value={viewApplicant.current_company !== "NA" ? viewApplicant.current_company : "—"}
                />
                <InfoRow icon={<BriefcaseBusiness size={14} />} label="Experience" value={`${viewApplicant.experience} years`} />
                <InfoRow icon={<Coins size={14} />} label="Expected Salary" value={`₹${Number(viewApplicant.expected_salary).toLocaleString()}`} />
                <InfoRow icon={<CalendarDays size={14} />} label="Notice Period" value={`${viewApplicant.notice_period} days`} />
                <InfoRow
                  icon={<Clock size={14} />}
                  label="Applied At"
                  value={dayjs(viewApplicant.applied_at).format("DD MMM YYYY")}
                  className="col-span-2"
                />
              </div>

              {viewApplicant.cover_letter && viewApplicant.cover_letter !== "NA" && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <FileText size={13} /> Cover Letter
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 leading-relaxed">
                    {viewApplicant.cover_letter}
                  </p>
                </div>
              )}

              {parseResumeUrl(viewApplicant.resume_url) && (
                <a href={parseResumeUrl(viewApplicant.resume_url)!} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <FileUser size={14} /> View Resume
                  </Button>
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  className
}: {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-xs text-gray-400 flex items-center gap-1">{icon} {label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">{value || "—"}</p>
    </div>
  )
}
