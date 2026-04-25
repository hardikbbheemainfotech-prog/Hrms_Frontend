"use client"
import Navbar from "@/components/shared/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, FileText, Calendar } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

export default function HRDashboard() {
  const stats = [
    { title: "Total Employees", value: "248", icon: Users },
    { title: "New Hires", value: "12", icon: UserPlus },
    { title: "Leave Requests", value: "18", icon: Calendar },
    { title: "Policies Updated", value: "5", icon: FileText },
  ]

  return (
    <>
    <RoleGuard allowedRoles={["humanresourse"]} >
      <Navbar role="hr" />

      <div className="p-8 bg-[#ACC8A2]/70 min-h-screen space-y-8">
        <h1 className="text-3xl font-bold">HR Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex justify-between flex-row">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-[#1A2517]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Employee Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Employee onboarding, resignations, and updates.</p>
          </CardContent>
        </Card>
      </div>
      </RoleGuard>
    </>
  )
}