"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import RoleGuard from "@/components/shared/RoleGuard"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddStaffForm() {
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
    role: "",
    stipend: "",
    internship_type: "",
  }

  const [formData, setFormData] = useState(initialState)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const res = await api.get("/core/departments")
        const rawData = res.data?.data?.data || []
        setDepartments(Array.isArray(rawData) ? rawData : [])
      } catch {
        setDepartments([])
      }
    }

    fetchDeps()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const uploadImage = async (file: File) => {
    setUploading(true)

    try {
      const data = new FormData()
      data.append("file", file)
      data.append("upload_preset", "HRMS_uploads")

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnmleleho/image/upload",
        {
          method: "POST",
          body: data,
        }
      )

      const resData = await res.json()

      if (!resData.secure_url) {
        throw new Error("Upload failed")
      }

      return {
        url: resData.secure_url,
        public_id: resData.public_id,
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Image upload failed",
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const result = await uploadImage(e.target.files[0])

      if (result) {
        setImageUrl(result.url)
        setPublicId(result.public_id)

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUrl) {
      return toast({
        variant: "destructive",
        title: "Profile Image Required",
        description: "Please upload profile image first",
      })
    }

    setLoading(true)

    try {
      const payload: any = {
        ...formData,
        salary: Number(formData.salary || 0),
        profile_image: imageUrl,
        profile_public_key: publicId,
      }

      if (formData.role !== "intern") {
        delete payload.stipend
        delete payload.internship_type
      }

      await api.post("/admin/add_staff", payload)

      toast({
        title: "Success",
        description: "Employee onboarded successfully",
      })

      setFormData(initialState)
      setImageUrl("")
      setPublicId("")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add employee",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="bg-[#F1E9E4]/90 rounded-2xl shadow-lg p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5A0F2E] mb-2">
            Onboard New Staff
          </h2>
          <p className="text-gray-500 mb-8">
            Add employees, HR, managers, or interns
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />

            <Input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <Input
              name="job_title"
              placeholder="Job Title"
              value={formData.job_title}
              onChange={handleChange}
            />

            <Input
              name="salary"
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
            />

            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.department_id}
              onValueChange={(value) =>
                setFormData({ ...formData, department_id: value })
              }
            >
              <SelectTrigger>
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

            {formData.role === "intern" && (
              <>
                <Input
                  name="stipend"
                  type="number"
                  placeholder="Stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                />

                <Input
                  name="internship_type"
                  placeholder="Internship Type (Paid / Unpaid / Remote)"
                  value={formData.internship_type}
                  onChange={handleChange}
                />
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Hire Date</label>
              <Input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                Date of Birth
              </label>
              <Input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50">
              <label className="cursor-pointer text-center w-full">
                <span className="block text-sm font-medium text-gray-700">
                  Upload Profile Picture
                </span>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-3"
                />
              </label>

              <div className="mt-4">
                {uploading && (
                  <div className="flex items-center gap-2 text-[#5A0F2E]">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Uploading...</span>
                  </div>
                )}

                {imageUrl && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <CheckCircle2 size={16} />
                      <span>Image Ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || uploading || !imageUrl}
              className="md:col-span-2 h-12 text-lg font-bold bg-[#5A0F2E] hover:bg-[#4a0c26]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Adding Employee...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
          </form>
        </div>
      </div>
    </RoleGuard>
  )
}