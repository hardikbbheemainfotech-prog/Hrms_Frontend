"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use_toast"
import { Loader2, Trash2, Mail, Briefcase, Calendar, MapPin, PhoneCall, ShieldMinus, UserKey } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"
import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IconTooltip from "@/components/ui/IconTooltip"

export default function EmployeeTable() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await api.get("/core/employees")
      setEmployees(res.data?.data || [])
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Fetch fail ho gaya" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleRemoveStaff = async (id: number) => {
    if (!confirm("Pakka delete karna hai?")) return
    try {
      setDeletingId(id)
      await api.delete(`/admin/remove_staff/${id}`)
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id))
      toast({ title: "Removed!", description: "Employee data deleted." })
    } catch (error) {
      toast({ variant: "destructive", title: "Failed", description: "Delete nahi hua" })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
            <p className="text-muted-foreground">Manage all organization employees from here.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold">
            Total: {employees.length}
          </div>
        </div>

        {loading ? (
          <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="border rounded-xl overflow-hidden bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b uppercase text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Designation & Dept</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Hire Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Employee & Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={emp.profile_image} />
                          <AvatarFallback>{emp.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs font-mono">Employee ID: {emp.employee_id}</p>
                        </div>
                      </div>
                    </td>

                 <td className="px-6 py-4">
  <div className="flex flex-col text-xs">

    <span className="font-semibold text-gray-700 flex items-center gap-1">
         <IconTooltip
        icon={  <Briefcase size={12} />}
        label="Role"
      />
      {emp.job_title}
    </span>

    <span className="mt-1 flex items-center gap-1 text-gray-600">
      <IconTooltip
        icon={<UserKey size={12} />}
        label="Department"
      />
      {emp.department_name}
    </span>

  </div>
</td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs gap-1">
                        <span className="flex items-center gap-1"><Mail size={12}/> {emp.email}</span>
                        <span className="flex items-center gap-1"><PhoneCall size={12} /> {emp.phone}</span>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="px-6 py-4 font-semibold text-green-700">
                      ₹{parseFloat(emp.salary).toLocaleString()}
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12}/> {new Date(emp.hire_date).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                     <IconTooltip
  icon={
    deletingId === emp.employee_id ? (
      <Loader2 className="animate-spin" size={16} />
    ) : (
      <ShieldMinus size={16} />
    )
  }
  label="Remove Staff"
  onClick={() => handleRemoveStaff(emp.employee_id)}
  className="text-red-500 hover:bg-red-50 p-2 rounded"
/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  )
}