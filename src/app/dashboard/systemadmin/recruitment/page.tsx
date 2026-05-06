
"use client"

import React from "react"

import {
  Briefcase,
  Users,
  CalendarCheck,
  UserPlus,
  Search,
} from "lucide-react"

const stats = [
  {
    title: "Open Positions",
    value: "24",
    icon: Briefcase,
  },
  {
    title: "Applicants",
    value: "186",
    icon: Users,
  },
  {
    title: "Interviews Scheduled",
    value: "32",
    icon: CalendarCheck,
  },
  {
    title: "New Hires",
    value: "8",
    icon: UserPlus,
  },
]

const recentApplicants = [
  {
    name: "Aarav Sharma",
    role: "Frontend Developer",
    status: "Interview Scheduled",
  },
  {
    name: "Priya Verma",
    role: "UI/UX Designer",
    status: "Under Review",
  },
  {
    name: "Rohan Gupta",
    role: "Backend Developer",
    status: "Selected",
  },
  {
    name: "Sneha Patel",
    role: "HR Executive",
    status: "Pending",
  },
]

export default function RecruitmentPage() {
  return (
    <>
      <div className="h-screen flex flex-col bg-[#ACC8A2]/20 overflow-hidden">
      

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#5A0F2E]">
                Recruitment Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage hiring, applicants, and onboarding pipeline
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#5A0F2E] text-white px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all">
              <Search className="w-5 h-5" />
              View Candidates
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stats.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <h2 className="text-3xl font-bold text-[#5A0F2E] mt-2">
                        {item.value}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-[#5A0F2E]/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#5A0F2E]" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Applicants */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#5A0F2E]">
                Recent Applicants
              </h2>

              <button className="text-sm text-[#5A0F2E] font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentApplicants.map((applicant, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-[#F9F6F3]/80 hover:bg-[#F1E9E4] transition-all"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {applicant.name}
                    </h3>
                    <p className="text-sm text-gray-500">{applicant.role}</p>
                  </div>

                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#5A0F2E]/10 text-[#5A0F2E] w-fit">
                    {applicant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
  )
}