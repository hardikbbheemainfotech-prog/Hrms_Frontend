"use client"

import React, { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Calendar,
  ShieldMinus,
  Users,
  FolderKanban,
  UserCog,
  ClipboardList,
  User,
} from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"
import IconTooltip from "@/components/ui/IconTooltip"
import CompanySpinner from "@/components/shared/loader/spinner"

export default function ManageTeamPage() {
  const { toast } = useToast()

  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchTeams = async () => {
    try {
      setLoading(true)

      const res = await api.get("/admin/get_teams")

      setTeams(res.data?.data || [])
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch teams",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleRemoveTeam = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team?")) return

    try {
      setDeletingId(id)

      await api.delete(`/admin/remove_team/${id}`)

      setTeams((prev) => prev.filter((team) => Number(team.team_id) !== id))

      toast({
        title: "Removed!",
        description: "Team deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Team deletion failed",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <RoleGuard allowedRoles={["admin", "hr"]}>
      <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 shadow-lg space-y-6 flex flex-col">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-7 h-7" />
                Manage Teams
              </h1>
              <p className="text-sm text-gray-500">
                View and manage all organizational teams and projects.
              </p>
            </div>

            <div className="bg-white/70 px-4 py-2 rounded-full shadow-sm border text-sm font-bold text-gray-700">
              Total Teams: {teams.length}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <CompanySpinner />
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-12 py-6">Team</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Team Lead</th>
                      <th className="px-6 py-4">Members</th>
                      <th className="px-12 py-4">Timeline</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {teams.map((team) => (
                      <tr
                        key={team.team_id}
                        className="hover:bg-gray-50/40 transition-all"
                      >
                        {/* Team Name */}
                        <td className="px-6 py-6">
                          <div>
                            <p className="font-bold text-gray-800 flex items-center gap-2">
                              <Users size={16} className="text-gray-500"/>
                              {team.team_name?.trim()}
                            </p>
                          </div>
                        </td>

                        {/* Project */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-700 flex items-center gap-1">
                              <FolderKanban size={14} />
                              {team.project_name}
                            </p>
                            <p className="text-xs text-gray-500 max-w-xs line-clamp-2">
                              {team.description || "No description"}
                            </p>
                          </div>
                        </td>

                        {/* Lead */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 flex items-center gap-1 font-medium">
                            {team.team_lead_name || "Unassigned"}
                          </span>
                        </td>

                        {/* Members */}
                        {/* Members */}
<td className="px-6 py-4">
  <details className="group">
    <summary className="list-none cursor-pointer flex items-center justify-between gap-2 font-semibold text-gray-700 hover:text-gray-900 transition">
      <span>
        {team.members?.length || 0} Members
      </span>

      <span className="text-xs text-blue-500 group-open:rotate-180 transition-transform">
        ▼
      </span>
    </summary>

    <div className="mt-3 bg-gray-50 rounded-xl p-3 border space-y-2 max-h-40 overflow-y-auto">
      {team.members?.length > 0 ? (
        team.members.map((member: any) => (
          <div
            key={member.team_member_id}
            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border hover:shadow-sm transition"
          >
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">
                  Joined: {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {member.role}
            </span>
          </div>
        ))
      ) : (
        <p className="text-xs text-orange-500 text-center">
          No members assigned
        </p>
      )}
    </div>
  </details>
</td>

                        {/* Timeline */}
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center gap-1">
                              <Calendar size={12} />
                              Start:{" "}
                              {new Date(team.start_date).toLocaleDateString()}
                            </p>
                            <p className="flex items-center gap-1">
                              <Calendar size={12} />
                              End:{" "}
                              {new Date(team.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              team.status?.toLowerCase() === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {team.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <IconTooltip
                            label="Remove Team"
                            icon={
                              <span
                                onClick={() =>
                                  deletingId !== Number(team.team_id) &&
                                  handleRemoveTeam(Number(team.team_id))
                                }
                                className={`p-2 rounded-xl transition-all ${
                                  deletingId === Number(team.team_id)
                                    ? "opacity-50 cursor-not-allowed text-red-300"
                                    : "text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                }`}
                              >
                                {deletingId === Number(team.team_id) ? (
                                  <Loader2
                                    className="animate-spin"
                                    size={18}
                                  />
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

                {teams.length === 0 && (
                  <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                    <ClipboardList className="w-10 h-10 opacity-50" />
                    No teams found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}