// ================= STEP 2: Create UpdateEmployeeModal.tsx =================

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Employee {
  employee_id: number | string
  first_name: string
  last_name: string
  email: string
  phone?: string
  job_title: string
  department_name: string
  salary?: number | string | null
  stipend?: number | string | null
  role_name?: string
  internship_type?: string | null
}

export default function UpdateEmployeeModal({
  open,
  onClose,
  employee,
}: {
  open: boolean
  onClose: () => void
  employee: Employee
}) {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    department_name: "",
    salary: "",
    stipend: "",
    internship_type: "",
  })

  useEffect(() => {
    if (employee && open) {
      setFormData({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        job_title: employee.job_title || "",
        department_name: employee.department_name || "",
        salary: employee.salary ? String(employee.salary) : "",
        stipend: employee.stipend ? String(employee.stipend) : "",
        internship_type: employee.internship_type || "",
      })
    }
  }, [employee, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await api.put(`/hr/update_employee/${employee.employee_id}`, formData)

      onClose()
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const isIntern = employee.role_name === "intern"

  return (
    <div className="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#5A0F2E] text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              Update Employee Details
            </h2>
            <p className="text-sm text-white/80">
              Edit and save updated information
            </p>
          </div>

          <Button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <X size={22} />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} />
          <InputField label="Department" name="department_name" value={formData.department_name} onChange={handleChange} />

          {isIntern ? (
            <>
              <InputField
                label="Stipend"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
              />

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Internship Type
                </label>
                <select
                  name="internship_type"
                  value={formData.internship_type}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>
            </>
          ) : (
            <InputField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#5A0F2E] hover:bg-[#4a0c26] rounded-xl px-6"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : null}
            Update Employee
          </Button>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  name,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <Input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 border rounded-xl px-3 py-2"
      />
    </div>
  )
}