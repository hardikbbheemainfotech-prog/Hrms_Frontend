"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "@/components/shared/navbar"
import Sidebar from "../../../components/employee/sidebar"
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
    <div className="flex flex-col h-screen overflow-x-auto no-scrollbar bg-[#ACC8A2]/20">
      {/* Navbar hamesha top par rahega */}
      <div className="z-50">
        <Navbar role="employee" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-[#ACC8A2]/70 overflow-y-auto p-0 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}