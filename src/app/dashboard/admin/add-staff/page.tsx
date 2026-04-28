"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use_toast"
import { Loader2, CheckCircle2 } from "lucide-react" // Icons for better UI
import { Input } from "@/components/ui/input"
import RoleGuard from "@/components/shared/RoleGuard"
import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"

export default function AddStaffForm() {
  const { toast } = useToast()

  const initialState = {
    first_name: "", last_name: "", email: "", phone: "",
    password: "", hire_date: "", job_title: "",
    department_id: "", salary: "", date_of_birth: ""
  }

  const [formData, setFormData] = useState(initialState)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
const [publicId, setPublicId] = useState("")
  const [uploading, setUploading] = useState(false)

  // Fetch Departments
  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const res = await api.get("/core/departments")
        const rawData = res.data?.data?.data || []
        setDepartments(Array.isArray(rawData) ? rawData : [])
      } catch (err) {
        setDepartments([])
      }
    }
    fetchDeps()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 1. CLOUDINARY UPLOAD (Direct Frontend)
const uploadImage = async (file: File) => {
  setUploading(true)

  try {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "HRMS_uploads")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnmleleho/image/upload",
      { method: "POST", body: data }
    )

    const resData = await res.json()

    if (!resData.secure_url) {
      throw new Error("Upload failed")
    }

    return {
      url: resData.secure_url,
      public_id: resData.public_id,
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: "Cloudinary check karo bhai",
    })
    return null
  } finally {
    setUploading(false)
  }
}

  // 2. HANDLE FILE CHANGE
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    const result = await uploadImage(e.target.files[0])
    if (result) {
      setImageUrl(result.url)
      setPublicId(result.public_id) 
      toast({ title: "Image uploaded!" })
    }
  }
}

  // 3. SUBMIT FINAL DATA TO BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!imageUrl) {
    return toast({
      title: "Error",
      description: "Pehle image upload karo!",
    })
  }

  setLoading(true)

  try {
    await api.post("/admin/add_staff", {
      ...formData,
      salary: Number(formData.salary || 0),
      profile_image: imageUrl,
      profile_public_key: publicId,
    })

    toast({ title: "Success", description: "Employee onboarded!" })
    setFormData(initialState)
    setImageUrl("")
    setPublicId("")
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to add staff",
    })
  } finally {
    setLoading(false)
  }
}

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <Navbar role="admin" />
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">Onboard New Staff</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Section */}
          <Input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <Input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <Input name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} />
          <Input name="salary" type="number" placeholder="Salary" value={formData.salary} onChange={handleChange} />
          
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep.department_id} value={dep.department_id}>{dep.name}</option>
            ))}
          </select>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Hire Date</label>
            <Input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date of Birth</label>
            <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="md:col-span-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
            <label className="cursor-pointer text-center">
              <span className="block text-sm font-medium text-gray-700">Profile Picture</span>
              <Input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
            </label>

            <div className="mt-4">
              {uploading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Cloudinary pe upload ho raha hai...</span>
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

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={loading || uploading || !imageUrl}
            className="md:col-span-2 w-full h-12 text-lg font-bold bg-black hover:bg-gray-800"
          >
            {loading ? <><Loader2 className="mr-2 animate-spin" /> Adding Employee...</> : "Add Employee"}
          </Button>
        </form>
      </div>
    </RoleGuard>
  )
}