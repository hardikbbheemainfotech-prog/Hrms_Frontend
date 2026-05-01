"use client"

import React, { useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, SendHorizontal, ClipboardCheck, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils" // Shadcn helper for conditional classes
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

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if (!validate(data, ["project_name", "task_title", "description"])) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all required fields." })
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/employee/daily_task", data)
      if (res.data.success) {
        toast({ title: "Success", description: "Daily task added successfully!" })
        ;(e.target as HTMLFormElement).reset()
        setErrors({})
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed to add task" })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (!validate(data, ["type", "title", "description"])) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all required fields." })
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/employee/should_be", data)
      if (res.data.success) {
        toast({ title: "Submitted", description: "Your request has been sent to HR/Admin." })
        ;(e.target as HTMLFormElement).reset()
        setErrors({})
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed to send request" })
    } finally {
      setLoading(false)
    }
  }
  const errorClass = (name: string) => 
    errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"

  return (
      <RoleGuard allowedRoles={['employee']}>
          <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex flex-col">
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden no-scrollbar">
      <CardHeader className="bg-[#1A2517] text-white p-6">
        <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
          <SendHorizontal size={22} /> POST ACTIVITY
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="task" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="task" className="rounded-lg font-bold flex gap-2">
              <ClipboardCheck size={16} /> Daily Task
            </TabsTrigger>
            <TabsTrigger value="request" className="rounded-lg font-bold flex gap-2">
              <MessageSquare size={16} /> Request/Feedback
            </TabsTrigger>
          </TabsList>

          {/* DAILY TASK FORM */}
          <TabsContent value="task">
            <form onSubmit={handleTaskSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  name="project_name" 
                  placeholder="Project Name" 
                  className={cn("rounded-xl", errorClass("project_name"))}
                  onChange={() => clearError("project_name")}
                />
              </div>
              <Input 
                name="task_title" 
                placeholder="Task Title" 
                className={cn("rounded-xl", errorClass("task_title"))}
                onChange={() => clearError("task_title")}
              />
              <Textarea 
                name="description" 
                placeholder="Describe what you did today..." 
                className={cn("rounded-xl min-h-[120px]", errorClass("description"))}
                onChange={() => clearError("description")}
              />
              <Button type="submit" disabled={loading} className="w-full bg-[#465e3e] hover:bg-[#1A2517] rounded-xl py-6 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Post Daily Task"}
              </Button>
            </form>
          </TabsContent>

          {/* EMPLOYEE REQUEST FORM */}
          <TabsContent value="request">
            <form onSubmit={handleRequestSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="type" onValueChange={() => clearError("type")}>
                  <SelectTrigger className={cn("rounded-xl", errorClass("type"))}>
                    <SelectValue placeholder="Request Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requirement">Requirement</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  name="title" 
                  placeholder="Request Subject" 
                  className={cn("rounded-xl", errorClass("title"))}
                  onChange={() => clearError("title")}
                />
              </div>
              <Textarea 
                name="description" 
                placeholder="Explain your request in detail..." 
                className={cn("rounded-xl min-h-[120px]", errorClass("description"))}
                onChange={() => clearError("description")}
              />
              <Button type="submit" disabled={loading} className="w-full bg-[#465e3e] hover:bg-[#1A2517] rounded-xl py-6 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
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