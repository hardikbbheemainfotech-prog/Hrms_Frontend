"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Navbar from "@/components/shared/navbar"
import Sidebar from "../../../components/employee/sidebar"

import {
  initializeSession,
  updateDuration,
} from "../../../feature/sessionSlice/employeeSessionSlice"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeSession())

    const interval = setInterval(() => {
      dispatch(updateDuration())
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <div className="flex flex-col h-screen overflow-x-auto no-scrollbar bg-[#F1E9E4]">
      <div className="z-50">
        <Navbar role="employee" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-[#F1E9E4]/70 rounded-2xl overflow-y-auto p-0 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}