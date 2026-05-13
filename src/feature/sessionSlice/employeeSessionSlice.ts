// employeeSessionSlice.ts

import { createSlice } from "@reduxjs/toolkit"

interface SessionState {
  loginTime: number | null
  dailyWorkedMs: number
  loginDate: string | null
  duration: number
}

const initialState: SessionState = {
  loginTime: null,
  dailyWorkedMs: 0,
  loginDate: null,
  duration: 0,
}

const employeeSessionSlice = createSlice({
  name: "employeeSession",
  initialState,
  reducers: {
    initializeSession(state) {
      const today = new Date().toDateString()

      // Same day session
      if (state.loginDate === today) {
        // Preserve original loginTime if already exists
        if (state.loginTime !== null) {
          return
        }

        // User logged out earlier today, continue from previous work
        if (state.dailyWorkedMs > 0) {
          state.loginTime = Date.now()
          return
        }

        // First login today
        state.loginTime = Date.now()
        return
      }

      // New day reset
      state.dailyWorkedMs = 0
      state.loginDate = today
      state.loginTime = Date.now()
      state.duration = 0
    },

    updateDuration(state) {
      if (state.loginTime !== null) {
        state.duration =
          state.dailyWorkedMs + (Date.now() - state.loginTime)
      } else {
        state.duration = state.dailyWorkedMs
      }
    },

    logoutSession(state) {
      if (state.loginTime !== null) {
        state.dailyWorkedMs += Date.now() - state.loginTime
      }

      state.loginTime = null
      state.duration = state.dailyWorkedMs
    },

    resetSession(state) {
      state.loginTime = null
      state.dailyWorkedMs = 0
      state.loginDate = null
      state.duration = 0
    },
  },
})

export const {
  initializeSession,
  updateDuration,
  logoutSession,
  resetSession,
} = employeeSessionSlice.actions

export default employeeSessionSlice.reducer
