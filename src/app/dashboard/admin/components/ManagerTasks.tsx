"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import {  CalendarDays, Briefcase, ClipboardList, User } from "lucide-react"
import CompanySpinner from "@/components/shared/loader/spinner"

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const res = await api.get("/admin/tasks")

      if (res.data?.success) {
        setTasks(res.data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Task Management
          </h1>
          <p className="text-muted-foreground">
            Monitor employee assigned tasks and progress.
          </p>
        </div>

        <div className="bg-white/70 px-4 py-2 rounded-full font-bold shadow-sm">
          Total Tasks: {tasks.length}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <CompanySpinner />
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-scrollbar">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-left">
              
              <thead className="bg-gray-50/50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Employee name</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Task Title</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Task Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {tasks.map((task) => (
                  <tr
                    key={task.task_id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                   <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-gray-700 font-medium">
                        <User size={14} className="text-gray-500" />
                        {task.first_name} {task.last_name}
                      </span>
                    </td>
                    {/* Project */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold text-gray-700">
                        <Briefcase size={14} className="text-gray-500" />
                        {task.project_name}
                      </span>
                    </td>

                    {/* Task Title */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-gray-700 font-medium">
                        <ClipboardList size={14} className="text-gray-500" />
                        {task.task_title}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      {task.description}
                    </td>

                  

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-gray-500">
                        <CalendarDays size={14} />
                        {new Date(task.task_date).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="p-12 text-center text-gray-400 font-medium">
                No tasks available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}