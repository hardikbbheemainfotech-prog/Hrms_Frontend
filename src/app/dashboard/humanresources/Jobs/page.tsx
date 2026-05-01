"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Briefcase, PlusCircle, CalendarPlus } from "lucide-react"

import PostJobPage from "./PostJob/page"
import JobsList from "./GetJob/page"
import CreateInterviewPage from "./Interview/page"
export default function JobsPage() {
  const [view, setView] = useState<"list" | "post" | "interview">("list")

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5 bg-white/60 rounded-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Briefcase className="text-[#5A0F2E]" />
          <h2 className="text-xl font-bold text-[#1a3112]">
            Jobs
          </h2>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 flex-wrap">

          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            View Jobs
          </Button>

          <Button
            variant={view === "post" ? "default" : "outline"}
            onClick={() => setView("post")}
          >
            <PlusCircle className="mr-1" size={16} />
            Post Job
          </Button>

          {/* 🔥 NEW BUTTON */}
          <Button
            variant={view === "interview" ? "default" : "outline"}
            onClick={() => setView("interview")}
          >
            <CalendarPlus className="mr-1" size={16} />
            Interviews
          </Button>

        </div>

      </div>

      {/* Content Switch */}
      <div>
        {view === "list" && <JobsList />}
        {view === "post" && <PostJobPage />}
        {view === "interview" && <CreateInterviewPage />}
      </div>

    </div>
  )
}