import { Cake, PartyPopper } from "lucide-react"

export function getInitials(first: string, last: string) {
  return `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase()
}


export function BirthdayCard({ emp }: { emp: any }) {
  const initials = getInitials(emp.first_name, emp.last_name)
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[200px]">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {emp.profile_image ? (
          <img src={emp.profile_image} alt={emp.first_name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white text-sm font-bold ring-2 ring-pink-200">
            {initials}
          </div>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 text-xs"><Cake/></span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 truncate">{emp.first_name} {emp.last_name}</p>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{emp.job_title || "Employee"}</p>
      </div>
      {/* Wish */}
      <button className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
        Wish <PartyPopper/>
      </button>
    </div>
  )
}