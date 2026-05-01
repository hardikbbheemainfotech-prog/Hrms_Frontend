"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import { Ban } from "lucide-react"
import { RequestRow } from "@/types/hrTypes"


const TYPE_STYLES: any = {
    complaint: "bg-red-100 text-red-600",
    requirement: "bg-blue-100 text-blue-600",
    feedback: "bg-green-100 text-green-600",
}

const STATUS_STYLES: any = {
    open: "bg-yellow-100 text-yellow-700",
    pending: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<RequestRow[]>([])
    const [filter, setFilter] = useState("all")
    const [loading, setLoading] = useState(false)

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const res = await api.get("/hr/emp_reqs", {
                params: { type: filter }
            })
            setRequests(res.data?.data?.requests || [])
        } catch {
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [filter])

    return (
        <div className="p-5 space-y-5">

            {/* Header */}
            <h2 className="text-xl font-bold text-[#1a3112]">
                Employee Requests
            </h2>

            {/* Filters */}
            <div className="flex gap-2">
                {["all", "complaint", "requirement", "feedback"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border
              ${filter === t
                                ? "bg-[#4e7740] text-white"
                                : "bg-white text-gray-600"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f4f8f2] text-left">
                            <th className="p-3">Employee</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Message</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center p-6 text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : requests.length === 0 ? (

                            <tr>
                                <td colSpan={5} className="p-8">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Ban size={28} className="mb-2 opacity-70" />
                                        <p className="text-sm">No requests found</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (
                            requests.map((r) => (
                                <tr key={r.request_id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">
                                        {r.first_name} {r.last_name}
                                    </td>

                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TYPE_STYLES[r.type] || "bg-gray-100 text-gray-600"}`}>
                                            {r.type.charAt(0).toUpperCase() + r.type.slice(1)}                                        </span>
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {r.description}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] || "bg-gray-100 text-gray-600"
                                                }`}
                                        >                                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                        </span>
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {dayjs(r.created_at).format("DD MMM YYYY")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}