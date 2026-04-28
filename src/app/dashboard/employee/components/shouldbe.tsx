"use client"

import React, { useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use_toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, SendHorizontal, ClipboardCheck, MessageSquare } from "lucide-react"

export default function PostActivity() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await api.post("/employee/daily_task", data) 
      if (res.data.success) {
        toast({ title: "Success", description: "Daily task added successfully!" })
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed to add task" })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await api.post("/employee/should_be", data) 
      if (res.data.success) {
        toast({ title: "Submitted", description: "Your request has been sent to HR/Admin." })
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed to send request" })
    } finally {
      setLoading(false)
    }
  }

  return (
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
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="project_name" placeholder="Project Name" required className="rounded-xl border-gray-200" />
                <Input name="assigned_by" placeholder="Assigned By (Manager Name)" required className="rounded-xl border-gray-200" />
              </div>
              <Input name="task_title" placeholder="Task Title" required className="rounded-xl border-gray-200" />
              <Textarea name="description" placeholder="Describe what you did today..." required className="rounded-xl border-gray-200 min-h-[120px]" />
              <Button type="submit" disabled={loading} className="w-full bg-[#465e3e] hover:bg-[#1A2517] rounded-xl py-6 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Post Daily Task"}
              </Button>
            </form>
          </TabsContent>

          {/* EMPLOYEE REQUEST FORM */}
          <TabsContent value="request">
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="type" required>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Request Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requirement">Requirement</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="title" placeholder="Request Subject" required className="rounded-xl border-gray-200" />
              </div>
              <Textarea name="description" placeholder="Explain your request in detail..." required className="rounded-xl border-gray-200 min-h-[120px]" />
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6 font-bold text-lg transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}