"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import { Loader2, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AddEmployeeModal({ open, setOpen, onSuccess }: any) {

  const { toast } = useToast()

  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    hire_date: "",
    job_title: "",
    department_id: "",
    salary: "",
    date_of_birth: "",
    employee_type: "EMPLOYEE",
    stipend: "",
    internship_type: "",
  }

  const [form, setForm] = useState(initialState)

  const [departments, setDepartments] = useState<any[]>([])

  const [imageUrl, setImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {

    const fetchDeps = async () => {

      try {

        const res = await api.get("/core/departments")

        const raw = res.data?.data?.data || []
        setDepartments(Array.isArray(raw) ? raw : [])

      } catch {
        setDepartments([])
      }
    }

    if (open) fetchDeps()
  }, [open])

  const uploadImage = async (file: File) => {

    setUploading(true)

    try {

      const data = new FormData()

      data.append("file", file)
      data.append("upload_preset", "HRMS_uploads")
      data.append("folder", "employees/profile_images")

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

      console.error("Cloudinary Upload Error:", err.message)

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message,
      })

      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return

    const result = await uploadImage(file)

    if (result) {
      setImageUrl(result.url)
      setPublicId(result.public_id)
      setPreview(result.url)
      toast({
        title: "Image uploaded!",
      })
    }
  }

  const resetForm = () => {

    setForm(initialState)
    setImageUrl("")
    setPublicId("")
    setPreview(null)
  }

  const handleSubmit = async () => {

    if (!imageUrl) {

      toast({
        variant: "destructive",
        title: "Profile image required",
      })

      return
    }

    setLoading(true)

    try {

      await api.post("/hr/add_employee", {
        ...form,
        salary:
          form.employee_type === "INTERN" ? 0 : Number(form.salary || 0),
        stipend:
          form.employee_type === "INTERN" ? Number(form.stipend || 0) : null,
        internship_type:
          form.employee_type === "INTERN" ? form.internship_type : null,
        profile_image: imageUrl,
        profile_public_key: publicId,
      })

      toast({
        title: "Success",
        description: "Employee added successfully",
      })

      onSuccess?.()
      setOpen(false)
      resetForm()

    } catch (err: any) {

      toast({
        variant: "destructive",
        title: "Failed",
        description:
          err.response?.data?.message ||
          "Failed to add employee",
      })

      if (publicId) {

        try {

          await api.post("/core/remove_file", {
            public_id: publicId,
          })

        } catch { }
      }

    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-[700px] shadow-2xl relative overflow-y-auto max-h-[95vh]">

        <h2 className="text-xl font-bold mb-6 text-[#5A0F2E]">
          Add Employee
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">

          <Input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                first_name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                last_name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <Input
            placeholder="Job Title"
            value={form.job_title}
            onChange={(e) =>
              setForm({
                ...form,
                job_title: e.target.value,
              })
            }
          />

          {/* Salary / Intern Fields */}

          {form.employee_type !== "INTERN" ? (

            <Input
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary: e.target.value,
                })
              }
            />

          ) : (

            <>
              <Input
                type="number"
                placeholder="Stipend"
                value={form.stipend}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stipend: e.target.value,
                  })
                }
              />

              <Select
                value={form.internship_type}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    internship_type: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Internship Type" />
                </SelectTrigger>

                <SelectContent className="z-[10000] bg-white">
                  <SelectItem value="PAID">
                    Paid
                  </SelectItem>

                  <SelectItem value="UNPAID">
                    Unpaid
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <Select
            value={form.department_id}
            onValueChange={(value) =>
              setForm({
                ...form,
                department_id: value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>

            <SelectContent className="z-[10000] bg-white">

              {departments.map((dep) => (

                <SelectItem
                  key={dep.department_id}
                  value={String(dep.department_id)}
                >
                  {dep.name}
                </SelectItem>

              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.employee_type}
            onValueChange={(value) =>
              setForm({
                ...form,
                employee_type: value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>

            <SelectContent className="z-[10000] bg-white">

              <SelectItem value="EMPLOYEE">
                Employee
              </SelectItem>

              <SelectItem value="INTERN">
                Intern
              </SelectItem>

            </SelectContent>
          </Select>

          <div className="flex flex-col gap-1">

            <label className="text-xs text-gray-500">
              Hire Date
            </label>

            <Input
              type="date"
              value={form.hire_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  hire_date: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1">

            <label className="text-xs text-gray-500">
              Date of Birth
            </label>

            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) =>
                setForm({
                  ...form,
                  date_of_birth: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="md:col-span-2 mt-10 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
          <label className="cursor-pointer text-center">
            <span className="block text-sm font-medium text-gray-700">Profile Picture</span>
            <Input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
          </label>

          <div className="mt-4">
            {uploading && (
              <div className="flex items-center gap-2 text-[#5A0F2E]">
                <Loader2 className="animate-spin" size={20} />
                <span>Please Wait...</span>
              </div>
            )}
            {imageUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <CheckCircle2 size={16} /> <span>Image Ready!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
              resetForm()
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || uploading || !imageUrl}
            className="bg-[#5A0F2E] text-white min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2
                  className="mr-2 animate-spin"
                  size={18}
                />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}