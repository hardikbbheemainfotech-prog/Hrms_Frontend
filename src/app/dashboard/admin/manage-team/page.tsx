"use client"

import React, { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, Mail, Briefcase, Calendar, 
  PhoneCall, ShieldMinus, UserKey,
  Search, Plus
} from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IconTooltip from "@/components/ui/IconTooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManageTeamPage() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Fetch fail " })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleRemoveStaff = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return
    try {
      setDeletingId(id)
      await api.delete(`/admin/remove_staff/${id}`)
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id))
      toast({ title: "Removed!", description: "Employee data deleted successfully." })
    } catch (error) {
      toast({ variant: "destructive", title: "Failed", description: "Delete nahi hua" })
    } finally {
      setDeletingId(null)
    }
  }

  // Search logic
  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toString().includes(searchTerm)
  )

  return (
    <RoleGuard allowedRoles={["admin", "hr"]}>
      
            <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex flex-col">
      <div className="p-6 space-y-6 no-scrollbar">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Manage Team
            </h1>
            <p className="text-sm text-gray-500">View and manage all organization staff members.</p>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#5A0F2E]" size={40} />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-scrollbar">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 border-b text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Hired Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employee_id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={emp.profile_image} />
                            <AvatarFallback className="bg-[#F1E9E4] text-white">
                              {emp.first_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-gray-700">{emp.first_name} {emp.last_name}</p>
                            <p className="text-[10px] font-mono text-gray-400">ID: {emp.employee_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-600 flex items-center gap-1">
                            <Briefcase size={12} className="text-gray-400" /> {emp.job_title}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <UserKey size={12} /> {emp.department_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-gray-500">
                          <span className="flex items-center gap-1 text-[11px]"><Mail size={12} /> {emp.email}</span>
                          <span className="flex items-center gap-1 text-[11px]"><PhoneCall size={12} /> {emp.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(emp.hire_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <IconTooltip
                          label="Remove Staff"
                          icon={
                           <span
                           onClick={() =>
                            deletingId !== emp.employee_id &&
                            handleRemoveStaff(emp.employee_id)
                               }
                            className={`p-2 rounded-xl transition-all ${
                         deletingId === emp.employee_id
                       ? "opacity-50 cursor-not-allowed text-red-300"
                         : "text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          }`}
                           >
                              {deletingId === emp.employee_id ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : (
                                <ShieldMinus size={18} />
                              )}
                            </span>
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && (
                <div className="p-12 text-center text-gray-400">No employees found matching your search.</div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </RoleGuard>
  )
}