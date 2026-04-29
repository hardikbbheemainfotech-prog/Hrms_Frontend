"use client"

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

// --- Helper Functions ---
function getInitials(first: string = "", last: string = "") {
  return `${(first[0] || "")}${(last[0] || "")}`.toUpperCase()
}

function padId(id: number | string) {
  return id ? String(id).padStart(3, "0") : "000"
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state: any) => state.auth)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="bg-[#ACC8A2]/90 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A2517]" size={40} />
      </div>
    )
  }
  
  if (!user) return null

  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name
  const initials = getInitials(user.first_name || user.name, user.last_name)

  return (
    <RoleGuard allowedRoles={["employee"]}>
        <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex justify-center items-center ">
        <div className="flex flex-col items-center group">
          {/* Lanyard Hook */}
          <div className="w-6 h-12 bg-[#1a3112] rounded-t-md relative z-10">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-300 rounded-b-md" />
          </div>

          {/* ID Card */}
          <div className="bg-white rounded-2xl w-[280px] overflow-hidden relative z-20 
            shadow-lg transition-all duration-300 
            group-hover:-translate-y-2 group-hover:shadow-2xl">

            {/* Header Branding */}
            <div className="bg-[#1a3112] px-3 py-3 text-center">
              <p className="text-white font-semibold text-xs tracking-widest uppercase">
                Bheema Infotech
              </p>
              <p className="text-[#a8c89e] text-[9px] tracking-wider uppercase">
                Pvt. Ltd.
              </p>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center pt-5 px-3">
              <div className="relative w-20 h-[90px] bg-[#4e7740] rounded-b-[40px] flex items-end justify-center pb-1 shadow-inner">
                {user.profile_image || user.avatar ? (
                  <img
                    src={user.profile_image || user.avatar}
                    alt={name}
                    className="w-[62px] h-[62px] rounded-full border-2 border-white object-cover shadow-md bg-white"
                  />
                ) : (
                  <div className="w-[62px] h-[62px] rounded-full border-2 border-white bg-[#4e7740] flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {initials}
                  </div>
                )}
              </div>

              <p className="mt-3 text-[#1a3112] font-semibold text-[15px] text-center leading-tight">
                {name}
              </p>
              <p className="text-[10px] text-[#4e7740] tracking-widest uppercase mt-1 mb-2 text-center">
                {user.job_title || user.role || "Employee"}
              </p>

              {(user.department_name || user.department) && (
                <span className="text-[11px] font-medium text-[#1a3112] bg-[#e6f2e6] px-3 py-0.5 rounded-full mb-3">
                  {user.department_name || user.department}
                </span>
              )}
            </div>

            <div className="w-full h-px bg-gray-100 my-2" />

          {/* Employee Details */}
<div className="px-5 pb-2 space-y-4 text-[11.5px]">
  
  {/* ID Row */}
  <div className="flex justify-between items-center">
    <span className="font-medium text-gray-400">ID</span>
    <span className="text-[#1a3112] font-semibold tracking-wider">
      {padId(user.employee_id || user.id)}
    </span>
  </div>

  {/* Email Row - Using break-words to avoid splitting the name/domain */}
  <div className="flex justify-between items-start gap-2">
    <span className="font-medium text-gray-400">Email</span>
    <span className="text-[#1a3112] font-medium text-right break-words flex-1 leading-tight">
      {user.email}
    </span>
  </div>

  {/* Shift Row */}
  <div className="flex justify-between items-center">
    <span className="font-medium text-gray-400 whitespace-nowrap">Shift Started At</span>
    <span className="text-[#1a3112] font-semibold">
      {user?.loginTime ? new Date(user.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
    </span>
  </div>

</div>

            {/* Bottom Graphic */}
            <div className="flex justify-center mt-3">
              <div className="w-10 h-1.5 bg-[#1a3112] rounded-full opacity-80" />
            </div>

            {/* Footer Website */}
            <p className="text-center text-[9px] text-[#4e7740] tracking-wide py-3">
              bheemainfotech.in
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
=======
"use client"

import React from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, ShieldCheck, Clock, Calendar } from "lucide-react"
import RoleGuard from "@/components/shared/RoleGuard"

export default function ProfilePage() {
  // Redux se user data fetch karo
  const { user } = useSelector((state: any) => state.auth)

  const details = [
    { label: "Full Name", value: `${user?.first_name || ""} ${user?.last_name || user?.name || ""}`, icon: User },
    { label: "Email Address", value: user?.email || "N/A", icon: Mail },
    { label: "Designation", value: user?.role || "Employee", icon: ShieldCheck },
    { label: "Shift Started At", value: user?.loginTime ? new Date(user.loginTime).toLocaleTimeString() : "N/A", icon: Clock },
  ]

  return (
    <>
      <RoleGuard allowedRoles={["employee"]}>
        <div className="p-8 bg-[#ACC8A2]/70  min-h-screen flex justify-center items-start pt-12">
          <Card className="w-full max-w-2xl shadow-xl border-none bg-white/80 backdrop-blur-md overflow-hidden">
            {/* Profile Header Background */}
            <div className="h-50 bg-[#1A2517]" />

            <CardContent className="relative pt-0">
              {/* Profile Picture */}
              <div className="absolute -top-60  left-8">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg overflow-hidden bg-white">
                  <AvatarImage
                    src={user?.profile_image || user?.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-green-100 text-[#1A2517]">
                    {(user?.first_name || user?.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Basic Info */}
              <div className="mt-20 px-4">
                <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
                  {user?.first_name} {user?.last_name || user?.name}
                </h1>
                <p className="text-gray-500 font-medium capitalize">{user?.role} • Bheema InfoTech</p>
              </div>

              <hr className="my-8 border-gray-100" />

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8">
                {details.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-[#1A2517]">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </>
  )
}