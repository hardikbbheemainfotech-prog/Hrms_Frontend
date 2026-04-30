"use client"
import Navbar from "@/components/shared/navbar"
import RoleGuard from "@/components/shared/RoleGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Clock, BarChart } from "lucide-react"
import ManagerTasks from "./components/ManagerTasks"

export default function adminDashboard() {
  const stats = [
    { title: "Team Members", value: "12", icon: Users },
    { title: "Tasks Completed", value: "86", icon: CheckCircle },
    { title: "Pending Tasks", value: "14", icon: Clock },
    { title: "Performance", value: "92%", icon: BarChart },
  ]

  return (
    <>
    <RoleGuard allowedRoles={["admin"]} >
  <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex flex-col">
      <div className="p-8 bg-[#ACC8A2]/70 min-h-screen space-y-8">
        <h1 className="text-3xl font-bold">admin Dashboard</h1>

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
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track team productivity and performance.</p>
          </CardContent>
        </Card>
        <ManagerTasks/>
      </div>
      </div>
      </RoleGuard>
    </>
  )
}