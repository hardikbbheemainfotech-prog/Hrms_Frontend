"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"

import IDCard from "@/components/ui/IDCard"
import AddEmployeeModal from "../addEmployee/page"
import BheemaLoader from "@/components/shared/loader/loader"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import UploadEmployeeDocument from "../hr-components/Uploaddocs"
import EmployeeDetailsModal from "../hr-components/EmployeeDetailsModal"


export default function EmployeePage() {

  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
 const [docOpen, setDocOpen] = useState(false)
const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)

  const fetchEmployees = async () => {
    setLoading(true)

    try {

      const res = await api.get("/core/employees")
      const data = res.data?.data || []
      setEmployees(Array.isArray(data) ? data : [])

    } catch (err) {
      setEmployees([])

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const departments = [
    ...new Set(
      employees
        .map((e) => e.department_name)
        .filter(Boolean)
    ),
  ].sort()

  const filtered = employees.filter((emp) => {

    const fullName =
      `${emp.first_name} ${emp.last_name}`.toLowerCase()

    const matchSearch =
      !search ||
      fullName.includes(search.toLowerCase()) ||
      (emp.email || "")
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchDept =
      !deptFilter ||
      emp.department_name === deptFilter

    const matchType =
      !typeFilter ||
      emp.role_name?.toLowerCase() ===  typeFilter.toLowerCase()

    return (
      matchSearch &&
      matchDept &&
      matchType
    )
  })

 return (
  <div className="px-4 sm:px-6 py-6 mx-auto max-w-7xl rounded-2xl">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-wide text-[#1a1a2e]">
          EMPLOYEES
        </h1>

        <span className="bg-[#5A0F2E] text-white text-xs font-medium px-3 py-0.5 rounded-full">
          {filtered.length}
        </span>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">

        {/* SAME THEME BUTTON */}
        <button
          onClick={() => setDocOpen(true)}
          className="bg-[#5A0F2E] hover:bg-white hover:text-[#5A0F2E] hover:border-[#5A0F2E] border-1 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
        >
          Upload Document
        </button>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#5A0F2E] hover:bg-white hover:text-[#5A0F2E] hover:border-[#5A0F2E] border-1 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
        >
          + Add Employee
        </button>

      </div>
    </div>

    {/* FILTERS */}
    <div className="flex flex-col lg:flex-row gap-3 mb-8">

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[180px] px-4 py-2 rounded-lg border border-[#c0c0d8] text-sm bg-white text-[#1a1a2e] outline-none focus:border-[#4040c8]"
      />

      <Select
        value={deptFilter || "all"}
        onValueChange={(value) =>
          setDeptFilter(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-full lg:w-[220px] rounded-xl border border-[#c0c0d8] bg-white text-[#1a1a2e] focus:ring-2 focus:ring-[#4040c8]/30 focus:border-[#4040c8]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>

          {departments.map((dept, i) => (
            <SelectItem key={i} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={typeFilter || "all"}
        onValueChange={(value) =>
          setTypeFilter(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-full lg:w-[220px] rounded-xl border border-[#c0c0d8] bg-white text-[#1a1a2e] focus:ring-2 focus:ring-[#4040c8]/30 focus:border-[#4040c8]">
          <SelectValue placeholder="Employee Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
          <SelectItem value="intern">Intern</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* CARDS */}
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <BheemaLoader />
      </div>
    ) : filtered.length === 0 ? (
      <div className="text-center text-gray-400 py-16 text-sm">
        No employees found.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {filtered.map((emp) => (
  <IDCard
    key={emp.employee_id}
    emp={emp}
    onClick={(employee) => {
      setSelectedEmployee(employee)
    }}
  />
))}
      </div>
    )}

    {/* MODALS */}
    <AddEmployeeModal
      open={open}
      setOpen={setOpen}
      onSuccess={fetchEmployees}
    />

    <UploadEmployeeDocument
      open={docOpen}
      setOpen={setDocOpen}
    />
    {selectedEmployee && (
  <EmployeeDetailsModal
    employee={selectedEmployee}
    open={!!selectedEmployee}
    onClose={() =>
      setSelectedEmployee(null)
    }
  />
)}
  </div>
)
}