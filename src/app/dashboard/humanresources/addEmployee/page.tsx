"use client"

import React, { useState } from "react"
import axios from "axios"

export default function AddEmployeeModal({ open, setOpen, onSuccess }: any) {

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
  })

  const handleSubmit = async () => {
    try {
      await axios.post("/api/employees", form)
      onSuccess()
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl w-[400px] shadow-xl">

        <h2 className="text-lg font-semibold mb-4">Add Employee</h2>

        <div className="flex flex-col gap-3">

          <input
            placeholder="First Name"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />

          <input
            placeholder="Last Name"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Job Title"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, job_title: e.target.value })}
          />

        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#1A2517] text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  )
}