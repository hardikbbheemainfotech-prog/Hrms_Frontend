// components/IDCard.tsx
import dayjs from "dayjs"

interface Employee {
  employee_id: number | string
  first_name: string
  last_name: string
  email: string
  job_title: string
  department_name: string
  salary: number
  hire_date: string
  profile_image?: string
}

function getInitials(first: string, last: string) {
  return `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase()
}

function padId(id: number | string) {
  return String(id).padStart(3, "0")
}

export default function IDCard({ emp }: { emp: Employee }) {
  const name = `${emp.first_name} ${emp.last_name}`.trim()
  const initials = getInitials(emp.first_name, emp.last_name)

  return (
    <div className="flex flex-col space-x-2 items-center group">
  {/* Lanyard */}
  <div className="w-6 h-12 bg-[#1a3112] rounded-t-md relative z-10">
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-300 rounded-b-md" />
  </div>

  {/* Card */}
  <div className="bg-white rounded-2xl w-[260px] overflow-hidden relative z-20 
    shadow-lg transition-all duration-300 
    group-hover:-translate-y-2 group-hover:shadow-2xl">

    {/* Header */}
    <div className="bg-[#1a3112] px-3 py-2 text-center">
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

        {/* Avatar */}
        {emp.profile_image ? (
          <img
            src={emp.profile_image}
            alt={name}
            className="w-[62px] h-[62px] rounded-full border-2 border-white object-cover shadow-md"
          />
        ) : (
          <div className="w-[62px] h-[62px] rounded-full border-2 border-white bg-[#4e7740] flex items-center justify-center text-white font-bold text-lg shadow-md">
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="mt-3 text-[#1a3112] font-semibold text-[15px] text-center leading-tight">
        {name}
      </p>

      {/* Role */}
      <p className="text-[10px] text-[#4e7740] tracking-widest uppercase mt-1 mb-2 text-center">
        {emp.job_title || "Position"}
      </p>

      {/* Department */}
      {emp.department_name && (
        <span className="text-[11px] font-medium text-[#1a3112] bg-[#e6f2e6] px-3 py-0.5 rounded-full mb-3">
          {emp.department_name}
        </span>
      )}
    </div>

    {/* Divider */}
    <div className="w-full h-px bg-gray-200 my-2" />

    {/* Details */}
    <div className="px-4 pb-2 space-y-1.5 text-[11.5px]">
      {[
        { label: "ID", value: padId(emp.employee_id) },
        { label: "Joined", value: dayjs(emp.hire_date).format("DD MMM YYYY") },
        { label: "Email", value: emp.email },
        { label: "Salary", value: emp.salary ? `₹${Number(emp.salary).toLocaleString("en-IN")}` : "—" },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between gap-2">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-[#1a3112] text-right truncate max-w-[130px]" title={value}>
            {value}
          </span>
        </div>
      ))}
    </div>

    {/* Bottom accent */}
    <div className="flex justify-center mt-3">
      <div className="w-10 h-1.5 bg-[#1a3112] rounded-full opacity-80" />
    </div>

    {/* Footer */}
    <p className="text-center text-[9px] text-[#4e7740] tracking-wide py-2">
      bheemainfotech.in
    </p>
  </div>
</div>
  )
}