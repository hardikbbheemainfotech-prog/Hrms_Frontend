export type Employee = {
  employee_id: number
  first_name: string
  last_name: string
}

export type AttendanceRow = {
  employee_id: number
  first_name: string
  last_name: string
  check_in: string | null
  check_out: string | null
  status: string
}

export type SummaryRow = {
  status: string
  count: number
}

export type Announcement = {
  announcement_id: number
  title: string
  message: string
  announced_by: number
  expires_at: string | null
  target_roles: string[]
  created_at: string
  announcer_name?: string
}
export type Leave = {
  leave_id: number
  employee_id: number
  first_name: string
  last_name: string
  start_date: string
  end_date: string
  total_days: number
  reason: string
  status: string
  applied_at: string
}

export type RequestRow = {
    request_id: number
    first_name: string
    last_name: string
    type: string
    description: string
    status: string
    created_at: string
}

export type Policy = {
  policy_id: number
  policy_key: string
  policy_value: string
  description: string
  is_active: boolean
  publised_at: string
}

export type Job = {
  job_id: number
  title: string
  department: string
  location: string
  employee_type: string
  work_mode: string
  experience_min: number
  experience_max: number
  salary_min: number
  salary_max: number
  openings: number
  description?: string
  requirements?: string
  status? : string
  responsibilities?: string
  posted_by?: number
  updated_at?: string
  created_at: string
}