'use client'

import { useState, useEffect, useCallback } from 'react'
import { Employee, Interview } from '@/types/mailTypes'
import api from '@/lib/axios'

interface Department {
  department_id: number
  name: string
}

interface UseHRDataReturn {
  employees: Employee[]
  interviews: Interview[]
  departments: Department[]
  loadingEmployees: boolean
  loadingInterviews: boolean
  loadingDepartments: boolean
  errorEmployees: string | null
  errorInterviews: string | null
  errorDepartments: string | null
  refetchEmployees: () => void
  refetchInterviews: () => void
  refetchDepartments: () => void
  getEmployeeById: (id: number) => Employee | undefined
  getInterviewById: (id: number) => Interview | undefined
}

export function useHRData(): UseHRDataReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingInterviews, setLoadingInterviews] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null)
  const [errorInterviews, setErrorInterviews] = useState<string | null>(null)
  const [errorDepartments, setErrorDepartments] = useState<string | null>(null)
  const [empTick, setEmpTick] = useState(0)
  const [intTick, setIntTick] = useState(0)
  const [deptTick, setDeptTick] = useState(0)

  useEffect(() => {
    setLoadingEmployees(true)
    setErrorEmployees(null)
    api
      .get('/core/employees')
      .then((res) => {
        const data = res.data
        setEmployees(Array.isArray(data) ? data : data?.data ?? data?.results ?? [])
      })
      .catch((e: Error) => setErrorEmployees(e.message))
      .finally(() => setLoadingEmployees(false))
  }, [empTick])

  useEffect(() => {
    setLoadingInterviews(true)
    setErrorInterviews(null)
    api
      .get('/hr/interviews')
      .then((res) => {
        const data = res.data?.data.interviews
        setInterviews(Array.isArray(data) ? data : data?.data ?? data?.results ?? [])
      })
      .catch((e: Error) => setErrorInterviews(e.message))
      .finally(() => setLoadingInterviews(false))
  }, [intTick])

  useEffect(() => {
    setLoadingDepartments(true)
    setErrorDepartments(null)
    api
      .get('/core/departments')
      .then((res) => {
        const data = res.data.data.data
        setDepartments(
          Array.isArray(data) ? data :
          Array.isArray(data?.departments) ? data.departments :
          data?.data?.departments ?? data?.data ?? []
        )
      })
      .catch((e: Error) => setErrorDepartments(e.message))
      .finally(() => setLoadingDepartments(false))
  }, [deptTick])
  const getEmployeeById = useCallback(
    (id: number) => employees.find((e) => e.employee_id === id),
    [employees]
  )

  const getInterviewById = useCallback(
    (id: number) => interviews.find((i) => i.interview_id === id),
    [interviews]
  )

  return {
    employees,
    interviews,
    departments,
    loadingEmployees,
    loadingInterviews,
    loadingDepartments,
    errorEmployees,
    errorInterviews,
    errorDepartments,
    refetchEmployees: () => setEmpTick((t) => t + 1),
    refetchInterviews: () => setIntTick((t) => t + 1),
    refetchDepartments: () => setDeptTick((t) => t + 1),
    getEmployeeById,
    getInterviewById,
  }
}