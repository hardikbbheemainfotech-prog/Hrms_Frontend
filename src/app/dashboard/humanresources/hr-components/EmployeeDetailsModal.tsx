"use client"

import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import dayjs from "dayjs"
import { X, Loader2, FileText, ExternalLink, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import UpdateEmployeeModal from "./UpdateEmployeeModal"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  employee_id: number | string
  first_name: string
  last_name: string
  email: string
  job_title: string
  department_name: string
  salary: number | string | null
  hire_date: string
  profile_image?: string
  role_name?: string
  stipend?: number | string | null
  internship_type?: string | null
}

interface EmployeeDocument {
  document_id?: number
  document_type: string
  file_url: string
  uploaded_at?: string
}


export default function EmployeeDetailsModal({
  employee,
  open,
  onClose,
  onEdit,
}: {
  employee: Employee
  open: boolean
  onClose: () => void
   onEdit?: (employee: Employee) => void 
}) {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const {toast} = useToast();

  const fullName = `${employee.first_name} ${employee.last_name}`

  const fetchDocuments = async () => {
    if (!employee?.employee_id) return

    setLoading(true)

    try {
      const res = await api.get(`/hr/get_docs/${employee.employee_id}/documents`)

      const data = res.data?.data || []

      setDocuments(Array.isArray(data) ? data : [])
    } catch (err) {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }
 const handleResetPassword = async () => {
  try {
    setLoading(true)

    const res = await api.post("/auth/reset_password", {
      email: employee.email,
    })

    const result = res.data

    if (!result.success) {
      throw new Error(result.message || "Password reset failed")
    }

    toast({
      title: "Password Reset Successful",
      description: `New password: "${result.data?.default_password}"`,
    })

    return result
  } catch (err: any) {
    toast({
      variant: "destructive",
      title: "Password Reset Failed",
      description:
        err.response?.data?.message ||
        err.message ||
        "Something went wrong",
    })

    return null
  } finally {
    setLoading(false)
  }
}
  useEffect(() => {
    if (open && employee?.employee_id) {
      fetchDocuments()
    }
  }, [open, employee])

  if (!open || !employee) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#5A0F2E] text-white px-6 py-3 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-l font-bold">
              Employee Details
            </h2>

            <p className="text-sm text-white/80">
              Complete employee profile
            </p>
          </div>

          <Button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition"
          >
            <X size={22} />
          </Button>
        </div>

        {/* Body */}
       <div className="p-6 overflow-y-auto no-scrollbar flex-1">

          {/* Profile */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-6">
  
  {/* Left Side */}
  <div className="flex flex-col md:flex-row items-center gap-6">
    {employee.profile_image ? (
      <img
        src={employee.profile_image}
        alt={fullName}
        className="w-28 h-28 rounded-full object-cover border-4 border-[#5A0F2E]"
      />
    ) : (
      <div className="w-28 h-28 rounded-full bg-[#5A0F2E] text-white flex items-center justify-center text-3xl font-bold">
        {employee.first_name?.[0]}
        {employee.last_name?.[0]}
      </div>
    )}

    <div className="text-center md:text-left">
      <h3 className="text-3xl font-bold text-[#5A0F2E]">
        {fullName}
      </h3>

      <p className="text-gray-500 mt-1">
        {employee.job_title || "No job title"}
      </p>

      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#e8f3e8] text-[#4e7740] text-sm font-medium">
        {employee.department_name || "No department"}
      </span>
    </div>
  </div>

  {/* Right Side Edit Button */}
  <div className="self-start md:self-center flex items-center gap-3">
 <Button
  type="button"
  onClick={async () => {
    await handleResetPassword()
    onClose()
  }}
  className="bg-[#5A0F2E] hover:bg-[#4a0c26] text-white 
  shadow-md flex items-center justify-center"
>
  Reset {employee.first_name}'s Password
</Button>
    <Button
  type="button"
  onClick={() => setEditOpen(true)}
  className="w-12 h-12 rounded-full bg-[#5A0F2E] hover:bg-[#4a0c26] text-white 
  shadow-md flex items-center justify-center"
>
  <Pencil size={20} />
</Button>
  </div>
</div>
          {/* Employee Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

            <DetailCard
              label="Employee ID"
              value={String(employee.employee_id).padStart(3, "0")}
            />

            <DetailCard
              label="Email"
              value={employee.email || "—"}
            />

<DetailCard
  label={
    employee.role_name === "intern"
      ? "Stipend"
      : "Salary"
  }
  value={
    employee.role_name === "intern"
      ? employee.stipend
        ? `₹${Number(employee.stipend).toLocaleString("en-IN")}`
        : employee.internship_type === "UNPAID"
        ? "Unpaid"
        : "—"
      : employee.salary
      ? `₹${Number(employee.salary).toLocaleString("en-IN")}`
      : "—"
  }
/>

            <DetailCard
              label="Hire Date"
              value={
                employee.hire_date
                  ? dayjs(employee.hire_date).format("DD MMM YYYY")
                  : "—"
              }
            />
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h4 className="text-xl font-bold text-[#5A0F2E] mb-4">
              Uploaded Documents
            </h4>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-[#5A0F2E]" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border rounded-2xl bg-gray-50">
                No documents uploaded
              </div>
            ) : (
              <div className="grid gap-3">
                {documents.map((doc, index) => (
                  <div
                    key={doc.document_id || index}
                    className="border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#5A0F2E]/10 p-3 rounded-xl">
                        <FileText
                          size={20}
                          className="text-[#5A0F2E]"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-[#5A0F2E]">
                          {doc.document_type || "Untitled Document"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {doc.uploaded_at
                            ? dayjs(doc.uploaded_at).format(
                                "DD MMM YYYY, hh:mm A"
                              )
                            : "Upload date unavailable"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A0F2E] text-white text-sm hover:opacity-90"
                    >
                      <ExternalLink size={16} />
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <UpdateEmployeeModal
  open={editOpen}
  setEditOpen={setEditOpen}
  employee={employee}
  onSuccess={() => {
    fetchDocuments()
    setEditOpen(false)
  }}
/>
    </div>
    
  )

  
}


function DetailCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border rounded-2xl p-4 bg-gray-50 hover:shadow-sm transition">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-[#5A0F2E] font-semibold mt-1 break-words">
        {value}
      </p>
    </div>
  )
  
}