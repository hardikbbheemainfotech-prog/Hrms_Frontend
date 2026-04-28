"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "@/components/shared/navbar"
import Sidebar from "./Sidebar"
import { setLoginTime, updateDuration } from "../../../feature/sessionSlice/employeeSessionSlice"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { loginTime } = useSelector((state: any) => state.employeeSession)

  useEffect(() => {
    if (!loginTime) dispatch(setLoginTime(Date.now()))
    const interval = setInterval(() => dispatch(updateDuration()), 1000)
    return () => clearInterval(interval)
  }, [dispatch, loginTime]) 

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#ACC8A2]/20">

      {/* Navbar */}
      <div className="z-50">
        <Navbar role="hr" />
      </div>

      {/* 🔥 FIX HERE */}
      <div className="flex flex-1 min-h-0">

        <Sidebar />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>

      </div>
    </div>
  )
}