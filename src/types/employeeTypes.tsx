export type AttendanceLog = {
  attendance_date?: string
  check_in?: string | null
  check_out?: string | null
  total_hours?: string | number
  status?: string
}

export type Props = {
  data: AttendanceLog[]
  formatTime: (t?: string | null) => string
}

export type LeaveSummaryItem = {
  leave_type_id: number
  leave_type: string
  total_days?: number
  remaining_days?: number
  taken_days?: number
}

export type LeavePayload = {
  leave_type_id: number
  start_date: string
  end_date: string
  total_days: number
  reason: string
}

export type LeaveProps = {
  leaveSummary: LeaveSummaryItem[]
  onSubmit: (data: LeavePayload) => void
  loading: boolean
}

