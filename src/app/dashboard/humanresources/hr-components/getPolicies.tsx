"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import { FileText } from "lucide-react"
import { Policy } from "@/types/hrTypes"



const STATUS_STYLE: any = {
    true: "bg-green-100 text-green-700",
    false: "bg-gray-100 text-gray-500",
}

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([])
    const [loading, setLoading] = useState(false)

    const fetchPolicies = async () => {
        setLoading(true)
        try {
            const res = await api.get("/core/policies")
            setPolicies(res.data?.data || [])
        } catch {
            setPolicies([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    return (
        <div className="p-5 space-y-5">

            {/* Header */}
            <div className="flex items-center gap-2">
                <FileText className="text-[#5A0F2E]" />
                <h2 className="text-xl font-bold text-[#833153]">
                    Company Policies
                </h2>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center text-gray-400 py-10">
                    Loading policies...
                </div>
            ) : policies.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    No policies found
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">

                    {policies.map((p) => (
                        <div
                            key={p.policy_id}
                            className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition"
                        >
                            {/* Top */}
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-[#5A0F2E]">
                                    {p.policy_key}
                                </h3>

                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[String(p.is_active)]
                                        }`}
                                >
                                    {p.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-500 mt-2">
                                {p.description}
                            </p>

                            {/* Value */}
                            <div className="mt-3 bg-[#f4f8f2] p-3 rounded-lg text-sm text-gray-700">
                                {p.policy_value}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                <span>
                                    Published: {dayjs(p.publised_at).format("DD MMM YYYY")}
                                </span>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}