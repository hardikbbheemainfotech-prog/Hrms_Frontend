"use client"

import React, { ReactNode, useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Loader2, HandHelping, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import IconTooltip from "@/components/ui/IconTooltip"

type GlobalSupportModalProps = {
  trigger?: ReactNode
}

export default function GlobalSupportModal({
  trigger,
}: GlobalSupportModalProps) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [requestType, setRequestType] = useState("")

  const validate = (data: Record<string, any>, fields: string[]) => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    fields.forEach((field) => {
      if (!data[field] || data[field].toString().trim() === "") {
        newErrors[field] = true
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const clearError = (name: string) => {
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("type", requestType)

    const data = Object.fromEntries(formData.entries())

    if (!validate(data, ["type", "title", "description"])) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill all required fields.",
      })
      return
    }

    try {
      setLoading(true)

      const res = await api.post("/employee/should_be", data)

      if (res.data.success) {
        toast({
          title: "Submitted",
          description: "Your request has been sent successfully.",
        })

        ;(e.target as HTMLFormElement).reset()
        setRequestType("")
        setErrors({})
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err.response?.data?.message || "Failed to submit request",
      })
    } finally {
      setLoading(false)
    }
  }

  const errorClass = (name: string) =>
    errors[name] ? "border-red-500" : "border-gray-200"

  return (
    <Dialog>
     <DialogTrigger asChild>
  <div className="fixed bottom-3 right-70 z-50">
    <IconTooltip
      label="Employee Support"
      icon={
        <Button
          type="button"
          size="icon"
          className="bg-[#5A0F2E] text-white w-10 h-10 rounded-full shadow-xl hover:scale-110 transition"
        >
          <Info size={20} />
        </Button>
      }
    />
  </div>
</DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden">

        <DialogHeader className="bg-[#5A0F2E] text-white p-4">
          <DialogTitle className="flex items-center gap-2">
            <HandHelping size={18} />
            Employee Support
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {/* Request Type */}
          <div>
            <label className="text-sm font-semibold">Request Type</label>
         
               <Select
              value={requestType}
              onValueChange={(value) => {
                setRequestType(value)
                clearError("type")
              }}
            >
              <SelectTrigger className={cn("mt-2", errorClass("type"))}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="requirement">Requirement</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
           
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-semibold">Subject</label>

            <Input
              name="title"
              placeholder="Your Subject"
              className={cn("mt-2 h-11 rounded-xl", errorClass("title"))}
              onChange={() => clearError("title")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold">Description</label>

            <Textarea
              name="description"
              placeholder="Your Message"
              className={cn(
                "mt-2 min-h-[140px] rounded-2xl",
                errorClass("description")
              )}
              onChange={() => clearError("description")}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5A0F2E] hover:bg-[#4a0c26] rounded-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}