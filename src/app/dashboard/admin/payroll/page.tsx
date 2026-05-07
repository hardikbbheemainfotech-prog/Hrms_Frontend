"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import {
  IndianRupee,
  Users,
  CalendarDays,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PayrollEmployee {
  payroll_id: number
  employee_id: number
  first_name: string
  phone: string
  month: number
  year: number
  base_salary: string
  bonus: string
  deductions: string
  net_salary: string
  generated_at: string
}

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState<PayrollEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const {toast} = useToast();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  const fetchPayrolls = async (month?: number, year?: number) => {
    try {
      setLoading(true)

      let url = "/admin/get_payroll"

      if (month && year) {
        url = `/admin/get_payroll?month=${month}&year=${year}`
      }

      const res = await api.get(url)

      const data = res.data?.data || []

      setEmployees(
        Array.isArray(data)
          ? data.filter(
              (emp: PayrollEmployee) =>
                Number(emp.base_salary) > 0
            )
          : []
      )
    } catch (error) {
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const [year, month] = selectedMonth.split("-")

    fetchPayrolls(Number(month), Number(year))
  }, [selectedMonth])

  const totalPayroll = employees.reduce(
    (sum, emp) => sum + Number(emp.net_salary || 0),
    0
  )

  const totalDeductions = employees.reduce(
    (sum, emp) => sum + Number(emp.deductions || 0),
    0
  )

  const handleGeneratePayroll = async () => {
    try {
      setGenerating(true)

      const [year, month] = selectedMonth.split("-")

      await api.post("/admin/generate_payroll", {
        month: Number(month),
        year: Number(year),
      })
    toast({ title: "Success", description: "Payroll generated successfully!" })

      fetchPayrolls(Number(month), Number(year))
    } catch (error: any) {
     
      toast({ variant: "destructive", title: "Error", description: "Failed to generate payroll"})

    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#5A0F2E]">
            Payroll Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Generate and manage employee payroll by month
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="border rounded-xl px-4 py-2 text-sm bg-white"
          />

          <Button
            onClick={handleGeneratePayroll}
            disabled={generating}
            className="bg-[#5A0F2E] hover:bg-[#74163d] text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Generate Payroll
              </>
            )}
          </Button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Total Employees
              </p>

              <h2 className="text-2xl font-bold text-[#5A0F2E] mt-1">
                {employees.length}
              </h2>
            </div>

            <Users className="text-[#5A0F2E]" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Net Payroll
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-1">
                ₹{totalPayroll.toLocaleString("en-IN")}
              </h2>
            </div>

            <IndianRupee className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Total Deductions
              </p>

              <h2 className="text-2xl font-bold text-red-500 mt-1">
                ₹{totalDeductions.toLocaleString("en-IN")}
              </h2>
            </div>

            <IndianRupee className="text-red-500" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Payroll Month
              </p>

              <h2 className="text-lg font-bold text-[#5A0F2E] mt-1">
                {new Date(
                  selectedMonth + "-01"
                ).toLocaleString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>

            <CalendarDays className="text-[#5A0F2E]" />
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">

            <thead className="bg-[#5A0F2E] text-white">
              <tr>
                <th className="text-left px-4 py-3">
                  Employee
                </th>

                <th className="text-left px-4 py-3">
                  Phone
                </th>

                <th className="text-left px-4 py-3">
                  Base Salary
                </th>

                <th className="text-left px-4 py-3">
                  Bonus
                </th>

                <th className="text-left px-4 py-3">
                  Deductions
                </th>

                <th className="text-left px-4 py-3">
                  Net Salary
                </th>

                <th className="text-left px-4 py-3">
                  Generated On
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10"
                  >
                    <div className="flex justify-center">
                      <Loader2 className="animate-spin text-[#5A0F2E]" />
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    No payroll records found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.payroll_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-[#5A0F2E]">
                          {emp.first_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Employee ID: {emp.employee_id}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {emp.phone || "—"}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      ₹
                      {Number(emp.base_salary).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-4 text-blue-600 font-medium">
                      ₹
                      {Number(emp.bonus).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-4 text-red-500 font-medium">
                      ₹
                      {Number(emp.deductions).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-4 font-bold text-green-600">
                      ₹
                      {Number(emp.net_salary).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(
                        emp.generated_at
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <AlertCircle size={16} />
        Payroll data updates dynamically based on selected month and year.
      </div>

    </div>
  )
}