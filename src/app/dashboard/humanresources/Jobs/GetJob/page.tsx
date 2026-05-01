"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Briefcase, MapPin, IndianRupee, Clock } from "lucide-react"
import { Job } from "@/types/hrTypes"



export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState<"all" | "open" | "closed">("all")

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const res = await api.get("/hr/get_posts")
            setJobs(res.data?.data?.jobs || [])
        } catch {
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    const filteredJobs = jobs.filter((job) => {
        if (filter === "all") return true
        return job.status?.toLowerCase() === filter
    })
    const handleCloseJob = async (jobId: number) => {
        try {
            await api.patch(`/hr/close_post/${jobId}`)

            setJobs((prev) => prev.filter((j) => j.job_id !== jobId))

        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to close job")
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    return (
        <div className="p-5 max-w-6xl mx-auto space-y-5">

            {/* Header */}
            <div className="flex items-center gap-2">
                <Briefcase className="text-[#5A0F2E]" />
                <h2 className="text-xl font-bold text-[#1a3112]">
                    Job Openings
                </h2>
            </div>

            <div className="flex gap-2">
                {["all", "open", "closed"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border
        ${filter === f
                                ? "bg-[#5A0F2E] text-white"
                                : "bg-white text-gray-600"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                    <p>loading...</p>
                </div>
            ) : jobs.length === 0 ? (
                <p className="text-gray-400 text-center py-10">
                    No jobs posted yet
                </p>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">

                    {filteredJobs.map((job) => (
                        <Card key={job.job_id} className="hover:shadow-md transition">

                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        {job.title}
                                    </CardTitle>

                                    <p className="text-sm text-gray-500">
                                        {job.department}
                                    </p>
                                </div>


                                <button
                                    onClick={() => handleCloseJob(job.job_id)}
                                    className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-md font-semibold hover:bg-red-200"
                                >
                                    Close
                                </button>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                {/* Info Row */}
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">

                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} /> {job.location}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {job.experience_min} - {job.experience_max} yrs
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <IndianRupee size={14} />
                                        {job.salary_min} - {job.salary_max}
                                    </div>

                                </div>

                                {/* Badges */}
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary">{job.employee_type}</Badge>
                                    <Badge variant="outline">{job.work_mode}</Badge>
                                    <Badge>{job.openings} openings</Badge>
                                </div>

                                {/* Description */}
                                {job.description && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Description
                                        </h4>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {job.description}
                                        </p>
                                    </div>
                                )}

                                {/* Requirements */}
                                {job.requirements && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Requirements
                                        </h4>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {job.requirements}
                                        </p>
                                    </div>
                                )}

                                {/* Responsibilities */}
                                {job.responsibilities && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Responsibilities
                                        </h4>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {job.responsibilities}
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t">
                                    <span>
                                        Posted on {dayjs(job.created_at).format("DD MMM YYYY")}
                                    </span>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                </div>
            )}
        </div>
    )
}