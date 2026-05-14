"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Cropper from "react-easy-crop"

import {
  Loader2,
  X
} from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useHRData } from "@/hooks/useHRData"

export default function UpdateEmployeeModal({
  open,
  setEditOpen,
  employee,
  onSuccess,
}: {
  open: boolean
  setEditOpen: (value: boolean) => void
  employee: any
  onSuccess?: () => void
}) {

  const { toast } = useToast()

  const {
    departments,
    loadingDepartments
  } = useHRData()

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    profile_image: "",
    profile_public_key: "",
    job_title: "",
    department: "",
    switch_to: "",
    salary: "",
    stipend: ""
  })

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)

  useEffect(() => {
    if (employee) {
      setForm({
        email: employee.email || "",
        profile_image: employee.profile_image || "",
        profile_public_key: employee.profile_public_key || "",
        job_title: employee.job_title || "",
        department: String(employee.department_id || ""),
        switch_to: employee.role_name === "intern"
          ? employee.internship_type === "UNPAID"
            ? "UNPAID"
            : "PAID"
          : "FULL_TIME",
        salary: employee.salary ? String(employee.salary) : "",
        stipend: employee.stipend ? String(employee.stipend) : ""
      })
    }
  }, [employee])

  const resetCropState = () => {
    setCropModalOpen(false)
    setSelectedImage(null)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
  }

  const closeModal = () => {
    resetCropState()
    setEditOpen(false)
  }

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
          body: data
        }
      )

      const result = await res.json()

      return {
        url: result.secure_url,
        public_id: result.public_id
      }

    } catch {
      toast({
        variant: "destructive",
        title: "Image upload failed"
      })

      return null

    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setSelectedImage(URL.createObjectURL(file))
    setCropModalOpen(true)
  }

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const getCroppedImg = async (
    imageSrc: string,
    cropData: any
  ) => {

    const image = new Image()
    image.src = imageSrc

    await new Promise((resolve) => {
      image.onload = resolve
    })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = cropData.width
    canvas.height = cropData.height

    ctx?.drawImage(
      image,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      0,
      0,
      cropData.width,
      cropData.height
    )

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return

          resolve(
            new File(
              [blob],
              "cropped.jpg",
              {
                type: "image/jpeg"
              }
            )
          )
        },
        "image/jpeg"
      )
    })
  }

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return

    const croppedFile = await getCroppedImg(
      selectedImage,
      croppedAreaPixels
    )

    const result = await uploadImage(croppedFile)

    if (result) {
      setForm(prev => ({
        ...prev,
        profile_image: result.url,
        profile_public_key: result.public_id
      }))

      resetCropState()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const payload = {
        email: form.email,
        profile_image: form.profile_image,
        profile_public_key: form.profile_public_key,
        job_title: form.job_title,
        department: form.department,
        switch_to: form.switch_to,
        salary:
          form.switch_to === "FULL_TIME"
            ? Number(form.salary)
            : undefined,
        stipend:
          form.switch_to === "PAID"
            ? Number(form.stipend)
            : undefined
      }

      await api.put(
        `/hr/update-profile/${employee.employee_id}`,
        payload
      )

      toast({
        title: "Updated successfully"
      })

      onSuccess?.()
      closeModal()

    } catch (err: any) {

      toast({
        variant: "destructive",
        title: "Failed",
        description:
          err?.response?.data?.message ||
          "Something went wrong"
      })

    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">

      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto relative">

        <div className="flex justify-between items-center mb-6">

          <h2 className="font-bold text-2xl text-[#5A0F2E]">
            Update Employee
          </h2>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={closeModal}
          >
            <X size={20} />
          </Button>

        </div>

        <div className="space-y-4">

          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <Input
            placeholder="Job Title"
            value={form.job_title}
            onChange={(e) =>
              setForm({
                ...form,
                job_title: e.target.value
              })
            }
          />

          <Select
            value={form.department}
            onValueChange={(value) =>
              setForm({
                ...form,
                department: value
              })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingDepartments
                    ? "Loading..."
                    : "Select Department"
                }
              />
            </SelectTrigger>

            <SelectContent className="z-[999999] bg-white">
              {
                departments?.length
                  ? departments.map((dep: any) => (
                    <SelectItem
                      key={dep.department_id}
                      value={String(dep.department_id)}
                    >
                      {dep.name}
                    </SelectItem>
                  ))
                  : (
                    <SelectItem
                      value="empty"
                      disabled
                    >
                      No Departments
                    </SelectItem>
                  )
              }
            </SelectContent>
          </Select>

          <Select
            value={form.switch_to}
            onValueChange={(value) =>
              setForm({
                ...form,
                switch_to: value,
                salary: "",
                stipend: ""
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employee Type" />
            </SelectTrigger>

            <SelectContent className="z-[999999] bg-white">
              <SelectItem value="PAID">
                Paid Intern
              </SelectItem>

              <SelectItem value="UNPAID">
                Unpaid Intern
              </SelectItem>

              <SelectItem value="FULL_TIME">
                Full Time
              </SelectItem>
            </SelectContent>
          </Select>

          {
            form.switch_to === "PAID" && (
              <Input
                type="number"
                placeholder="Stipend"
                value={form.stipend}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stipend: e.target.value
                  })
                }
              />
            )
          }

          {
            form.switch_to === "FULL_TIME" && (
              <Input
                type="number"
                placeholder="Salary"
                value={form.salary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    salary: e.target.value
                  })
                }
              />
            )
          }

          <div className="space-y-3">

            {
              form.profile_image && (
                <img
                  src={form.profile_image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              )
            }

            <Input
              type="file"
              accept="image/*"
              onChange={handleFile}
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="bg-[#5A0F2E] hover:bg-[#4a0c26]"
          >
            {
              loading ? (
                <>
                  <Loader2
                    className="animate-spin mr-2"
                    size={18}
                  />
                  Saving...
                </>
              ) : (
                "Update"
              )
            }
          </Button>

        </div>

        {
          cropModalOpen &&
          selectedImage && (
            <div className="fixed inset-0 z-[100001] bg-black/70 flex items-center justify-center p-4">

              <div className="bg-white p-5 rounded-2xl w-full max-w-md">

                <div className="relative h-[350px] w-full">
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

                <input
                  className="w-full mt-4"
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) =>
                    setZoom(Number(e.target.value))
                  }
                />

                <div className="flex gap-3 mt-5">

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={resetCropState}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-[#5A0F2E] hover:bg-[#4a0c26]"
                    onClick={handleCropSave}
                    disabled={uploading}
                  >
                    {
                      uploading
                        ? "Uploading..."
                        : "Crop & Upload"
                    }
                  </Button>

                </div>

              </div>

            </div>
          )
        }

      </div>

    </div>
  )
}