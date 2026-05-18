"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Navbar from "@/components/shared/navbar"
import Sidebar from "./sidebar"

import RoleGuard from "@/components/shared/RoleGuard"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
        <RoleGuard allowedRoles={["admin"]}>
    <div className="flex flex-col h-screen overflow-x-auto no-scrollbar bg-[#F1E9E4]/20">
      {/* Navbar always on top */}
      <div className="z-50">
        <Navbar role="admin" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-[#F1E9E4]/70 overflow-y-auto p-0 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
    </RoleGuard>
  )
}