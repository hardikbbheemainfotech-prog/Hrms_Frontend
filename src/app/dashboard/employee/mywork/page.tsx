"use client"

import React, { useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, SendHorizontal, ClipboardCheck, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import RoleGuard from "@/components/shared/RoleGuard"
import EmployeeTasks from "../components/employeeTasks"

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

  const errorClass = (name: string) => 
    errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"

  return (
      <RoleGuard allowedRoles={['employee']}>
          <div className="bg-[#f0e5df] rounded-2xl p-6 overflow-x-auto shadow-2xl p-6 space-y-6 min-h-screen flex flex-col">
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden no-scrollbar">
      <CardHeader className="bg-[#5A0F2E] text-white p-6">
        <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
         <ClipboardCheck className="w-5 h-5" /> Today's Activity 
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="task" className="w-full">
          {/* DAILY TASK FORM */}
          <TabsContent value="task">
            <form onSubmit={handleTaskSubmit} className="space-y-4" noValidate>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
                <Input 
                  name="project_name" 
                  placeholder="Project Name" 
                  className={cn("rounded-xl", errorClass("project_name"))}
                  onChange={() => clearError("project_name")}
                />
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Role
              </label>
              <Input 
                name="task_title" 
                placeholder="Task Title" 
                className={cn("rounded-xl", errorClass("task_title"))}
                onChange={() => clearError("task_title")}
              />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Describe Your Work
              </label>
              <Textarea 
                name="description" 
                placeholder="Describe what you did today..." 
                className={cn("rounded-xl min-h-[120px]", errorClass("description"))}
                onChange={() => clearError("description")}
              />
              <Button type="submit" disabled={loading} className="w-full bg-[#5A0F2E] hover:bg-[#5A0F2E] rounded-xl py-6 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Post Daily Task"}
              </Button>
            </form>
          </TabsContent>
         
        </Tabs>
      </CardContent>
    </Card>
     <EmployeeTasks/>
    </div>
    </RoleGuard>
  )
}