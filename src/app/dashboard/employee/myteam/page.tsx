"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import {
  AlertCircle,
  ClipboardList,
  Calendar,
  Briefcase,
  Users,
  Clock,
} from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"
import CompanySpinner from "@/components/shared/loader/spinner"
import dayjs from "dayjs"
import SkeletonCard from "@/components/skeleton/SkeletonCard"
import MyTeamSkeleton from "@/components/skeleton/MyTeamSkeleton"

export default function EmployeeTasksPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<any[]>([])

  const fetchTeams = async () => {
    try {
      setLoading(true)

      const response = await api.get("/employee/my_team")

      setTeams(response.data?.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load team details",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const formatLabel = (value?: string) => {
    if (!value) return ""

    return value
      .replace(/_/g, " ")
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <RoleGuard allowedRoles={["employee"]}>
      <div className="bg-[#f0e5df] rounded-2xl p-6 shadow-lg space-y-6 min-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-[#5A0F2E] flex items-center gap-2">
            <ClipboardList />
            My Teams
          </h1>

          <Badge
            variant="outline"
            className="bg-white text-[#5A0F2E] font-bold px-4 py-1"
          >
            Total Teams: {teams.length}
          </Badge>
        </div>
       
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
                   <MyTeamSkeleton/>
                     </div>
               ) : (
        <div className="grid grid-cols-1 gap-4">
          {teams.length > 0 ? (
            teams.map((team) => (
              <Card
                key={team.team_member_id}
                className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  
                  {/* Sidebar */}
                  <div
                    className={`w-2 ${
                      team.team_status?.toLowerCase() === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  <CardContent className="flex-1 p-6">
                    
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-[#5A0F2E]">
                            {team.team_name}
                          </h3>

                          <Badge
                            className={`${getStatusColor(
                              team.team_status
                            )} uppercase text-[10px] font-black`}
                          >
                            {formatLabel(team.team_status)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600">
                          {team.description}
                        </p>
                      </div>

                     <Badge
                            className={"uppercase text-[10px] font-black"}>
                                {formatLabel(team.role)}
                          </Badge>
                    </div>

                    {/* Project Details */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        Project: {team.project_name}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        Member Status: {formatLabel(team.member_status)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Start: {dayjs(team.start_date).format("DD MMM YYYY")}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        End: {dayjs(team.end_date).format("DD MMM YYYY")}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex flex-wrap justify-between gap-3">
                      <span>
                        Joined: {dayjs(team.joined_at).format("DD MMM YYYY")}
                      </span>

                      <span>
                        Left:{" "}
                        {team.left_at
                          ? dayjs(team.left_at).format("DD MMM YYYY")
                          : "Currently Active"}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-[#F1E9E4]/70 rounded-xl border-2 border-dashed border-gray-200">
              <AlertCircle
                className="mx-auto text-black mb-4"
                size={48}
              />

              <h2 className="text-xl font-semibold text-black">
                No teams assigned yet.
              </h2>

              <p className="text-black text-sm">
                You are not part of any active team currently.
              </p>
            </div>
          )}
        </div>
               )}
      </div>
    </RoleGuard>
  )
}