export const mail_constant_keys = {
  INTERVIEW_INVITATION: 'INTERVIEW_INVITATION',
  INTERVIEW_RESCHEDULED: 'INTERVIEW_RESCHEDULED',
  CANDIDATE_SELECTED: 'CANDIDATE_SELECTED',
  CANDIDATE_REJECTION: 'CANDIDATE_REJECTION',
  NEXT_ROUND_INVITATION: 'NEXT_ROUND_INVITATION',
  OFFER_LETTER: 'OFFER_LETTER',
  JOINING_INSTRUCTIONS: 'JOINING_INSTRUCTIONS',
  GENERAL_EMPLOYEE_NOTIFICATION: 'GENERAL_EMPLOYEE_NOTIFICATION',
} as const

export type MailKey = keyof typeof mail_constant_keys

export interface Employee {
  employee_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  hire_date: string
  job_title: string
  department_id: number
  salary: number
  manager_id: number | null
  status: string
  profile_image: string | null
  date_of_birth: string | null
  profile_public_key: string | null
}

export interface Interview {
  interview_id: number
  candidate_name: string
  job_id: number
  interview_type: string
  interview_mode: string
  interviewer_id: number
  scheduled_at: string
  started_at: string | null
  ended_at: string | null
  status: string
  result: string | null
  feedback: string | null
  rating: number | null
  location: string | null
  created_at: string
  updated_at: string
}
