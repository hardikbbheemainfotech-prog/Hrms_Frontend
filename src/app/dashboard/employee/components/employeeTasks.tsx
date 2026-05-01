"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { useSelector } from "react-redux"
import CompanySpinner from "@/components/shared/loader/spinner"

// Define your types for better TS support
type Task = {
  task_id: string;
  first_name: string;
  last_name: string;
  project_name: string;
  task_title: string;
  description: string;
  task_date: string;
  email: string;
}

type RootState = {
  auth: { user: { email: string } | null }
}

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const fetchTasks = async () => {
    if (!currentUser?.email) return;
    try {
      setLoading(true)
      const res = await api.get("/core/tasks")
      if (res.data?.success) {
        const filtered = res.data.data.filter((t: Task) => t.email === currentUser.email)
        setTasks(filtered)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [currentUser?.email])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">View your assigned tasks and work progress.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Task Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Task Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <CompanySpinner />
                      <span className="text-[#5A0F2E] font-medium animate-pulse">
                        Loading your tasks...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                // DATA STATE: Map through tasks
                tasks.map((task) => (
                  <tr key={task.task_id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {task.first_name} {task.last_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">
                      {task.project_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{task.task_title}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {task.description}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {new Date(task.task_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                // EMPTY STATE
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    No tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}