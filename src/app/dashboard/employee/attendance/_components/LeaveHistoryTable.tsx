"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

type Props = {
  data: any[]
}

export default function LeaveHistoryTable({ data }: Props) {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-100">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-sm font-semibold">
          Leave Status & History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4 text-center">Days</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.length > 0 ? (
                data.map((leave, i) => (
                  <tr key={i} className="hover:bg-gray-50">

                    <td className="px-6 py-4 font-medium">
                      {leave.leave_type || "—"}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {leave.start_date?.split("T")[0]} → {leave.end_date?.split("T")[0]}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {leave.total_days}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] inline-flex items-center gap-1 ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {leave.status === "approved" && <CheckCircle2 size={12} />}
                        {leave.status === "rejected" && <XCircle size={12} />}
                        {leave.status === "pending" && <Clock size={12} />}
                        {leave.status}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    No leave history
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </CardContent>
    </Card>
  )
}