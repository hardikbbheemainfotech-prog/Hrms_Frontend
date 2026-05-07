"use client"

import { useState } from "react"
import api from "@/lib/axios"
import { useHRData } from "@/hooks/useHRData"

import {
  Upload,
  User,
  FileText,
  X,
  Search
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function UploadEmployeeDocument({ open, setOpen }: any) {

  const { employees, loadingEmployees } = useHRData()

  const [employeeId, setEmployeeId] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  if (!open) return null

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

 const handleSubmit = async (e: any) => {
  e.preventDefault()

  if (!employeeId) return alert("Select employee")
  if (!documentType) return alert("Enter document type")
  if (!file) return alert("Select file")

  let uploadedPublicId: string | null = null

  try {
    setLoading(true)

    const cloudData = new FormData()
    cloudData.append("file", file)
    cloudData.append("upload_preset", "HRMS_uploads")
    cloudData.append("folder", "employees/documents")

    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/dnmleleho/image/upload",
      {
        method: "POST",
        body: cloudData,
      }
    )

    const cloudJson = await cloudRes.json()

    if (!cloudRes.ok) {
      throw new Error(cloudJson.error?.message || "Cloud upload failed")
    }

    const file_url = cloudJson.secure_url
    const file_public_key = cloudJson.public_id

    uploadedPublicId = file_public_key

    await api.post("/hr/upload_docs", {
      employee_id: employeeId,
      document_type: documentType,
      file_url,
      file_public_key,
    })

    alert("Uploaded successfully")

    setEmployeeId("")
    setDocumentType("")
    setFile(null)
    setOpen(false)

  } catch (err: any) {

    if (uploadedPublicId) {
      try {
        await api.post("/hr/remove_file", {
          public_id: uploadedPublicId,
        })
      } catch (cleanupErr) {
        console.error("Cleanup failed:", cleanupErr)
      }
    }

    alert(err?.message || err?.response?.data?.message || "Upload failed")

  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#5A0F2E] flex items-center gap-2">
            <Upload size={18} />
            Upload Document
          </h2>

          <button onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#c0c0d8] rounded-lg text-sm"
            />
          </div>

          {/* Employee Select */}
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            />

            <Select
              value={employeeId}
              onValueChange={(value) => setEmployeeId(value)}
            >
              <SelectTrigger className="w-full pl-9 pr-3 py-2 border border-[#c0c0d8] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#5A0F2E]/30 focus:border-[#5A0F2E]">
                <SelectValue
                  placeholder={loadingEmployees ? "Loading..." : "Select Employee"}
                />
              </SelectTrigger>

              <SelectContent>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <SelectItem
                      key={emp.employee_id}
                      value={String(emp.employee_id)}
                    >
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    No employees found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Document Type */}
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Document Type (PAN, Aadhar...)"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#c0c0d8] rounded-lg text-sm"
            />
          </div>

          {/* File Upload */}
          <div className="border border-dashed border-[#c0c0d8] rounded-lg p-4 text-center">

            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full text-sm"
            />

            {file && (
              <div className="mt-3 flex justify-between items-center text-xs text-gray-600">
                <span>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 flex items-center gap-1"
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#5A0F2E] hover:bg-[#af225d] text-white text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              {loading ? "Uploading..." : "Upload"}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}