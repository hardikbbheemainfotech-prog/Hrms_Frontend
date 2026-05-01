"use client"

import  { useEffect, useState } from "react"
import api from "@/lib/axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Bell, BellOff, ChevronDown, Megaphone, Plus, X } from "lucide-react"
import { Announcement } from "@/types/hrTypes"
import { CreateModal } from "./AddAnn"

dayjs.extend(relativeTime)


export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  hr:       { bg: "#e8f5e9", text: "#2d6a4f" },
  manager:  { bg: "#e8f1fd", text: "#2563eb" },
  employee: { bg: "#f5eeff", text: "#7c3aed" },
  admin:    { bg: "#fff0ee", text: "#dc2626" },
}

function AnnouncementCard({ a, expanded, onToggle }: {
  a: Announcement
  expanded: boolean
  onToggle: () => void
}) {
  const isExpired = a.expires_at && dayjs(a.expires_at).isBefore(dayjs())

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isExpired
          ? "border-gray-100 bg-gray-50/60 opacity-60"
          : "border-[#ACC8A2]/40 bg-white hover:shadow-sm hover:border-[#ACC8A2]/80"
      }`}
    >
      {/* Card Header — always visible */}
      <button
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
        onClick={onToggle}
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e8f0e4] flex items-center justify-center mt-0.5">
          <Megaphone className="w-4 h-4 text-[#2d6a4f]" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#1a3112] truncate">{a.title}</p>
            {isExpired && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 font-semibold">
                Expired
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {dayjs(a.created_at).fromNow()}
            {a.expires_at && (
              <> · expires {dayjs(a.expires_at).format("DD MMM YYYY, hh:mm A")}</>
            )}
          </p>
        </div>

        {/* Role chips + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-[160px]">
            {a.target_roles?.map((role) => {
              const c = ROLE_COLORS[role] || { bg: "#f5f5f5", text: "#888" }
              return (
                <span
                  key={role}
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                  style={{ background: c.bg, color: c.text }}
                >
                  {role}
                </span>
              )
            })}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded message */}
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="ml-11 pl-0.5">
            <div className="h-px bg-[#ACC8A2]/30 mb-3" />
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {a.message}
            </p>
            {/* Mobile roles */}
            <div className="flex sm:hidden gap-1.5 mt-3 flex-wrap">
              {a.target_roles?.map((role) => {
                const c = ROLE_COLORS[role] || { bg: "#f5f5f5", text: "#888" }
                return (
                  <span
                    key={role}
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {role}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading]             = useState(false)
  const [modalOpen, setModalOpen]         = useState(false)
  const [expandedId, setExpandedId]       = useState<number | null>(null)

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const res = await api.get("/core/announcements")
      setAnnouncements(res.data?.data?.announcements || [])
    } catch {
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnnouncements() }, [])

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id))

  const active  = announcements.filter((a) => !a.expires_at || dayjs(a.expires_at).isAfter(dayjs()))
  const expired = announcements.filter((a) => a.expires_at && dayjs(a.expires_at).isBefore(dayjs()))

  return (
    <>
      <CreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchAnnouncements}
      />

      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#ACC8A2]/40 shadow-sm p-5">
        {/* Decorative bg blob */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #4e7740 0%, transparent 70%)" }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2d6a4f]" />
            <h3 className="text-sm font-black text-gray-800">Announcements</h3>
            {active.length > 0 && (
              <span className="text-[10px] bg-[#e8f5e9] text-[#2d6a4f] font-bold px-2 py-0.5 rounded-full">
                {active.length} active
              </span>
            )}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1a3112] px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#acc8a2]/50 to-transparent mb-4" />

        {/* Content */}
        {loading ? (
          <div className="flex justify-center gap-1.5 py-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#4e7740] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <BellOff className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-gray-400">No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Active */}
            {active.map((a) => (
              <AnnouncementCard
                key={a.announcement_id}
                a={a}
                expanded={expandedId === a.announcement_id}
                onToggle={() => toggleExpand(a.announcement_id)}
              />
            ))}

            {/* Expired (collapsed section) */}
            {expired.length > 0 && (
              <details className="group mt-3">
                <summary className="text-xs text-gray-400 font-semibold cursor-pointer list-none flex items-center gap-1.5 hover:text-gray-600 transition-colors select-none">
                  <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                  {expired.length} expired announcement{expired.length > 1 ? "s" : ""}
                </summary>
                <div className="mt-2 space-y-2">
                  {expired.map((a) => (
                    <AnnouncementCard
                      key={a.announcement_id}
                      a={a}
                      expanded={expandedId === a.announcement_id}
                      onToggle={() => toggleExpand(a.announcement_id)}
                    />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </>
  )
}
