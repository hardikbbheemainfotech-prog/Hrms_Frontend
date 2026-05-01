import api from "@/lib/axios"
import { Megaphone, X } from "lucide-react"
import { useState } from "react"
import { ROLE_COLORS } from "./AnnouncementsPanel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ROLE_OPTIONS = ["hr", "manager", "employee", "admin"]


export  function CreateModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    expires_at: "",
    target_roles: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleRole = (role: string) =>
    setForm((prev) => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter((r) => r !== role)
        : [...prev.target_roles, role],
    }))

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required.")
      return
    }
    if (form.target_roles.length === 0) {
      setError("Select at least one target role.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await api.post("/hr/post_anounce", {
        ...form,
        expires_at: form.expires_at || null,
      })
      setForm({ title: "", message: "", expires_at: "", target_roles: [] })
      onCreated()
      onClose()
    } catch {
      setError("Failed to post announcement. Try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F1E9E4]/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E9E4]/30 bg-[#f4f8f2]">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#2d6a4f]" />
            <h2 className="text-sm font-black text-[#1a3112]">New Announcement</h2>
          </div>
          <Button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#e8f0e4] transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#1a3112] mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Office closure on Friday"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#F1E9E4]/60 bg-[#f9fbf8] focus:outline-none focus:ring-2 focus:ring-[#4e7740]/30 focus:border-[#4e7740] placeholder:text-gray-300 transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-[#1a3112] mb-1.5">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="Write the announcement details..."
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#F1E9E4]/60 bg-[#f9fbf8] focus:outline-none focus:ring-2 focus:ring-[#4e7740]/30 focus:border-[#4e7740] placeholder:text-gray-300 transition-all resize-none"
            />
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-xs font-semibold text-[#1a3112] mb-1.5">
              Target Roles <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => {
                const active = form.target_roles.includes(role)
                const colors = ROLE_COLORS[role]
                return (
                  <Button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize"
                    style={
                      active
                        ? { background: colors.bg, color: colors.text, borderColor: colors.text + "40" }
                        : { background: "#f5f5f5", color: "#999", borderColor: "#e5e5e5" }
                    }
                  >
                    {role}
                    {active && " ✓"}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-xs font-semibold text-[#1a3112] mb-1.5">
              Expires At <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <Input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#F1E9E4]/60 bg-[#f9fbf8] focus:outline-none focus:ring-2 focus:ring-[#4e7740]/30 focus:border-[#4e7740] transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1E9E4]/30 bg-[#f4f8f2] flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1a3112] rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Megaphone className="w-3 h-3" />
                Post Announcement
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}