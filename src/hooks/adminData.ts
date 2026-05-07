'use client'

import { useState, useEffect, useCallback } from 'react'
import { Employee } from '@/types/mailTypes'
import api from '@/lib/axios'

interface Department {
  department_id: number
  name: string
}

interface UseAdminDataReturn {
  employees: Employee[]
  departments: Department[]
  loadingEmployees: boolean
  loadingDepartments: boolean
  errorEmployees: string | null
  errorDepartments: string | null
  refetchEmployees: () => void
  refetchDepartments: () => void
  getEmployeeById: (id: number) => Employee | undefined
}

export function useAdminData(): UseAdminDataReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  const [errorEmployees, setErrorEmployees] = useState<string | null>(null)
  const [errorDepartments, setErrorDepartments] = useState<string | null>(null)

  const [empTick, setEmpTick] = useState(0)
  const [deptTick, setDeptTick] = useState(0)


  useEffect(() => {
    setLoadingEmployees(true)
    setErrorEmployees(null)

    api
      .get('/core/employees')
      .then((res) => {
        const data = res.data

        setEmployees(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.results)
            ? data.results
            : []
        )
      })
      .catch((e: any) => {
        setErrorEmployees(
          e?.response?.data?.message ||
            e.message ||
            'Failed to load employees'
        )
      })
      .finally(() => {
        setLoadingEmployees(false)
      })
  }, [empTick])

  useEffect(() => {
    setLoadingDepartments(true)
    setErrorDepartments(null)

    api
      .get('/core/departments')
      .then((res) => {
        const data = res.data?.data?.data

        setDepartments(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.departments)
            ? data.departments
            : Array.isArray(data?.data)
            ? data.data
            : []
        )
      })
      .catch((e: any) => {
        setErrorDepartments(
          e?.response?.data?.message ||
            e.message ||
            'Failed to load departments'
        )
      })
      .finally(() => {
        setLoadingDepartments(false)
      })
  }, [deptTick])

  const getEmployeeById = useCallback(
    (id: number) => {
      return employees.find(
        (employee) => employee.employee_id === id
      )
    },
    [employees]
  )

  return {
    employees,
    departments,

    loadingEmployees,
    loadingDepartments,

    errorEmployees,
    errorDepartments,

    refetchEmployees: () =>
      setEmpTick((prev) => prev + 1),

    refetchDepartments: () =>
      setDeptTick((prev) => prev + 1),

    getEmployeeById,
  }
}