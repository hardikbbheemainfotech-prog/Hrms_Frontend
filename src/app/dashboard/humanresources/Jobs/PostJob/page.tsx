"use client"

import React, { useState } from "react"
import api from "@/lib/axios"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PostJobPage() {
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    employee_type: "",
    work_mode: "",
    experience_min: "",
    experience_max: "",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    responsibilities: "",
    openings: ""
  })

  const [loading, setLoading] = useState(false)
  

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post("/hr/post_job", form)
      alert("Job posted successfully")

      setForm({
        title: "",
        department: "",
        location: "",
        employee_type: "",
        work_mode: "",
        experience_min: "",
        experience_max: "",
        salary_min: "",
        salary_max: "",
        description: "",
        requirements: "",
        responsibilities: "",
        openings: ""
      })
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error posting job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 max-w-5xl mx-auto">

      <Card>
        <CardHeader>
          <CardTitle>Post New Job</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <Label>Job Title</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <Label>Department</Label>
              <Input
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <div>
              <Label>Employee Type</Label>
              <Select onValueChange={(v) => handleChange("employee_type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Work Mode</Label>
              <Select onValueChange={(v) => handleChange("work_mode", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Openings</Label>
              <Input
                type="number"
                value={form.openings}
                onChange={(e) => handleChange("openings", e.target.value)}
              />
            </div>

            <div>
              <Label>Min Experience</Label>
              <Input
                type="number"
                value={form.experience_min}
                onChange={(e) => handleChange("experience_min", e.target.value)}
              />
            </div>

            <div>
              <Label>Max Experience</Label>
              <Input
                type="number"
                value={form.experience_max}
                onChange={(e) => handleChange("experience_max", e.target.value)}
              />
            </div>

            <div>
              <Label>Min Salary</Label>
              <Input
                type="number"
                value={form.salary_min}
                onChange={(e) => handleChange("salary_min", e.target.value)}
              />
            </div>

            <div>
              <Label>Max Salary</Label>
              <Input
                type="number"
                value={form.salary_max}
                onChange={(e) => handleChange("salary_max", e.target.value)}
              />
            </div>

          </div>

          {/* Textareas */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <Label>Requirements</Label>
            <Textarea
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
            />
          </div>

          <div>
            <Label>Responsibilities</Label>
            <Textarea
              value={form.responsibilities}
              onChange={(e) => handleChange("responsibilities", e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}