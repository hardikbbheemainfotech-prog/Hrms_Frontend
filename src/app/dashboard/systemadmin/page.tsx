"use client"
import Navbar from "@/components/shared/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  MoreVertical,
  ArrowUpRight
} from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

export default function FounderDashboard() {
  const stats = [
    { title: "Total Employees", value: "248", icon: Users, trend: "+12% vs last month" },
    { title: "Monthly Payroll", value: "₹42.5L", icon: DollarSign, trend: "+3% vs last month" },
    { title: "Active Openings", value: "14", icon: Briefcase, trend: "High priority" },
    { title: "Retention Rate", value: "98.2%", icon: TrendingUp, trend: "+0.4% improvement" },
  ]

  return (
    <>
    <RoleGuard allowedRoles={["systemadmin"]} >
    <Navbar role="founder" />

    <div className="p-8 bg-[#F1E9E4]/70 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Founder Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here is what's happening at Bheema Infotech.</p>
        </div>
        <Button className="bg-[#5A0F2E] hover:bg-[#70003c] shadow-lg shadow-[#5A0F2E]/20">
          Download Annual Report
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-[#5A0F2E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </RoleGuard>
    </>
  )
}