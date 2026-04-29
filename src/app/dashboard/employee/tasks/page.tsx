"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use_toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ClipboardList, 
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

export default function EmployeeTasksPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employee/tasks")
      setTasks(response.data?.data || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to load tasks" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await api.put(`/employee/tasks/${taskId}`, { status: newStatus })
      toast({ title: "Updated", description: `Task marked as ${newStatus}` })
      fetchTasks()
    } catch (error) {
      toast({ variant: "destructive", title: "Update failed" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
       <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A2517]" size={40} />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={['employee']}>
      <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex flex-col">
    {/* <div className="p-8 space-y-8 bg-[#ACC8A2]/70 min-h-screen"> */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1A2517] flex items-center gap-2">
          <ClipboardList /> My Tasks
        </h1>
        <Badge variant="outline" className="bg-white text-[#1A2517] font-bold px-4 py-1">
          Total: {tasks.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-[#ACC8A2]/70 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Status Indicator Sidebar */}
                <div className={`w-2 ${task.status === 'completed' ? 'bg-green-500' : 'bg-orange-400'}`} />
                
                <CardContent className="flex-1  p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#1A2517]">{task.title}</h3>
                        <Badge className={`${getStatusColor(task.status)} uppercase text-[10px] font-black`}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 max-w-2xl">{task.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Due: {task.due_date?.split('T')[0]}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {task.priority || 'Medium'} Priority
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
                    {task.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-[#1A2517] text-[#1A2517] hover:bg-[#1A2517] hover:text-[#ACC8A2]"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                      >
                        <CheckCircle2 size={14} className="mr-2" /> Mark Completed
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs group">
                      Details <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-[#ACC8A2]/70 rounded-xl border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-black mb-4" size={48} />
            <h2 className="text-xl font-semibold text-black">No tasks assigned yet.</h2>
            <p className="text-black text-sm">Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
    </RoleGuard>
  )
}