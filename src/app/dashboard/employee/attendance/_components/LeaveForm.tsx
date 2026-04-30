"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import DateRangePicker from "./DateRangePicker"
import { DateRange } from "react-day-picker"
import { LeaveProps } from "@/types/employeeTypes"



export default function LeaveForm({ leaveSummary, onSubmit, loading }: LeaveProps) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [leaveType, setLeaveType] = useState<string>("1")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!range?.from || !range?.to) return

    const diff = range.to.getTime() - range.from.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1

    onSubmit({
      leave_type_id: parseInt(leaveType),
      start_date: range.from.toISOString().split("T")[0],
      end_date: range.to.toISOString().split("T")[0],
      total_days: days,
      reason
    })

    setRange(undefined)
    setReason("")
  }

  return (
    <Card className="rounded-2xl shadow-md border border-gray-100">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-sm font-semibold">Request Leave</CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Leave Type */}
          <Select value={leaveType} onValueChange={setLeaveType}>
            <SelectTrigger>
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {leaveSummary.map((t) => (
                <SelectItem key={t.leave_type_id} value={t.leave_type_id.toString()}>
                  {t.leave_type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <DateRangePicker range={range} setRange={setRange} />

          {/* Reason */}
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          {/* Button */}
          <Button className="w-full bg-black text-white" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Apply"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}