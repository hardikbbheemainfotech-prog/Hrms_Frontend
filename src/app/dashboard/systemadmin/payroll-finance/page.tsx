

"use client"

import React from "react"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import {
  Wallet,
  BadgeIndianRupee,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Download,
} from "lucide-react"

const payrollStats = [
  {
    title: "Total Payroll",
    value: "₹12,45,000",
    icon: Wallet,
  },
  {
    title: "Bonuses Paid",
    value: "₹1,85,000",
    icon: TrendingUp,
  },
  {
    title: "Deductions",
    value: "₹72,500",
    icon: TrendingDown,
  },
  {
    title: "Net Salary",
    value: "₹13,57,500",
    icon: BadgeIndianRupee,
  },
]

const payrollData = [
  {
    payroll_id: 101,
    employee_id: 201,
    month: "May",
    year: 2026,
    base_salary: "₹50,000",
    bonus: "₹5,000",
    deductions: "₹2,000",
    net_salary: "₹53,000",
  },
  {
    payroll_id: 102,
    employee_id: 202,
    month: "May",
    year: 2026,
    base_salary: "₹65,000",
    bonus: "₹8,000",
    deductions: "₹3,500",
    net_salary: "₹69,500",
  },
  {
    payroll_id: 103,
    employee_id: 203,
    month: "May",
    year: 2026,
    base_salary: "₹42,000",
    bonus: "₹2,500",
    deductions: "₹1,500",
    net_salary: "₹43,000",
  },
]

export default function PayrollFinancePage() {
  return (
      <div className="h-screen flex flex-col bg-[#ACC8A2]/20 overflow-hidden">

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#5A0F2E]">
                Payroll & Finance
              </h1>
              <p className="text-gray-600 mt-1">
                Salary generation, bonuses, deductions, and payroll insights
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#5A0F2E] text-white px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all">
              <Download className="w-5 h-5" />
              Export Payroll
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {payrollStats.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <h2 className="text-2xl font-bold text-[#5A0F2E] mt-2">
                        {item.value}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-[#5A0F2E]/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#5A0F2E]" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payroll Table */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-[#5A0F2E]">
                Employee Payroll Records
              </h2>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4" />
                May 2026
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#5A0F2E] text-white">
                    <th className="px-4 py-3 text-left">Payroll ID</th>
                    <th className="px-4 py-3 text-left">Employee ID</th>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-left">Year</th>
                    <th className="px-4 py-3 text-left">Base Salary</th>
                    <th className="px-4 py-3 text-left">Bonus</th>
                    <th className="px-4 py-3 text-left">Deductions</th>
                    <th className="px-4 py-3 text-left">Net Salary</th>
                  </tr>
                </thead>

                <tbody>
                  {payrollData.map((record, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-[#F9F6F3]/80 transition-all"
                    >
                      <td className="px-4 py-4">{record.payroll_id}</td>
                      <td className="px-4 py-4">{record.employee_id}</td>
                      <td className="px-4 py-4">{record.month}</td>
                      <td className="px-4 py-4">{record.year}</td>
                      <td className="px-4 py-4 font-medium">
                        {record.base_salary}
                      </td>
                      <td className="px-4 py-4 text-green-600">
                        {record.bonus}
                      </td>
                      <td className="px-4 py-4 text-red-500">
                        {record.deductions}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#5A0F2E]">
                        {record.net_salary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}