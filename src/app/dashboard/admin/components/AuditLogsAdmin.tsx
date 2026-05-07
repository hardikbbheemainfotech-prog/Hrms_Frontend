"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Input } from "@/components/mail/shared"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AuditLogsAdmin() {

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState("today")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/logs", {
        params: {
          filter,
          from,
          to,
        },
      })

      const data = res.data?.data.data || []
      setLogs(Array.isArray(data) ? data : [])

    } catch (err) {
      console.error("Failed to fetch logs")
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filter])

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>

      {/* 🔹 Filters */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="range">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {filter === "range" && (
          <>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </>
        )}

        <Button onClick={fetchLogs}>Apply</Button>

      </div>

      {/* 🔹 Table */}
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
              <th className="p-2">Table</th>
              <th className="p-2">Record ID</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    {log.first_name
                      ? `${log.first_name} ${log.last_name}`
                      : "N/A"}
                  </td>
                  <td className="p-2">{log.email || "N/A"}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.table_name}</td>
                  <td className="p-2">{log.record_id}</td>
                  <td className="p-2">
                    {new Date(log.created_at).toLocaleString()}
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