"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import IDCard from "@/components/ui/IDCard"
import AddEmployeeModal from "../addEmployee/page"

export default function EmployeePage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("")

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

  const departments = [...new Set(employees.map((e) => e.department_name).filter(Boolean))].sort()

  const filtered = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase()
    const matchSearch =
      !search ||
      fullName.includes(search.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(search.toLowerCase())
    const matchDept = !deptFilter || emp.department_name === deptFilter
    return matchSearch && matchDept
  })

  return (
    <div className="px-6 py-6 mx-auto max-w-7xl rounded-2xl ">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-wide text-[#1a1a2e]">
            EMPLOYEES
          </h1>
          <span className="bg-[#5A0F2E] text-white text-xs font-medium px-3 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#5A0F2E] hover:bg-[#242c21] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-4 py-2 rounded-lg border border-[#c0c0d8] text-sm bg-white text-[#1a1a2e] outline-none focus:border-[#4040c8]"
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[#c0c0d8] text-sm bg-white text-[#1a1a2e] outline-none focus:border-[#4040c8]"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#4040c8] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-sm">
          No employees found.
        </div>
      ) : (

        <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {filtered.map((emp) => (
      <IDCard key={emp.employee_id} emp={emp} />
    ))}
  </div>
</div>

      )}

      {/* Modal */}
      <AddEmployeeModal
        open={open}
        setOpen={setOpen}
        onSuccess={fetchEmployees}
      />
    </div>
  )
}