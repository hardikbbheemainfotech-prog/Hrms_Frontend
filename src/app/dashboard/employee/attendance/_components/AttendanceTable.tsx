type AttendanceLog = {
  attendance_date?: string
  check_in?: string | null
  check_out?: string | null
  total_hours?: string | number
  status?: string
}

type Props = {
  data: AttendanceLog[]
  formatTime: (t?: string | null) => string
}

export default function AttendanceTable({ data, formatTime }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide">
          Daily Attendance Logs
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead className="bg-gray-50 text-[11px] uppercase text-gray-500 tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-green-600">Check In</th>
              <th className="px-6 py-4 text-red-600">Check Out</th>
              <th className="px-6 py-4 text-center">Hours</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">

            {data.length > 0 ? (
              data.map((log, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Date */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {log.attendance_date?.split("T")[0]}
                  </td>

                  {/* Check In */}
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {formatTime(log.check_in)}
                  </td>

                  {/* Check Out */}
                  <td className="px-6 py-4 font-semibold text-red-500">
                    {formatTime(log.check_out)}
                  </td>

                  {/* Hours */}
                  <td className="px-6 py-4 text-center font-mono text-gray-700">
                    {log.total_hours || "0.0"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold capitalize ${
                        log.status === "present"
                          ? "bg-green-100 text-green-700"
                          : log.status === "absent"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {log.status || "—"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  No attendance records found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  )
}