"use client"
import React, { useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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
import { Loader2, HandHelping } from "lucide-react"
import { cn } from "@/lib/utils"
import RoleGuard from "@/components/shared/RoleGuard"

export default function PostActivity() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

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

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (!validate(data, ["type", "title", "description"])) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      })
      return
    }

    setLoading(true)

    try {
      const res = await api.post("/employee/should_be", data)

      if (res.data.success) {
        toast({
          title: "Submitted",
          description: "Your request has been sent to HR/Admin.",
        })

        ;(e.target as HTMLFormElement).reset()
        setErrors({})
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err.response?.data?.message || "Failed to send request",
      })
    } finally {
      setLoading(false)
    }
  }

  const errorClass = (name: string) =>
    errors[name]
      ? "border-red-500 focus-visible:ring-red-500"
      : "border-gray-200"

  return (
    <RoleGuard allowedRoles={["employee"]}>
      <div className="min-h-screen rounded-2xl bg-[#f0e5df] p-4 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        
        <Card className="mx-auto w-full max-w-5xl border-none bg-white/95 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Header */}
          <CardHeader className="bg-[#5A0F2E] text-white px-6 py-5 md:px-8">
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold tracking-tight">
            
                <HandHelping size={22} />
             
              Employee Support
            </CardTitle>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-4 md:p-8">
            <Tabs defaultValue="request" className="w-full">
              <TabsContent value="request" className="mt-0">
                
                <form
                  onSubmit={handleRequestSubmit}
                  className="space-y-6"
                  noValidate
                >
                  
                  {/* Request Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Request Type
                    </label>
                    <Select
                      name="type"
                      onValueChange={() => clearError("type")}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full rounded-xl h-12 bg-white",
                          errorClass("type")
                        )}
                      >
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl">
                        <SelectItem value="requirement">
                          Requirement
                        </SelectItem>
                        <SelectItem value="feedback">
                          Feedback
                        </SelectItem>
                        <SelectItem value="complaint">
                          Complaint
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Request Subject
                    </label>
                    <Input
                      name="title"
                      placeholder="Enter request subject"
                      className={cn(
                        "rounded-xl h-12",
                        errorClass("title")
                      )}
                      onChange={() => clearError("title")}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Describe Your Request
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Explain your request in detail..."
                      className={cn(
                        "rounded-2xl min-h-[160px] resize-none",
                        errorClass("description")
                      )}
                      onChange={() => clearError("description")}
                    />
                  </div>

                  {/* Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl py-6 text-base md:text-lg font-bold bg-[#5A0F2E] hover:bg-[#4a0c26] transition-all shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}