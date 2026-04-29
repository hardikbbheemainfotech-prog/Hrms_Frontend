"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"

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

  // ✅ CLOUDINARY
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
      alert("Upload image first")
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

          <input placeholder="First Name"
            onChange={(e) => setForm({ ...form, first_name: e.target.value })} />

          <input placeholder="Last Name"
            onChange={(e) => setForm({ ...form, last_name: e.target.value })} />

          <input placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <input placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <input placeholder="Job Title"
            onChange={(e) => setForm({ ...form, job_title: e.target.value })} />

          <input type="number" placeholder="Salary"
            onChange={(e) => setForm({ ...form, salary: e.target.value })} />

          <select
            onChange={(e) => setForm({ ...form, department_id: e.target.value })}
          >
            <option>Select Department</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.name}
              </option>
            ))}
          </select>

          <input type="date"
            onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />

          <input type="date"
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />

        </div>

        {/* IMAGE */}
        <div className="mt-4">
          <input type="file" onChange={handleFile} />

          {uploading && <p>Uploading...</p>}

          {preview && (
            <img src={preview} className="w-16 h-16 rounded-full mt-2" />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={handleSubmit} className="bg-[#465e3e] text-white px-4 py-2 rounded">
            Save
          </button>
        </div>

      </div>
    </div>
  )
}