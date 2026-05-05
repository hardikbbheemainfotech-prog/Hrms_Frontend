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

  if (state.loginDate === today) {
    if (!state.loginTime) {
      state.loginTime = Date.now()
    }
  } else {
    state.dailyWorkedMs = 0
    state.loginDate = today
    state.loginTime = Date.now()
    state.duration = 0
  }
},

    updateDuration(state) {
      if (state.loginTime) {
        state.duration =
          state.dailyWorkedMs + (Date.now() - state.loginTime)
      } else {
        state.duration = state.dailyWorkedMs
      }
    },

 logoutSession(state) {
  if (state.loginTime) {
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