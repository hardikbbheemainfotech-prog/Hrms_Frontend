"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import AddEmployeeModal from "../addEmployee/page"

type Employee = {
  employee_id: number
  first_name: string
  last_name: string
  email: string
  job_title: string
  profile_image?: string
  department_name?: string
  role_name?: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [open, setOpen] = useState(false)

  const fetchEmployees = async () => {
    const res = await axios.get("/api/employees") 
    setEmployees(res.data.data)
  }

//   useEffect(() => {
//     fetchEmployees()
//   }, [])

  return (
    <div className="p-6 bg-[#ACC8A2]/20 min-h-screen mt-10 mx-5 rounded-3xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Employees</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#1A2517] text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow border overflow-hidden">

        <div className="grid grid-cols-6 px-4 py-3 text-xs font-semibold text-gray-500 border-b">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Department</span>
          <span>Job</span>
          <span>Status</span>
        </div>

        {employees.map((emp) => (
          <div
            key={emp.employee_id}
            className="grid grid-cols-6 px-4 py-3 items-center border-b hover:bg-white/40 transition"
          >
            {/* NAME */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
              <span className="text-sm">
                {emp.first_name} {emp.last_name}
              </span>
            </div>

            <span className="text-sm">{emp.email}</span>
            <span className="text-sm">{emp.role_name}</span>
            <span className="text-sm">{emp.department_name}</span>
            <span className="text-sm">{emp.job_title}</span>

            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600 w-fit">
              Active
            </span>
          </div>
        ))}

      </div>

      {/* MODAL */}
      <AddEmployeeModal open={open} setOpen={setOpen} onSuccess={fetchEmployees} />
    </div>
  )
}