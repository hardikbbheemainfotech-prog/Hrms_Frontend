"use client"

import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Timer, Briefcase, Loader2 } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

export default function MyWorkPage() {
 const [loading, setLoading] = React.useState(true)
  const { user } = useSelector((state: any) => state.auth)
  const { duration } = useSelector((state: any) => state.employeeSession)

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const fetchSessionData = () => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }
   
  useEffect(() => {
    fetchSessionData()
  }, [])
  const stats = [
    {
      title: "Current Session",
      value: formatDuration(duration || 0),
      icon: Timer,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Shift Started",
      value: user?.loginTime ? new Date(user.loginTime).toLocaleTimeString() : "--:--",
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Designation",
      value: user?.role || "Employee",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]
  if (loading) {
    return (
       <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5A0F2E]" size={40} />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["employee"]}>
        <div className="bg-[#F1E9E4]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex flex-col">
      <div className="p-6 space-y-6 no-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">MY WORK DESK</h1>
          <p className="text-sm text-gray-500">Track your daily progress and active session details.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-md bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-700">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md no-scrollbar">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} />
                Today's Tasks
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active Session
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Briefcase className="text-gray-300" size={40} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">No active tasks assigned yet</h3>
              <p className="text-sm text-gray-400">Your manager will assign tasks here shortly.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </RoleGuard>
  )
}