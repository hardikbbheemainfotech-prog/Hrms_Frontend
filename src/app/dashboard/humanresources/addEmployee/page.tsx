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
import { Input } from "@/components/mail/shared"
import { Button } from "@/components/ui/button"
import { Toast } from "radix-ui"

export default function AddEmployeeModal({ open, setOpen, onSuccess }: any) {

  const [form, setForm] = useState<any>({
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
  })

  const [departments, setDepartments] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [uploading, setUploading] = useState(false)
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
    fetchDeps()
  }, [])
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

      const resData = await res.json()

      return {
        url: resData.secure_url,
        public_id: resData.public_id,
      }

    } catch {
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadImage(file)

    if (result) {
      setImageUrl(result.url)
      setPublicId(result.public_id)
      setPreview(result.url)
    }
  }

  const handleSubmit = async () => {
    if (!imageUrl) {
      return
    }

    try {
      await api.post("/hr/add_employee", {
        ...form,
        salary: Number(form.salary || 0),
        profile_image: imageUrl,
        profile_public_key: publicId,
      })

      onSuccess()
      setOpen(false)

    } catch (err) {
      console.error(err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-xl w-[500px]">

        <h2 className="text-lg font-bold mb-4">Add Employee</h2>

        <div className="grid grid-cols-2 gap-3">

          <Input placeholder="First Name"
            onChange={(e) => setForm({ ...form, first_name: e.target.value })} />

          <Input placeholder="Last Name"
            onChange={(e) => setForm({ ...form, last_name: e.target.value })} />

          <Input placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <Input placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <Input placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <Input placeholder="Job Title"
            onChange={(e) => setForm({ ...form, job_title: e.target.value })} />

          <Input type="number" placeholder="Salary"
            onChange={(e) => setForm({ ...form, salary: e.target.value })} />
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

  <SelectContent>
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
          <Input type="date"
            onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />

          <Input type="date"
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />

        </div>
<div className="mt-4">
  <Input type="file" accept="image/*" onChange={handleFile} />

  {uploading && <p>Uploading...</p>}

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="w-16 h-16 rounded-full mt-2 object-cover border"
    />
  )}
</div>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#5A0F2E] text-white px-4 py-2 rounded">
            Save
          </Button>
        </div>

      </div>
    </div>
  )
}