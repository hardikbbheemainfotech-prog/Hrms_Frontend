"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"

export default function AddTeamForm() {
  const { toast } = useToast()
  
  // States
  const [loading, setLoading] = useState(false)
  const [teamId, setTeamId] = useState<string | null>(null) 
  const [employees, setEmployees] = useState<any[]>([])
  
  // Team Form State
  const [teamData, setTeamData] = useState({
    team_name: "", project_name: "", team_lead_id: "", 
    description: "", start_date: "", end_date: ""
  })

  // Member Form State
  const [memberData, setMemberData] = useState({ employee_id: "", role: "" })

  // Fetch Employees for Team Lead & Members dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/core/employees") 
        setEmployees(res.data?.data || [])
      } catch (err) { console.error(err) }
    }
    fetchStaff()
  }, [])

  // 1. Create Team Handler
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/admin/create_team", teamData)
      const newTeamId = res.data?.data?.team_id || res.data?.team_id
      setTeamId(newTeamId)
      
      toast({ title: "Team Created!", description: "Now add members to this team." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Failed" })
    } finally { setLoading(false) }
  }

  // 2. Add Member Handler
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId) return
    setLoading(true)
    try {
      await api.post(`/admin/add_team_member/${teamId}`, memberData)
      toast({ title: "Member Added!", description: "Staff added to the team successfully." })
      setMemberData({ employee_id: "", role: "" }) // Reset only member fields
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Member add nahi hua" })
    } finally { setLoading(false) }
  }

  return (
    <>
      <RoleGuard allowedRoles={["admin"]}>
            <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex flex-col">
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* SECTION 1: CREATE TEAM */}
      <div className={`bg-white p-6 rounded-xl border shadow-sm ${teamId ? "opacity-50 pointer-events-none" : ""}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={20} /> Create New Team
        </h2>
        <form onSubmit={handleCreateTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Team Name" value={teamData.team_name} onChange={(e)=>setTeamData({...teamData, team_name: e.target.value})} required />
          <Input placeholder="Project Name" value={teamData.project_name} onChange={(e)=>setTeamData({...teamData, project_name: e.target.value})} required />
          

          <select 
  name="team_lead_id"
  className="border p-2 rounded-md text-sm"
  value={teamData.team_lead_id} 
  onChange={(e) => setTeamData({ ...teamData, team_lead_id: e.target.value })}
  required
>
  <option value="">Select Team Lead</option>
  {employees.map((emp) => (
    <option key={emp.employee_id} value={emp.employee_id}> 
      {emp.first_name} {emp.last_name}
    </option>
  ))}
</select>

          <Input placeholder="Description" value={teamData.description} onChange={(e)=>setTeamData({...teamData, description: e.target.value})} />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 ml-1">Start Date</label>
            <Input type="date" value={teamData.start_date} onChange={(e)=>setTeamData({...teamData, start_date: e.target.value})} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 ml-1">End Date</label>
            <Input type="date" value={teamData.end_date} onChange={(e)=>setTeamData({...teamData, end_date: e.target.value})} />
          </div>

          <Button type="submit" disabled={loading} className="md:col-span-2">
            {loading ? <Loader2 className="animate-spin mr-2"/> : "Initialize Team"}
          </Button>
        </form>
      </div>

      {/* SECTION 2: ADD MEMBERS (Visible only after Team Creation) */}
      {teamId && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-md animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
            <UserPlus size={20} /> Add Team Members
          </h2>
          <p className="text-sm mb-4 text-blue-600 font-medium">Team ID: {teamId} (Created ✔)</p>
          
          <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold">Select Employee</label>
              <select 
                className="w-full border p-2 rounded-md bg-white"
                value={memberData.employee_id}
                onChange={(e)=>setMemberData({...memberData, employee_id: e.target.value})}
                required
              >
                <option value="">Select Staff</option>
                {employees.map((emp) => (
    <option key={emp.employee_id} value={emp.employee_id}> 
      {emp.first_name} {emp.last_name}
    </option>
  ))}
              

 
</select>
                       


            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold">Role in Team</label>
              <Input 
                placeholder="e.g. Developer, Designer" 
                value={memberData.role} 
                onChange={(e)=>setMemberData({...memberData, role: e.target.value})} 
                required 
              />
            </div>

            <Button type="submit" variant="default" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin"/> : "Add Member"}
            </Button>
          </form>

          <Button 
            variant="outline" 
            className="mt-6 w-full"
            onClick={() => { setTeamId(null); setTeamData({team_name: "", project_name: "", team_lead_id: "", description: "", start_date: "", end_date: ""}) }}
          >
            Finish & Create Another Team
          </Button>
        </div>
      )}
    </div>
    </div>
    </RoleGuard>
    </>
  )
}