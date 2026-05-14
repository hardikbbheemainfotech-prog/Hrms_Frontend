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

import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import { Loader2, CheckCircle2, X } from "lucide-react"
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

  // Cropping States
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)

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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localImageUrl = URL.createObjectURL(file)
    setSelectedImage(localImageUrl)
    setCropModalOpen(true)
  }

  const resetForm = () => {
    setForm(initialState)
    setImageUrl("")
    setPublicId("")
    setSelectedImage(null)
    setCropModalOpen(false)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
  }

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const getCroppedImg = async (imageSrc: string, crop: any): Promise<File> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => { image.onload = resolve })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = crop.width
    canvas.height = crop.height

    ctx?.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }))
      }, "image/jpeg")
    })
  }

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return

    const croppedFile = await getCroppedImg(selectedImage, croppedAreaPixels)
    const result = await uploadImage(croppedFile)

    if (result) {
      setImageUrl(result.url)
      setPublicId(result.public_id)
      setCropModalOpen(false)
      setSelectedImage(null)
      toast({ title: "Image uploaded successfully!" })
    }
  }

  const handleSubmit = async () => {
    if (!imageUrl) {
      toast({ variant: "destructive", title: "Profile image required" })
      return
    }

    setLoading(true)
    try {
      await api.post("/hr/add_employee", {
        ...form,
        salary: form.employee_type === "INTERN" ? 0 : Number(form.salary || 0),
        stipend: form.employee_type === "INTERN" ? Number(form.stipend || 0) : null,
        internship_type: form.employee_type === "INTERN" ? form.internship_type : null,
        profile_image: imageUrl,
        profile_public_key: publicId,
      })

      toast({ title: "Success", description: "Employee added successfully" })
      onSuccess?.()
      setOpen(false)
      resetForm()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: err.response?.data?.message || "Failed to add employee",
      })
      if (publicId) {
        try { await api.post("/core/remove_file", { public_id: publicId }) } catch { }
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-[700px] shadow-2xl relative overflow-y-auto max-h-[95vh]">

        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2">
          <h2 className="text-xl font-bold text-[#5A0F2E]">Add Employee</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setOpen(false); resetForm(); }}
            className="rounded-full hover:bg-red-50 hover:text-red-500"
          >
            <X size={22} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
          <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input placeholder="Job Title" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />

          <Select value={form.employee_type} onValueChange={(value) => setForm({ ...form, employee_type: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="z-[10001] bg-white">
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
              <SelectItem value="INTERN">Intern</SelectItem>
            </SelectContent>
          </Select>

          {form.employee_type !== "INTERN" ? (
            <Input type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          ) : (
            <>
              <Input type="number" placeholder="Stipend" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
              <Select value={form.internship_type} onValueChange={(value) => setForm({ ...form, internship_type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Internship Type" />
                </SelectTrigger>
                <SelectContent className="z-[10001] bg-white">
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Select value={form.department_id} onValueChange={(value) => setForm({ ...form, department_id: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="z-[10001] bg-white">
              {departments.map((dep) => (
                <SelectItem key={dep.department_id} value={String(dep.department_id)}>
                  {dep.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Hire Date</label>
            <Input type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date of Birth</label>
            <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="md:col-span-2 mt-10 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
  {!imageUrl && !uploading ? (
    // DEFAULT STATE: Show Upload Input
    <label className="cursor-pointer text-center">
      <span className="block text-sm font-medium text-gray-700">Profile Picture</span>
      <Input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
    </label>
  ) : uploading ? (
    // LOADING STATE
    <div className="flex items-center gap-2 text-[#5A0F2E]">
      <Loader2 className="animate-spin" size={20} />
      <span>Uploading...</span>
    </div>
  ) : (
    // SUCCESS STATE: Show Image + Remove/Update Options
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
        
        {/* Remove Button (X) overlay on the image */}
        <button
          onClick={() => {
            setImageUrl("");
            setPublicId("");
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
          title="Remove Image"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
          <CheckCircle2 size={14} /> <span>Image Ready!</span>
        </div>

        {/* Update Option */}
        <label className="text-sm font-medium text-[#5A0F2E] hover:underline cursor-pointer">
          Change Photo
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
    </div>
  )}
</div>

        {/* Crop Modal */}
        {cropModalOpen && selectedImage && (
          <div className="fixed inset-0 z-[10002] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-2xl w-full max-w-lg">
              <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-4">
                <Input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => { setCropModalOpen(false); setSelectedImage(null); }}>
                  Cancel
                </Button>
                <Button onClick={handleCropSave} className="bg-[#5A0F2E] text-white">
                  Crop & Upload
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || uploading || !imageUrl}
            className="bg-[#5A0F2E] text-white min-w-[140px]"
          >
            {loading ? <><Loader2 className="mr-2 animate-spin" size={18} /> Saving...</> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}