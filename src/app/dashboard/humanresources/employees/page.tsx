"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import AddEmployeeModal from "../addEmployee/page"

export default function EmployeePage() {

  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await api.get("/core/employees")
      const data = res.data?.data || []
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <div className="p-6 mt-10">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#465e3e] text-white px-4 py-2 rounded"
        >
          + Add Employee
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.employee_id}
              className="flex items-center gap-4 border p-4 rounded-lg"
            >
              <img
                src={emp.profile_image || "/default-avatar.png"}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">
                  {emp.first_name} {emp.last_name}
                </p>
                <p className="text-sm text-gray-500">{emp.email}</p>
              </div>

              <div className="text-sm text-right">
                <p>{emp.job_title}</p>
                <p className="text-gray-500">{emp.department_name}</p>
                <p className="text-gray-500">
                  ₹{emp.salary?.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">
                  {dayjs(emp.hire_date).format("DD MMM YYYY")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AddEmployeeModal
        open={open}
        setOpen={setOpen}
        onSuccess={fetchEmployees}
      />
    </div>
  )
}