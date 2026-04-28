"use client"

import React, { useEffect} from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, ShieldCheck, Clock, Calendar, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = React.useState(true)
  const { user } = useSelector((state: any) => state.auth)

  const details = [
    { label: "Full Name", value: `${user?.first_name || ""} ${user?.last_name || user?.name || ""}`, icon: User },
    { label: "Email Address", value: user?.email || "N/A", icon: Mail },
    { label: "Designation", value: user?.role || "Employee", icon: ShieldCheck },
    { label: "Shift Started At", value: user?.loginTime ? new Date(user.loginTime).toLocaleTimeString() : "N/A", icon: Clock },
  ]
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
       <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A2517]" size={40} />
      </div>
    )
  }
 return (
  <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 shadow-lg min-h-screen pt-12">
    
    {/* Heading Section - Left Aligned */}
    <div className="w-full mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-gray-500">
          Your personal information and details
        </p>
      </div>
    </div>

    {/* Card Centered */}
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-none bg-white/80 backdrop-blur-md overflow-hidden">
        
        {/* Header Background */}
        <div className="h-52 bg-[#1A2517]" />

        <CardContent className="relative pt-0">
          
          {/* Profile Image */}
          <div className="absolute -top-63 left-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg overflow-hidden bg-white">
              <AvatarImage
                src={user?.profile_image || user?.avatar}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-green-100 text-[#1A2517]">
                {(user?.first_name || user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="mt-20 px-4">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
              {user?.first_name} {user?.last_name || user?.name}
            </h1>
            <p className="text-gray-500 font-medium capitalize">
              {user?.role} • Bheema InfoTech
            </p>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8">
            {details.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100"
              >
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
  </div>
)
}