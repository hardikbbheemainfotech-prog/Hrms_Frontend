"use client"

import React from "react"

// --- Helper Functions ---
function getInitials(first: string = "", last: string = "",user_id?: number | string) {
  return `${(first[0] || "")}${(last[0] || "")}${(user_id ? String(user_id).slice(-2) : "")}`.toUpperCase()
}

function padId(id: number | string) {
  return id ? String(id).padStart(3, "0") : "000"
}

type EmployeeIDCardProps = {
  user: any
  compact?: boolean
}

export default function EmployeeIDCard({
  user,
  compact = false,
}: EmployeeIDCardProps) {
  if (!user) return null

  const name =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name

  const initials = getInitials(
    user.first_name || user.name,
    user.last_name,
    user.user_id,
  )

  return (
    <div className="flex flex-col items-center group">
      {/* Lanyard Hook */}
      {!compact && (
        <div className="w-6 h-12 bg-[#1a3112] rounded-t-md relative z-10">
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-300 rounded-b-md" />
        </div>
      )}

      {/* ID Card */}
      <div
        className={`
          bg-white rounded-2xl overflow-hidden relative z-20
          shadow-lg transition-all duration-300
          group-hover:-translate-y-2 group-hover:shadow-2xl
          ${compact ? "w-[260px]" : "w-[280px]"}
        `}
      >
        {/* Header */}
        <div className="bg-[#1a3112] px-3 py-3 text-center">
          <p className="text-white font-semibold text-xs tracking-widest uppercase">
            Bheema Infotech
          </p>
          <p className="text-[#a8c89e] text-[9px] tracking-wider uppercase">
            Pvt. Ltd.
          </p>
        </div>

        {/* Profile */}
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

        {/* Details */}
        <div className="px-5 pb-2 space-y-4 text-[11.5px]">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-400">ID</span>
            <span className="text-[#1a3112] font-semibold tracking-wider">
              {padId(user.user_id)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-400 whitespace-nowrap">
              Shift Started
            </span>
            <span className="text-[#1a3112] font-semibold">
              {user?.loginTime
                ? new Date(user.loginTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-3">
          <div className="w-10 h-1.5 bg-[#1a3112] rounded-full opacity-80" />
        </div>

        <p className="text-center text-[9px] text-[#4e7740] tracking-wide py-3">
          bheemainfotech.in
        </p>
      </div>
    </div>
  )
}