"use client"
import { useState } from "react"
import api from "@/lib/axios"
import { useHRData } from "@/hooks/useHRData"

import {
  Upload,
  User,
  FileText,
  X,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function UploadEmployeeDocument({ open, setOpen }: any) {
  const { employees, loadingEmployees } = useHRData()
  const [fileUrl, setFileUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [employeeId, setEmployeeId] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  if (!open) return null

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  const uploadDocument = async (selectedFile: File) => {
    setUploading(true)

    try {
      const data = new FormData()

      data.append("file", selectedFile)
      data.append("upload_preset", "HRMS_uploads")
      data.append("folder", "employees/documents")

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnmleleho/image/upload",
        {
          method: "POST",
          body: data,
        }
      )

      const text = await res.text()
      const resData = JSON.parse(text)


      if (!res.ok || !resData.secure_url) {
        throw new Error(resData.error?.message || "Upload failed")
      }

      return {
        url: resData.secure_url,
        public_id: resData.public_id,
      }
    } catch (err: any) {

      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add staff",
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    setFile(selectedFile)

    const result = await uploadDocument(selectedFile)

    if (result) {
      setFileUrl(result.url)
      setPublicId(result.public_id)
      toast({ title: "Success", description: "Document uploaded successfully!" })
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!employeeId) {
      toast({
        variant: "destructive",
        title: "Employee Required",
        description: "Please select an employee",
      })
      return
    }

    if (!documentType.trim()) {
      toast({
        variant: "destructive",
        title: "Document Type Required",
        description: "Please enter document type",
      })
      return
    }

    if (!fileUrl) {
      toast({
        variant: "destructive",
        title: "Document Required",
        description: "Please upload document first",
      })
      return
    }

    try {
      setLoading(true)

      await api.post("/hr/upload_docs", {
        employee_id: employeeId,
        document_type: documentType,
        file_url: fileUrl,
        file_public_key: publicId,
      })

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })

      setEmployeeId("")
      setDocumentType("")
      setFile(null)
      setFileUrl("")
      setPublicId("")
      setOpen(false)

    } catch (err: any) {

      if (publicId) {
        try {
          await api.post("/hr/remove_file", {
            public_id: publicId,
          })
        } catch { }
      }

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Upload failed",
      })

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

          <Button onClick={() => setOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

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
              onChange={handleFileChange}
              className="w-full text-sm"
            />

            {file && (
              <div className="mt-3 flex justify-between items-center text-xs text-gray-600">
                <span>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setFileUrl("")
                    setPublicId("")
                  }}
                  className="text-red-500 flex items-center gap-1"
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            )}

            {fileUrl && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Document Ready ✔
              </p>
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
              disabled={loading || uploading || !fileUrl}
              className="px-4 py-2 rounded-lg bg-[#5A0F2E] hover:bg-[#af225d] text-white text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading
                ? "Uploading File..."
                : loading
                  ? "Saving..."
                  : "Upload"}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}